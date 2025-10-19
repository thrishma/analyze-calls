# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Customer Discovery Call Analysis Platform** - A full-stack web application that analyzes customer discovery and validation call transcripts to identify patterns, pain points, feature requests, and objections. The platform uses AI (GPT-4) to extract insights and provides an intelligent chatbot interface for querying across all calls.

### Tech Stack

**Backend:**
- AWS Lambda (Node.js 20.x) for serverless compute
- AWS API Gateway for REST API
- AWS S3 for file storage
- AWS SAM for infrastructure as code
- OpenAI GPT-4 Turbo for transcript analysis
- OpenAI GPT-4 Vision for LinkedIn profile extraction
- OpenAI text-embedding-3-large for semantic search embeddings

**Frontend:**
- React 18 with Vite build tool
- Chakra UI for component library
- React Router for routing
- Axios for API calls
- react-dropzone for file uploads

## Project Structure

```
analyze-calls/
├── backend/
│   ├── template.yaml              # AWS SAM template
│   └── lambda/
│       ├── processCall/           # Analyzes call transcripts
│       │   ├── index.js
│       │   └── package.json
│       ├── chatbotQuery/          # Handles chatbot queries
│       │   ├── index.js
│       │   └── package.json
│       └── getCalls/              # Retrieves call data
│           ├── index.js
│           └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js          # API client configuration
    │   ├── components/
    │   │   └── Layout.jsx         # Main layout with navigation
    │   ├── pages/
    │   │   ├── Home.jsx           # Dashboard with stats
    │   │   ├── UploadCall.jsx     # Upload & analyze calls
    │   │   ├── CallDetail.jsx     # View call insights
    │   │   └── Chatbot.jsx        # Query interface
    │   ├── App.jsx                # Main app with routing
    │   └── main.jsx               # Entry point
    ├── package.json
    └── vite.config.js
```

## Development Commands

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

```bash
cd backend

# Install Lambda dependencies (run for each Lambda function)
cd lambda/processCall && npm install && cd ../..
cd lambda/chatbotQuery && npm install && cd ../..
cd lambda/getCalls && npm install && cd ../..

# Build SAM application
sam build

# Deploy to AWS (first time - guided setup)
sam deploy --guided

# Deploy to AWS (subsequent deployments)
sam deploy

# Test Lambda function locally
sam local invoke ProcessCallFunction --event events/process-call.json

# Run API Gateway locally
sam local start-api
```

## Architecture

### Data Flow

**1. Call Upload & Analysis (ProcessCallHandler):**
- User uploads transcript + LinkedIn screenshot → API Gateway → Lambda
- Lambda extracts LinkedIn data with GPT-4 Vision
- Lambda analyzes transcript with GPT-4 Turbo (pain points, features, objections)
- Stores raw data in S3: `calls/{callId}/transcript.txt`, `linkedin-screenshot.png`, `metadata.json`
- Generates text chunks and stores in `calls/{callId}/chunks.json`
- Returns structured insights to frontend

**2. Call Retrieval (GetCallsHandler):**
- Lists all calls or gets specific call detail
- Reads from S3 bucket structure
- Returns paginated list or full call data

**3. Chatbot Query (ChatbotQueryHandler):**
- User asks question → Lambda generates query embedding
- Searches across all call chunks (simple keyword matching in MVP, semantic search in production)
- Retrieves relevant chunks and passes to GPT-4 for synthesis
- Returns answer with source citations (links to specific calls)

### S3 Bucket Structure

```
call-analysis-data-{stage}/
└── calls/
    └── {callId}/
        ├── transcript.txt          # Raw transcript
        ├── linkedin-screenshot.png # LinkedIn profile image
        ├── metadata.json           # Structured call data
        └── chunks.json             # Text chunks for search
```

### API Endpoints

