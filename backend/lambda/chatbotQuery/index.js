import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import OpenAI from "openai";

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-west-2" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler = async (event) => {
  try {
    console.log("Chatbot query request:", JSON.stringify(event, null, 2));

    const { query, filters } = JSON.parse(event.body);

    if (!query || query.length < 3) {
      return errorResponse(400, "Query too short (minimum 3 characters)");
    }

    // 1. Generate query embedding
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: query
    });

    // 2. Get all calls from S3 (for MVP, we'll do simple matching)
    // In production, this would use S3 Vectors for semantic search
    const calls = await getAllCalls();

    // 3. For MVP: Use simple text search + embedding similarity on all chunks
    const relevantChunks = await findRelevantChunks(calls, query, queryEmbedding.data[0].embedding, filters);

    if (relevantChunks.length === 0) {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({
          answer: "I couldn't find any relevant information in the calls to answer your question. Try rephrasing or ask about a different topic.",
          sources: []
        })
      };
    }

    // 4. Build context from top results
    const context = relevantChunks.slice(0, 10);

    // 5. Generate answer with GPT-4
    const answer = await openai.chat.completions.create({
      model: "gpt-4-turbo-2024-04-09",
      messages: [
        {
          role: "system",
          content: `You are analyzing customer discovery calls. Answer questions based on the provided excerpts from customer calls.
          Always cite which call(s) you're referencing by mentioning the participant name and date.
          Be specific and use direct quotes when possible.
          If the information isn't in the provided context, say so.`
        },
        {
          role: "user",
          content: `CONTEXT FROM CALLS:\n${context.map((c, i) =>
            `[${i + 1}] Call with ${c.participantName} from ${c.company} (${formatDate(c.callDate)}):\n${c.text}`
          ).join('\n\n')}\n\nQUESTION: ${query}\n\nProvide a clear answer with specific call citations.`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    // 6. Extract unique sources
    const uniqueSources = getUniqueSources(context);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        answer: answer.choices[0].message.content,
        sources: uniqueSources.slice(0, 5)
      })
    };

  } catch (error) {
    console.error("Query error:", error);
    return errorResponse(500, error.message);
  }
};

async function getAllCalls() {
  const calls = [];

  // List all call directories
  const listResponse = await s3.send(new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: 'calls/',
    Delimiter: '/'
  }));

  if (!listResponse.CommonPrefixes) {
    return calls;
  }

  // Get metadata for each call
  for (const prefix of listResponse.CommonPrefixes) {
    const callId = prefix.Prefix.split('/')[1];
    try {
      const metadata = await getCallMetadata(callId);
      if (metadata) {
        calls.push(metadata);
      }
    } catch (error) {
      console.error(`Failed to get metadata for call ${callId}:`, error);
    }
  }

  return calls;
}

async function getCallMetadata(callId) {
  try {
    const response = await s3.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `calls/${callId}/metadata.json`
    }));

    const body = await streamToString(response.Body);
    return JSON.parse(body);
  } catch (error) {
    console.error(`Error getting metadata for ${callId}:`, error);
    return null;
  }
}

async function getCallChunks(callId) {
  try {
    const response = await s3.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `calls/${callId}/chunks.json`
    }));

    const body = await streamToString(response.Body);
    return JSON.parse(body);
  } catch (error) {
    console.error(`Error getting chunks for ${callId}:`, error);
    return [];
  }
}

async function findRelevantChunks(calls, query, queryEmbedding, filters) {
  const allChunks = [];

  // Apply filters
  let filteredCalls = calls;
  if (filters) {
    filteredCalls = applyFilters(calls, filters);
  }

  // Get chunks for each call and calculate simple relevance
  for (const call of filteredCalls) {
    const chunks = await getCallChunks(call.callId);

    for (const chunk of chunks) {
      // Simple keyword matching for MVP (would use vector similarity in production)
      const relevanceScore = calculateSimpleRelevance(query.toLowerCase(), chunk.text.toLowerCase());

      if (relevanceScore > 0) {
        allChunks.push({
          callId: call.callId,
          participantName: call.participantName || "Unknown",
          company: call.company || "Unknown",
          callDate: call.callDate,
          text: chunk.text,
          relevanceScore
        });
      }
    }
  }

  // Sort by relevance score
  allChunks.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return allChunks;
}

function calculateSimpleRelevance(query, text) {
  const queryWords = query.split(/\s+/).filter(w => w.length > 3);
  let score = 0;

  for (const word of queryWords) {
    const count = (text.match(new RegExp(word, 'g')) || []).length;
    score += count;
  }

  return score;
}

function applyFilters(calls, filters) {
  return calls.filter(call => {
    if (filters.dateRange) {
      const callDate = new Date(call.callDate);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);

      if (callDate < startDate || callDate > endDate) {
        return false;
      }
    }

    if (filters.participantName) {
      if (!call.participantName?.toLowerCase().includes(filters.participantName.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

function getUniqueSources(chunks) {
  const seenCallIds = new Set();
  const sources = [];

  for (const chunk of chunks) {
    if (!seenCallIds.has(chunk.callId)) {
      seenCallIds.add(chunk.callId);
      sources.push({
        callId: chunk.callId,
        participantName: chunk.participantName,
        company: chunk.company,
        callDate: chunk.callDate,
        relevanceScore: chunk.relevanceScore
      });
    }
  }

  return sources;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  };
}

function errorResponse(statusCode, message) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify({ error: message })
  };
}
