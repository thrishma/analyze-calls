import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-west-2" });

export const handler = async (event) => {
  try {
    console.log("Delete call request:", JSON.stringify(event, null, 2));

    // Get callId from path parameters
    const callId = event.pathParameters?.callId;

    if (!callId) {
      return errorResponse(400, "Call ID is required");
    }

    // List all objects under the call prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: `calls/${callId}/`
    });

    const listResponse = await s3.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      return errorResponse(404, "Call not found");
    }

    // Delete all objects for this call
    const objectsToDelete = listResponse.Contents.map(obj => ({ Key: obj.Key }));

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Delete: {
        Objects: objectsToDelete
      }
    });

    await s3.send(deleteCommand);

    console.log(`Deleted ${objectsToDelete.length} objects for call ${callId}`);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: "Call deleted successfully",
        callId,
        deletedObjects: objectsToDelete.length
      })
    };

  } catch (error) {
    console.error("Error deleting call:", error);
    return errorResponse(500, error.message);
  }
};

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