- `POST /calls` - Process new call (upload transcript + screenshot)
- `GET /calls` - List all calls with pagination
- `GET /calls/{callId}` - Get specific call details
- `POST /chat/query` - Query chatbot with natural language

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/dev
```

### Backend (AWS Parameter Store)
```
/call-analysis/dev/openai-api-key    # OpenAI API key
```

## AWS Deployment

### Prerequisites
1. AWS CLI configured with credentials
2. AWS SAM CLI installed
3. OpenAI API key

### Initial Setup

```bash
# 1. Store OpenAI API key in Parameter Store
aws ssm put-parameter \
  --name /call-analysis/dev/openai-api-key \
  --value "sk-your-key-here" \
  --type SecureString

# 2. Build and deploy backend
cd backend
sam build
sam deploy --guided
# Follow prompts:
# - Stack name: call-analysis-dev
# - AWS Region: us-west-2
# - Parameter OpenAIAPIKey: /call-analysis/dev/openai-api-key
# - Confirm changeset: Y
# - Save arguments to config: Y

# 3. Note the API URL from outputs
# Output: ApiUrl = https://xxxxx.execute-api.us-west-2.amazonaws.com/dev

# 4. Configure frontend
cd ../frontend
echo "VITE_API_BASE_URL=https://xxxxx.execute-api.us-west-2.amazonaws.com/dev" > .env

# 5. Deploy frontend to Amplify
# - Push code to GitHub
# - Connect GitHub repo to AWS Amplify
# - Amplify will auto-deploy from main branch
```

## Key Implementation Details

### GPT-4 Prompts

**Transcript Analysis:**
- Extracts pain points with severity (high/medium/low), supporting quotes, and confidence scores
- Identifies feature requests with priority and confidence
- Detects objections and concerns with supporting evidence
- Uses JSON mode for structured output

**LinkedIn Extraction:**
- Uses GPT-4 Vision to parse screenshot
- Extracts: current role, company, past experience (last 3), top 5 skills
- Gracefully handles failures (continues processing if extraction fails)

### Chunking Strategy
- Chunk size: 1000 words
- Overlap: 200 words (for context continuity)
- Chunks stored with metadata for retrieval

### Error Handling
- All Lambda functions return CORS headers
- Graceful degradation (LinkedIn extraction failure doesn't block analysis)
- Frontend shows loading states and error toasts
- Comprehensive try-catch blocks with logging

## Future Enhancements (from PDR)

### Phase 2 - Vector Search
- Integrate AWS S3 Vectors for semantic search
- Replace simple keyword matching with cosine similarity
- Enable filters by date range, participant, company

### Phase 3 - Advanced Features
- PDF/CSV export of insights
- Pattern analysis across multiple calls (automated Lambda)
- Metadata enrichment (Crunchbase API)
- Prompt caching for cost optimization

### Phase 4 - Scale & Optimize
- Add Redis for query caching
- Implement batch processing for embeddings
- Set up CloudWatch monitoring and alarms
- Integration with Gong/Chorus/Fireflies

## Testing

```bash
# Frontend unit tests (when added)
cd frontend
npm test

# Backend unit tests (when added)
cd backend/lambda/processCall
npm test

# E2E tests with Playwright (when added)
cd frontend
npx playwright test
```

## Cost Estimates

**For 100 calls/month:**
- Lambda: ~$5/month
- S3 Storage: ~$1/month
- API Gateway: ~$3.50/month
- OpenAI API: ~$10-20/month (GPT-4 calls)
- **Total: ~$20-30/month**

## Troubleshooting

### Common Issues

**Lambda timeout on large transcripts:**
- Increase timeout in template.yaml (default: 120s, max: 900s)
- Consider chunking analysis for very long calls

**CORS errors:**
- Verify API Gateway CORS configuration in template.yaml
- Check that Lambda returns CORS headers in all responses

**Frontend can't connect to API:**
- Verify VITE_API_BASE_URL in .env
- Check API Gateway authentication (IAM vs. public)

**OpenAI rate limits:**
- Implement exponential backoff in Lambda functions
- Consider prompt caching (if using Claude)
- Monitor usage in OpenAI dashboard

## Contributing

When making changes:
1. Test locally with `npm run dev` (frontend) and `sam local start-api` (backend)
2. Update this CLAUDE.md if architecture changes
3. Deploy to dev environment first for testing
4. Tag releases when deploying to production
