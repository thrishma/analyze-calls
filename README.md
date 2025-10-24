# Customer Discovery Call Analysis Platform

> **Self-hosted AI-powered platform** for analyzing customer discovery calls to extract pain points, feature requests, and objections. Built with React, AWS Lambda, and OpenAI GPT-4.

[![CI](https://github.com/thrishma/analyze-calls/actions/workflows/ci.yml/badge.svg)](https://github.com/thrishma/analyze-calls/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/thrishma/analyze-calls)](https://github.com/thrishma/analyze-calls/issues)
[![GitHub stars](https://img.shields.io/github/stars/thrishma/analyze-calls)](https://github.com/thrishma/analyze-calls/stargazers)

**🚀 Quick Start:** [Installation Guide](#installation--setup) • **🤝 Contributing:** [Guidelines](./CONTRIBUTING.md) • **📖 Docs:** [Technical Details](./CLAUDE.md)

## Demo

### Video Walkthroughs

**Full Platform Demo** - See the entire workflow from upload to insights:

https://github.com/thrishma/analyze-calls/raw/main/docs/images/Call%20Analyzer%20demo.mov

**Chatbot Query Demo** - Watch how the AI chatbot answers questions across all calls:

https://github.com/user-attachments/assets/b60471c4-2b80-4f9c-8188-e08661cffb2f

### Screenshots

**Dashboard** - View call stats and recent analysis at a glance:

![Dashboard](docs/images/Dashboard%20-%20Call%20analyzer.png)

![Dashboard with multiple calls](docs/images/Dashboard%202%20-%20call%20analyzer.png)

**Upload & Analyze Calls** - Simple interface for uploading transcripts and LinkedIn screenshots:

![Start of analyze new call](docs/images/Start%20of%20analyze%20new%20call%20-%20call%20analyzer.png)

![End of analyze new call](docs/images/End%20of%20analyze%20new%20call%20-%20call%20analyzer.png)

**AI-Extracted Insights** - Comprehensive analysis with supporting quotes and confidence scores:

![Pain point analysis](docs/images/Pain%20point%20analysis%20-%20call%20analyzer.png)

![Feature requests](docs/images/Feature%20requests%20-%20call%20analyzer.png)

![Objections and concerns](docs/images/Objections%20and%20concerns%20-%20call%20analyzer.png)

**Detailed Call Analysis** - Deep dive into individual calls:

![Call analysis 1](docs/images/Call%20analysis%201-%20call%20analyzer.png)

![Call analysis 2](docs/images/Call%20analysis%202%20-%20call%20analyzer.png)

![Call analysis 3](docs/images/Call%20analysis%203-%20call%20analyzer.png)

## Why This Exists

I got tired of manually analyzing customer discovery calls. Every time I needed to find a pattern or recall "that thing someone said about feature X," I'd waste hours digging through transcripts.

There are plenty of tools that solve this—Gong, Chorus, etc.—but they're expensive. As a developer, I realized: **why pay for something I can build myself?**

If you're tired of:
- 📝 Manually combing through call transcripts
- 🔍 Searching for "that one thing someone said about X"
- 💸 Paying $100+/month for enterprise tools you barely use
- ⏰ Wasting hours when you could be shipping

...then this is for you. **Clone it. Deploy it. Own your data.** 🚀

---

## What Does This Do?

This platform helps product teams and founders analyze customer discovery calls at scale:

1. **Upload call transcripts** (text files) along with optional LinkedIn profile screenshots
2. **AI automatically extracts**:
   - Pain points with severity ratings and supporting quotes
   - Feature requests with priority levels
   - Objections and concerns with context
   - Participant information from LinkedIn (role, company, experience)
3. **Query across all calls** using a natural language chatbot interface
4. **View insights** on a dashboard with filtering and search capabilities

**Use Cases:**
- Validate product-market fit by identifying recurring pain points
- Prioritize feature development based on customer requests
- Track objections and competitive insights
- Build a searchable knowledge base of customer conversations

## Features

- **Automated Analysis**: Upload call transcripts and get AI-extracted insights using GPT-4
- **LinkedIn Enrichment**: Extract profile data from screenshots using GPT-4 Vision
- **Intelligent Chatbot**: Query insights across all calls with natural language (powered by embeddings)
- **Dashboard**: View stats and recent calls at a glance
- **Detailed Insights**: See pain points, feature requests, and objections with supporting quotes and confidence scores
- **Serverless Architecture**: Cost-effective AWS Lambda backend that scales automatically
- **Fully Self-Hosted**: Your data stays in your AWS account

## Prerequisites

Before you begin, ensure you have:

### Required
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **AWS Account** with appropriate permissions (Lambda, S3, API Gateway, Systems Manager)
- **AWS CLI** configured with credentials ([Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))
- **AWS SAM CLI** installed ([Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Recommended
- Git for version control
- Basic familiarity with AWS services
- Understanding of serverless architecture

## Installation & Setup

### Step 1: Get the Code

**For Users** (deploying to your own AWS account):
```bash
git clone https://github.com/thrishma/analyze-calls.git
cd analyze-calls
```

**For Contributors** (making code changes):
1. Fork this repository on GitHub (click "Fork" button)
2. Clone your fork:
```bash
git clone https://github.com/YOUR-USERNAME/analyze-calls.git
cd analyze-calls
```
3. See [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow

### Step 2: Backend Setup (AWS)

#### 2a. Store OpenAI API Key in AWS Parameter Store

```bash
# Replace with your actual OpenAI API key
aws ssm put-parameter \
  --name /call-analysis/dev/openai-api-key \
  --value "sk-your-openai-api-key-here" \
  --type SecureString \
  --region us-east-2
```

#### 2b. Configure SAM Deployment

```bash
cd backend

# Copy the example configuration
cp samconfig.toml.example samconfig.toml

# Edit samconfig.toml to set your preferred:
# - stack_name (e.g., "my-call-analysis")
# - region (e.g., "us-west-2")
# - AWS profile (if not using default)
```

#### 2c. Install Lambda Dependencies

```bash
# Install dependencies for each Lambda function
cd lambda/processCall && npm install && cd ../..
cd lambda/chatbotQuery && npm install && cd ../..
cd lambda/getCalls && npm install && cd ../..
```

#### 2d. Build and Deploy to AWS

```bash
# Build the SAM application
sam build

# Deploy (first time - will prompt for configuration)
sam deploy --guided

# Follow the prompts:
# - Stack Name: call-analysis-dev (or your choice)
# - AWS Region: us-east-2 (or your choice)
# - Parameter Stage: dev
# - Confirm changes before deploy: Y
# - Allow SAM CLI IAM role creation: Y
# - Save arguments to configuration file: Y
```

**After deployment completes, you'll see the API Gateway URL:**

```
CloudFormation outputs from deployed stack
--------------------------------------------------------------------------
Outputs
--------------------------------------------------------------------------
Key                 ApiUrl
Description         API Gateway endpoint URL
Value               https://abc123xyz.execute-api.us-east-2.amazonaws.com/dev
--------------------------------------------------------------------------
```

**📋 Copy this URL** - you'll need it in Step 3a below.

**To retrieve it later:**
```bash
aws cloudformation describe-stacks \
  --stack-name call-analysis-dev \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text
```

### Step 3: Frontend Setup

#### 3a. Configure API URL

```bash
cd ../frontend

# Copy the example environment file
cp .env.example .env

# Edit .env and replace with your API Gateway URL from Step 2d
# VITE_API_BASE_URL=https://your-api-id.execute-api.us-east-2.amazonaws.com/dev
```

#### 3b. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit **http://localhost:5173** in your browser. You should see the dashboard!

### Step 4: Test the Application

1. Click "Upload Call" in the navigation
2. Upload a sample transcript file (plain text format)
3. Optionally upload a LinkedIn profile screenshot
4. Click "Analyze Call"
5. View the extracted insights on the Call Detail page
6. Try querying across calls using the Chatbot page

## Architecture

```
┌─────────────┐                                    ┌──────────────┐
│   React     │───── HTTPS ─────▶┌──────────────┐  │   OpenAI     │
│  Frontend   │                  │ API Gateway  │  │   GPT-4 API  │
│  (Vite)     │◀──── JSON ───────│   (REST)     │  │              │
└─────────────┘                  └──────────────┘  └──────────────┘
                                         │                 ▲
                                         ▼                 │
                                  ┌─────────────┐          │
                                  │   Lambda    │──────────┘
                                  │  Functions  │   API Calls
                                  │             │
                                  │ • Process   │
                                  │ • GetCalls  │
                                  │ • Chatbot   │
                                  │ • Delete    │
                                  └─────────────┘
                                    │         │
                        ┌───────────┘         └──────────┐
                        ▼                                 ▼
                 ┌─────────────┐                   ┌─────────────┐
                 │     S3      │                   │  Parameter  │
                 │   Bucket    │                   │    Store    │
                 │ (Call Data) │                   │ (API Keys)  │
                 └─────────────┘                   └─────────────┘
```

**Tech Stack:**
- **Frontend**: React 18 + Vite + Chakra UI + React Router
- **Backend**: AWS Lambda (Node.js 20.x) + API Gateway
- **Storage**: AWS S3
- **AI**: OpenAI GPT-4 Turbo + GPT-4 Vision + text-embedding-3-large
- **Infrastructure**: AWS SAM (Serverless Application Model)

### How It Works

1. **Upload & Analysis**:
   - User uploads transcript + LinkedIn info → API Gateway → ProcessCall Lambda
   - Lambda retrieves OpenAI API key from Parameter Store
   - Sends transcript to GPT-4 for analysis (pain points, features, objections)
   - Stores results and chunks in S3 bucket

2. **Call Retrieval**:
   - GetCalls Lambda fetches metadata from S3
   - Returns call list or detailed insights to frontend

3. **Chatbot Queries**:
   - User query → ChatbotQuery Lambda
   - Generates embedding with OpenAI text-embedding-3-large
   - Searches call chunks for semantic matches
   - GPT-4 synthesizes answer with source citations

4. **Data Flow**:
   - All API calls go through API Gateway (CORS enabled)
   - Lambda functions auto-scale based on demand
   - S3 stores all call data (transcripts, metadata, chunks)

## Production Deployment

### Option 1: AWS Amplify (Recommended for Frontend)

This project is structured as a **monorepo** (contains both `backend/` and `frontend/` folders). AWS Amplify requires special configuration to deploy frontend-only from a monorepo.

#### Step-by-Step Amplify Deployment

**1. Deploy Backend First & Get API Gateway URL**

Before deploying the frontend, deploy your backend to get the API Gateway URL:

```bash
cd backend
sam build
sam deploy --guided
```

After deployment completes, SAM will display outputs including your API Gateway URL:

```
CloudFormation outputs from deployed stack
--------------------------------------------------------------------------
Outputs
--------------------------------------------------------------------------
Key                 ApiUrl
Description         API Gateway endpoint URL
Value               https://abc123xyz.execute-api.us-east-2.amazonaws.com/dev
--------------------------------------------------------------------------
```

**📋 Copy this URL** - you'll need it in step 5 below.

**To retrieve it later:**
```bash
# If you need to find your API URL again:
aws cloudformation describe-stacks \
  --stack-name call-analysis-dev \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text
```

**2. Push Code to Git Repository**

```bash
git add .
git commit -m "Prepare for Amplify deployment"
git push origin main
```

**3. Create Amplify App**

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Choose your Git provider (GitHub, GitLab, Bitbucket, etc.)
4. Authorize AWS Amplify to access your repository
5. Select the repository: `analyze-calls`
6. Select the branch: `main` (or your default branch)

**4. Configure Monorepo Build Settings**

⚠️ **IMPORTANT**: The repository contains an `amplify.yml` file at the root that configures the monorepo setup. Amplify will automatically detect this file.

The `amplify.yml` file specifies:
- **appRoot**: `frontend` - Points to the frontend directory
- **Build commands**: Uses `npm install --legacy-peer-deps` (required for React 19 compatibility)
- **Artifacts**: Outputs from `dist` folder
- **Cache**: Caches `node_modules` for faster builds

**5. Add Environment Variables**

⚠️ **You need your API Gateway URL from Step 1** - if you didn't save it, scroll back to Step 1 to see how to retrieve it.

In the Amplify Console, add the following environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | Your API Gateway URL from Step 1 (e.g., `https://abc123xyz.execute-api.us-east-2.amazonaws.com/dev`) |

**How to add environment variables in Amplify:**
1. In Amplify Console → Select your app
2. Go to **"App settings"** → **"Environment variables"**
3. Click **"Manage variables"**
4. Click **"Add variable"**
5. Enter key: `VITE_API_BASE_URL`
6. Enter value: Paste your API Gateway URL from Step 1
7. Click **"Save"**

**Example:**
```
Key: VITE_API_BASE_URL
Value: https://abc123xyz.execute-api.us-east-2.amazonaws.com/dev
```

**6. Review and Deploy**

1. Review the build settings (should use `amplify.yml`)
2. Click **"Save and deploy"**
3. Wait for the build to complete (usually 2-5 minutes)
4. Your app will be available at: `https://[app-id].amplifyapp.com`

**7. (Optional) Set Up Password Protection**

To protect your app with basic authentication (username/password):

1. In Amplify Console → Select your app
2. Go to **"App settings"** → **"Access control"**
3. Click **"Manage access"**
4. Select the branch you want to protect (e.g., `main`)
5. Toggle **"Enable access control"** to ON
6. Choose **"Restrict access with username and password"**
7. Enter a username (e.g., `admin`)
8. Enter a strong password
9. Click **"Save"**

Now when anyone visits your app, they'll need to enter the username and password. This is useful for:
- Protecting internal tools from public access
- Sharing with a small team without building full authentication
- Testing in production before going public

**Note:** This is basic HTTP authentication. For production apps with multiple users, consider implementing proper authentication with AWS Cognito or a third-party service.

**8. Automatic Deployments**

Amplify will automatically deploy on every git push to your main branch:
- Push changes → Amplify detects changes → Builds → Deploys
- View build logs in the Amplify Console

### Troubleshooting Amplify Deployment

**Build fails with "npm ci" error:**
- Solution: The `amplify.yml` uses `npm install --legacy-peer-deps` to handle React 19 peer dependencies
- If you modified the file, ensure it uses `npm install --legacy-peer-deps` instead of `npm ci`

**Monorepo not detected:**
- Ensure `amplify.yml` is at the repository root
- The file must use the `applications` key with `appRoot: frontend`
- Check the Amplify Console build logs to verify it's using the correct directory

**Environment variables not working:**
- Vite requires variables to be prefixed with `VITE_`
- Ensure you added `VITE_API_BASE_URL` (not just `API_BASE_URL`)
- Rebuild the app after adding environment variables

**CORS errors after deployment:**
- Verify your API Gateway URL is correct in Amplify environment variables
- Ensure your backend Lambda functions return proper CORS headers (already configured in this template)

---

<details>
<summary><h3 style="display: inline;">Option 2: Self-Hosted (VPS/Docker/Other Platforms)</h3></summary>

If you prefer to host the frontend yourself instead of using AWS Amplify:

#### Build the Frontend

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized static files (HTML, CSS, JS).

#### Deployment Options

**Option A: nginx (Ubuntu/Debian VPS)**
```bash
# Copy built files to nginx web root
sudo cp -r dist/* /var/www/html/

# Configure nginx to handle React Router (optional but recommended)
sudo nano /etc/nginx/sites-available/default
# Add this inside the server block:
# location / {
#   try_files $uri $uri/ /index.html;
# }

sudo systemctl reload nginx
```

**Option B: Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Option C: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=dist
```

**Option D: Docker**
```dockerfile
# Dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t call-analysis-frontend .
docker run -p 80:80 call-analysis-frontend
```

**Important:** Don't forget to set the `VITE_API_BASE_URL` environment variable before building!

</details>

### Backend Deployment

The backend is already deployed to AWS via SAM. For production:

```bash
# Deploy to production stage
sam deploy --parameter-overrides Stage=prod

# Remember to create production Parameter Store key:
aws ssm put-parameter \
  --name /call-analysis/prod/openai-api-key \
  --value "sk-your-key" \
  --type SecureString
```

## Configuration

### Environment Variables

**Frontend** (`.env`):
```bash
VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/dev
```

**Backend** (AWS Parameter Store):
- `/call-analysis/{stage}/openai-api-key` - Your OpenAI API key

### AWS Resources Created

The SAM template creates:
- **S3 Bucket**: `call-analysis-data-{stage}-{random}` for storing transcripts and metadata
- **Lambda Functions**:
  - `ProcessCallFunction` - Analyzes call transcripts
  - `ChatbotQueryFunction` - Handles chatbot queries
  - `GetCallsFunction` - Retrieves call data
  - `DeleteCallFunction` - Deletes calls
- **API Gateway**: REST API with CORS enabled
- **IAM Roles**: For Lambda execution with S3 and Parameter Store access

## Project Structure

**Monorepo Layout** - This project contains both backend and frontend in a single repository.

```
analyze-calls/
├── backend/                       # AWS Lambda backend
│   ├── template.yaml              # AWS SAM Infrastructure as Code
│   ├── samconfig.toml.example     # SAM deployment config template
│   └── lambda/
│       ├── processCall/           # Analyzes call transcripts with GPT-4
│       ├── chatbotQuery/          # Handles chatbot queries
│       ├── getCalls/              # Retrieves call data from S3
│       └── deleteCall/            # Deletes calls from S3
├── frontend/                      # React frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Dashboard with stats
│   │   │   ├── UploadCall.jsx     # Upload & analyze calls
│   │   │   ├── CallDetail.jsx     # View call insights
│   │   │   └── Chatbot.jsx        # Natural language query interface
│   │   ├── components/
│   │   │   └── Layout.jsx         # Navigation and layout
│   │   └── api/
│   │       └── client.js          # Axios API client
│   ├── .env.example               # Environment variable template
│   └── vite.config.js             # Vite configuration
├── amplify.yml                    # 🔧 AWS Amplify monorepo config (important!)
├── CLAUDE.md                      # Detailed technical documentation
├── CONTRIBUTING.md                # Contribution guidelines
├── LICENSE                        # MIT License
└── README.md                      # This file
```

### Key Configuration Files

- **`amplify.yml`** - Configures AWS Amplify to deploy only the frontend from this monorepo. Sets `appRoot: frontend` to point to the frontend directory.
- **`backend/template.yaml`** - AWS SAM template defining Lambda functions, API Gateway, and S3 bucket
- **`backend/samconfig.toml`** - SAM CLI configuration (not tracked in git)
- **`frontend/.env`** - Frontend environment variables (not tracked in git)
- **`.gitignore`** - Excludes sensitive files like `.env`, `samconfig.toml`, and `node_modules`

## Cost Estimate

**For ~100 calls/month with moderate usage:**

| Service | Estimated Cost |
|---------|---------------|
| AWS Lambda | ~$5/month |
| AWS S3 Storage | ~$1/month |
| AWS API Gateway | ~$3.50/month |
| OpenAI API (GPT-4) | ~$10-20/month |
| **Total** | **~$20-30/month** |

**Notes:**
- Costs scale with usage (more calls = higher OpenAI costs)
- AWS Free Tier can cover Lambda/S3/API Gateway for first 12 months
- OpenAI costs depend on transcript length and query volume
- Consider prompt caching strategies to reduce OpenAI costs

## Troubleshooting

### Backend Issues

**Lambda timeout on large transcripts:**
- Increase timeout in `backend/template.yaml` (default: 120s, max: 900s)
- Check CloudWatch Logs for specific errors

**OpenAI API errors:**
- Verify API key is correct in Parameter Store
- Check OpenAI account has sufficient credits
- Review CloudWatch Logs for detailed error messages

**CORS errors:**
- Ensure CORS is properly configured in `template.yaml`
- Verify Lambda functions return CORS headers

### Frontend Issues

**Can't connect to API:**
- Verify `VITE_API_BASE_URL` in `.env` is correct
- Check browser console for specific errors
- Ensure API Gateway is publicly accessible

**Build errors:**
- Delete `node_modules` and run `npm install` again
- Ensure Node.js version is 18+

### AWS Deployment Issues

**SAM deploy fails:**
- Ensure AWS CLI is configured: `aws configure`
- Check IAM permissions (need Lambda, S3, API Gateway, CloudFormation)
- Verify region in `samconfig.toml` matches Parameter Store region

**S3 bucket creation fails:**
- Bucket names must be globally unique
- SAM adds random suffix to ensure uniqueness

## Development

### Running Locally

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend (Local API):**
```bash
cd backend
sam build
sam local start-api --port 3001
```

Update frontend `.env` to point to `http://localhost:3001`

### Testing

See [CLAUDE.md](./CLAUDE.md) for detailed testing instructions and development workflows.

### Continuous Integration

This project uses GitHub Actions for CI/CD. On every push and pull request to `main`:

✅ **Frontend checks:**
- Linting with ESLint
- Build verification
- Artifact validation

✅ **Backend checks:**
- SAM template validation
- Lambda dependency installation
- SAM build verification

✅ **Documentation checks:**
- Markdown linting (warnings only)

✅ **Security checks:**
- Secret scanning with TruffleHog

**Status:** Check the badge at the top of this README for current build status.

## Roadmap

Potential future enhancements:
- [ ] Vector database integration for better semantic search
- [ ] Batch processing for multiple transcripts
- [ ] PDF/CSV export of insights
- [ ] Integration with Gong/Chorus/Fireflies APIs
- [ ] Multi-user authentication with AWS Cognito
- [ ] Advanced analytics and pattern detection
- [ ] Real-time collaboration features

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [OpenAI GPT-4](https://openai.com/)
- Powered by [AWS Serverless](https://aws.amazon.com/serverless/)
- UI components from [Chakra UI](https://chakra-ui.com/)

## Support

- **Issues**: [GitHub Issues](https://github.com/thrishma/analyze-calls/issues)
- **Documentation**: See [CLAUDE.md](./CLAUDE.md) for detailed technical docs
- **Questions**: Open a GitHub Discussion or Issue

---

**Made with ❤️ (and a bit of frustration) for product teams who want to own their data.**
