import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-west-2" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler = async (event) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'OK' })
    };
  }

  try {
    console.log("Processing call request:", JSON.stringify(event, null, 2));

    // 1. Parse input
    const body = JSON.parse(event.body);
    const { transcript, linkedinScreenshot: linkedinExperience, metadata } = body;

    // Validate required fields
    if (!metadata?.participantName) {
      return errorResponse(400, "Participant name is required");
    }
    if (!metadata?.company) {
      return errorResponse(400, "Company is required");
    }
    if (!metadata?.callDate) {
      return errorResponse(400, "Call date is required");
    }
    if (!metadata?.linkedinProfileUrl) {
      return errorResponse(400, "LinkedIn Profile URL is required");
    }

    // Validate that at least one of transcript or notes is provided
    const notes = metadata?.notes;
    if ((!transcript || transcript.length < 100) && (!notes || notes.length < 50)) {
      return errorResponse(400, "Either transcript (min 100 chars) or notes (min 50 chars) is required");
    }

    const callId = uuidv4();
    console.log(`Processing call: ${callId}`);

    // 2. Extract LinkedIn data from pasted experience text if provided
    let linkedInProfile = {};
    if (linkedinExperience && typeof linkedinExperience === 'string') {
      try {
        linkedInProfile = await extractLinkedInDataFromText(linkedinExperience);
        // Add profile URL if provided
        if (metadata?.linkedinProfileUrl) {
          linkedInProfile.profileUrl = metadata.linkedinProfileUrl;
        }
      } catch (error) {
        console.error("LinkedIn extraction failed:", error);
        // Continue processing even if LinkedIn extraction fails
        linkedInProfile = { error: "Failed to extract LinkedIn data" };
      }
    }

    // 3. Analyze transcript (GPT-4 Turbo) - only if transcript is provided
    let insights = null;
    if (transcript && transcript.length >= 100) {
      insights = await analyzeTranscript(transcript);
    } else {
      // If only notes are provided, create empty insights structure
      insights = {
        painPoints: [],
        featureRequests: [],
        objections: []
      };
    }

    // 4. Store raw data in S3
    await storeRawData(callId, transcript, linkedinExperience, metadata);

    // 5. Generate embeddings and prepare for vector storage
    // Combine transcript and notes for chunking so notes are searchable
    let textToChunk = '';
    if (transcript) {
      textToChunk = transcript;
    }
    if (metadata?.notes) {
      if (textToChunk) {
        textToChunk = textToChunk + "\n\n--- Additional Notes ---\n\n" + metadata.notes;
      } else {
        textToChunk = metadata.notes;
      }
    }
    const chunks = chunkText(textToChunk, 1000, 200);

    // For now, we'll store chunk information in metadata
    // Note: S3 Vectors integration will be added when available
    await storeChunks(callId, chunks);

    // 6. Store metadata JSON
    const callMetadata = {
      callId,
      callDate: metadata?.callDate || new Date().toISOString(),
      participantName: metadata?.participantName || "Unknown",
      company: linkedInProfile?.company || metadata?.company || "Unknown",
      linkedInProfile,
      insights,
      notes: metadata?.notes || null,
      metadata: {
        processedAt: new Date().toISOString(),
        chunkCount: chunks.length,
        transcriptWordCount: transcript ? transcript.split(/\s+/).length : 0,
        hasTranscript: !!transcript,
        hasNotes: !!metadata?.notes,
        callDuration: metadata?.callDuration || null
      }
    };

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `calls/${callId}/metadata.json`,
      Body: JSON.stringify(callMetadata, null, 2),
      ContentType: "application/json"
    }));

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(callMetadata)
    };

  } catch (error) {
    console.error("Error processing call:", error);
    return errorResponse(500, error.message);
  }
};

// Helper functions
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

async function extractLinkedInDataFromText(experienceText) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-2024-04-09",
    messages: [
      {
        role: "system",
        content: `You are an expert at parsing LinkedIn profile experience sections.
        Extract the following information from the pasted LinkedIn experience text:
        - Current role (job title from the most recent position)
        - Company name (from the most recent position)
        - Past experience (list of previous roles with company and duration)
        - Top skills mentioned in the experience descriptions

        Return ONLY valid JSON.`
      },
      {
        role: "user",
        content: `LINKEDIN EXPERIENCE TEXT:\n${experienceText}\n\nExtract structured data as JSON with this schema:
        {
          "currentRole": "job title",
          "company": "company name",
          "pastExperience": [
            {"role": "title", "company": "company", "duration": "X years/mos", "description": "brief summary"}
          ],
          "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"]
        }`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.1
  });

  return JSON.parse(response.choices[0].message.content);
}

async function analyzeTranscript(transcript) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-2024-04-09",
    messages: [
      {
        role: "system",
        content: `You are an expert at analyzing customer discovery calls.
        Extract pain points, feature requests, and objections with supporting quotes from the transcript.
        For each item, provide:
        - text: A clear, concise description
        - quote: The exact quote from the transcript that supports this
        - severity/priority: low, medium, or high
        - confidence: A score from 0-1 indicating your confidence in this extraction

        Return structured JSON ONLY.`
      },
      {
        role: "user",
        content: `TRANSCRIPT:\n${transcript}\n\nExtract all insights as structured JSON with this schema:
        {
          "painPoints": [{"text": "...", "quote": "...", "severity": "high|medium|low", "confidence": 0.95}],
          "featureRequests": [{"text": "...", "quote": "...", "priority": "high|medium|low", "confidence": 0.95}],
          "objections": [{"text": "...", "quote": "...", "confidence": 0.95}]
        }`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.1
  });

  return JSON.parse(response.choices[0].message.content);
}

function chunkText(text, chunkSize, overlap) {
  const chunks = [];
  const words = text.split(/\s+/);

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

async function storeRawData(callId, transcript, linkedinExperience, metadata) {
  // Store transcript if provided
  if (transcript) {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `calls/${callId}/transcript.txt`,
      Body: transcript,
      ContentType: "text/plain"
    }));
  }

  // Store LinkedIn experience text if provided
  if (linkedinExperience && typeof linkedinExperience === 'string') {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `calls/${callId}/linkedin-experience.txt`,
      Body: linkedinExperience,
      ContentType: "text/plain"
    }));
  }

  // Store notes if provided
  if (metadata?.notes) {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `calls/${callId}/notes.txt`,
      Body: metadata.notes,
      ContentType: "text/plain"
    }));
  }
}

async function storeChunks(callId, chunks) {
  // Store chunks for retrieval
  const chunksData = chunks.map((chunk, index) => ({
    chunkIndex: index,
    text: chunk
  }));

  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `calls/${callId}/chunks.json`,
    Body: JSON.stringify(chunksData, null, 2),
    ContentType: "application/json"
  }));
}

// Helper functions
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
}
