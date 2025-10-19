# Backend - AWS SAM Application

Serverless backend for the Call Analysis Platform using AWS Lambda, API Gateway, and S3.

## Prerequisites

1. AWS CLI installed and configured
2. AWS SAM CLI installed
3. OpenAI API key

## Installation

### 1. Install Dependencies

```bash
# Install dependencies for each Lambda function
cd lambda/processCall && npm install && cd ../..
cd lambda/chatbotQuery && npm install && cd ../..
cd lambda/getCalls && npm install && cd ../..
```

### 2. Store OpenAI API Key

```bash
# Store in AWS Parameter Store
aws ssm put-parameter \
  --name /call-analysis/dev/openai-api-key \
  --value "sk-your-openai-api-key-here" \
  --type SecureString \
  --region us-west-2
```

### 3. Build Application

```bash
sam build
```

### 4. Deploy to AWS

First deployment (guided):
```bash
sam deploy --guided
```

You'll be prompted for:
- **Stack Name**: `call-analysis-dev`
- **AWS Region**: `us-west-2` (or your preferred region)
- **Parameter OpenAIAPIKey**: Leave default (reads from Parameter Store)
- **Confirm changes before deploy**: Y
- **Allow SAM CLI IAM role creation**: Y
- **Disable rollback**: N
- **Save arguments to configuration file**: Y

Subsequent deployments:
```bash
sam deploy
```

### 5. Note API URL

After deployment, SAM will output:
```
CloudFormation outputs from deployed stack
--------------------------------------------------------------------------
Outputs
--------------------------------------------------------------------------
Key                 ApiUrl
Description         API Gateway endpoint URL
Value               https://xxxxx.execute-api.us-west-2.amazonaws.com/dev
--------------------------------------------------------------------------
```

Copy this URL for frontend configuration.

## Local Development

### Test Lambda Locally

Create test event file:
```bash
mkdir -p events
cat > events/process-call.json << EOF
{
  "body": "{\"transcript\":\"This is a test transcript with some customer feedback about our product.\",\"metadata\":{\"participantName\":\"Test User\",\"callDate\":\"2025-10-19T14:00:00Z\"}}"
}
EOF
```

Invoke function:
```bash
sam local invoke ProcessCallFunction --event events/process-call.json
```

### Run API Locally

```bash
sam local start-api
```

API will be available at http://localhost:3000

## Lambda Functions

### ProcessCallHandler
- **Path**: `lambda/processCall/`
- **Endpoint**: `POST /calls`
- **Purpose**: Analyzes call transcripts using GPT-4
- **Timeout**: 180 seconds
- **Memory**: 1536 MB

### ChatbotQueryHandler
- **Path**: `lambda/chatbotQuery/`
- **Endpoint**: `POST /chat/query`
- **Purpose**: Handles natural language queries
- **Timeout**: 60 seconds
- **Memory**: 512 MB

### GetCallsHandler
- **Path**: `lambda/getCalls/`
- **Endpoints**:
  - `GET /calls` - List all calls
  - `GET /calls/{callId}` - Get call detail
- **Timeout**: 30 seconds
- **Memory**: 256 MB

## S3 Bucket Structure

The SAM template creates an S3 bucket with this structure:

```
call-analysis-data-dev-{account-id}/
└── calls/
    └── {callId}/
        ├── transcript.txt
        ├── linkedin-screenshot.png
        ├── metadata.json
        └── chunks.json
```

## Monitoring

View logs in CloudWatch:
```bash
# Get log group names
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/call-analysis

# Tail logs for a function
sam logs -n ProcessCallFunction --stack-name call-analysis-dev --tail
```

## Cleanup

To delete all resources:
```bash
sam delete --stack-name call-analysis-dev
```

**Warning**: This will delete the S3 bucket and all call data!

## Troubleshooting

### OpenAI API Errors
- Check API key is correctly stored in Parameter Store
- Verify key has sufficient credits
- Check for rate limiting

### Lambda Timeouts
- Increase timeout in template.yaml
- Check CloudWatch logs for specific errors
- Verify OpenAI API is responding

### CORS Errors
- Ensure all Lambda functions return CORS headers
- Check API Gateway CORS configuration in template.yaml

## Cost Optimization

- Lambda functions auto-scale and you only pay for execution time
- S3 storage is ~$0.023/GB/month
- Consider implementing:
  - Prompt caching for repeated analyses
  - Batch processing for multiple calls
  - CloudWatch alarms for cost monitoring
