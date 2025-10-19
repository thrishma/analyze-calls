import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-west-2" });

export const handler = async (event) => {
  try {
    console.log("Get calls request:", JSON.stringify(event, null, 2));

    const { pathParameters, queryStringParameters } = event;

    // Check if this is a request for a specific call
    if (pathParameters && pathParameters.callId) {
      return await getCallDetail(pathParameters.callId);
    }

    // Otherwise, list all calls
    return await listCalls(queryStringParameters || {});

  } catch (error) {
    console.error("Error retrieving calls:", error);
    return errorResponse(500, error.message);
  }
};

async function listCalls(params) {
  const limit = Math.min(parseInt(params.limit || '20'), 100);
  const offset = parseInt(params.offset || '0');
  const sortBy = params.sortBy || 'date';
  const order = params.order || 'desc';

  // List all call directories
  const listResponse = await s3.send(new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: 'calls/',
    Delimiter: '/'
  }));

  if (!listResponse.CommonPrefixes) {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        calls: [],
        pagination: {
          total: 0,
          offset: 0,
          limit: limit,
          hasMore: false
        }
      })
    };
  }

  // Get metadata for each call
  const calls = [];
  for (const prefix of listResponse.CommonPrefixes) {
    const callId = prefix.Prefix.split('/')[1];
    try {
      const metadata = await getCallMetadata(callId);
      if (metadata) {
        // Get transcript preview
        const transcript = await getTranscriptPreview(callId);

        calls.push({
          callId: metadata.callId,
          participantName: metadata.participantName || "Unknown",
          company: metadata.company || metadata.linkedInProfile?.company || "Unknown",
          callDate: metadata.callDate,
          summary: transcript.substring(0, 200) + (transcript.length > 200 ? '...' : ''),
          insights: metadata.insights || {
            painPoints: [],
            featureRequests: [],
            objections: []
          },
          insightsCount: {
            painPoints: metadata.insights?.painPoints?.length || 0,
            featureRequests: metadata.insights?.featureRequests?.length || 0,
            objections: metadata.insights?.objections?.length || 0
          }
        });
      }
    } catch (error) {
      console.error(`Failed to get call ${callId}:`, error);
    }
  }

  // Sort calls
  calls.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.callDate);
      const dateB = new Date(b.callDate);
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    } else if (sortBy === 'participant') {
      return order === 'desc'
        ? b.participantName.localeCompare(a.participantName)
        : a.participantName.localeCompare(b.participantName);
    }
    return 0;
  });

  // Paginate
  const total = calls.length;
  const paginatedCalls = calls.slice(offset, offset + limit);

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({
      calls: paginatedCalls,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total
      }
    })
  };
}

async function getCallDetail(callId) {
  try {
    // Get metadata
    const metadata = await getCallMetadata(callId);
    if (!metadata) {
      return errorResponse(404, `Call ${callId} not found`);
    }

    // Get full transcript
    const transcript = await getTranscript(callId);

    // Construct full call object
    const callDetail = {
      ...metadata,
      transcript
    };

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(callDetail)
    };

  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return errorResponse(404, `Call ${callId} not found`);
    }
    throw error;
  }
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
    if (error.name === 'NoSuchKey') {
      return null;
    }
    throw error;
  }
}

async function getTranscript(callId) {
  try {
    const response = await s3.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `calls/${callId}/transcript.txt`
    }));

    return await streamToString(response.Body);
  } catch (error) {
    console.error(`Error getting transcript for ${callId}:`, error);
    return "";
  }
}

async function getTranscriptPreview(callId) {
  try {
    const response = await s3.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `calls/${callId}/transcript.txt`,
      Range: 'bytes=0-500'  // Get first 500 bytes for preview
    }));

    return await streamToString(response.Body);
  } catch (error) {
    console.error(`Error getting transcript preview for ${callId}:`, error);
    return "";
  }
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
