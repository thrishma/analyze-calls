# Contributing to Customer Discovery Call Analysis Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, AWS region, etc.)
- **Error messages** from console or CloudWatch Logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description** of the feature
- **Use cases** - why would this be useful?
- **Proposed implementation** (optional)
- **Alternatives considered** (optional)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed (README, CLAUDE.md, code comments)
5. **Commit with clear messages** following the commit guidelines below
6. **Submit a pull request** with a clear description

## Development Setup

1. Clone your fork:
```bash
git clone https://github.com/your-username/analyze-calls.git
cd analyze-calls
```

2. Set up backend:
```bash
cd backend
cp samconfig.toml.example samconfig.toml
# Install dependencies for each Lambda
cd lambda/processCall && npm install && cd ../..
cd lambda/chatbotQuery && npm install && cd ../..
cd lambda/getCalls && npm install && cd ../..
```

3. Set up frontend:
```bash
cd frontend
cp .env.example .env
npm install
```

4. Configure AWS credentials and deploy backend
5. Update `.env` with your API Gateway URL
6. Run frontend: `npm run dev`

## Code Style Guidelines

### JavaScript/React

- Use **ES6+ features** (arrow functions, destructuring, async/await)
- Follow **functional programming** principles where possible
- Use **async/await** instead of promise chains
- Add **JSDoc comments** for complex functions
- Use **descriptive variable names**
- Keep functions **small and focused** (single responsibility)

### React Components

- Use **functional components** with hooks
- Extract **reusable logic** into custom hooks
- Keep components **focused** on a single concern
- Use **prop destructuring** in function parameters
- Add **PropTypes** or TypeScript for type checking (future)

### AWS Lambda

- Keep handlers **small and focused**
- Use **environment variables** for configuration
- Add **comprehensive error handling**
- Log important events for debugging
- Return **proper CORS headers**
- Use **structured logging** with context

### File Organization

```
backend/lambda/functionName/
├── index.js           # Main handler
├── package.json       # Dependencies
└── utils/            # Helper functions (if needed)

frontend/src/
├── pages/            # Page components
├── components/       # Reusable components
├── hooks/            # Custom React hooks (future)
└── api/              # API client
```

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(chatbot): add date range filter for queries

- Add date picker component to chatbot UI
- Filter chunks by call date in Lambda
- Update API to accept date range parameters

Closes #42
```

```
fix(processCall): handle large transcript timeouts

Increase Lambda timeout from 60s to 120s for transcripts
over 10,000 words. Also added better error messages.

Fixes #38
```

## Testing Guidelines

### Before Submitting

- [ ] Frontend runs without errors (`npm run dev`)
- [ ] Backend builds successfully (`sam build`)
- [ ] All new features are tested manually
- [ ] No console errors or warnings
- [ ] Code follows style guidelines
- [ ] Documentation is updated

### Manual Testing Checklist

- [ ] Upload a call transcript
- [ ] Verify analysis completes successfully
- [ ] Check LinkedIn extraction works
- [ ] Test chatbot queries
- [ ] Verify call deletion works
- [ ] Test on multiple browsers (if frontend change)
- [ ] Check CloudWatch Logs for errors

## Pull Request Process

1. **Update the README** if you're changing functionality
2. **Update CLAUDE.md** if you're changing architecture
3. **Add comments** to explain complex logic
4. **Self-review** your code before submitting
5. **Link related issues** in the PR description
6. **Request review** from maintainers
7. **Address feedback** promptly and professionally
8. **Squash commits** if requested before merging

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Related Issues
Fixes #123
Related to #456

## Changes Made
- Added feature X
- Fixed bug Y
- Updated documentation

## Testing Done
- Tested locally with sample transcripts
- Verified chatbot functionality
- Checked CloudWatch Logs

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tested locally
- [ ] No breaking changes
```

## Architecture Decisions

When making significant architectural changes:

1. **Open an issue first** to discuss the approach
2. **Wait for maintainer feedback** before implementing
3. **Document the decision** in CLAUDE.md
4. **Consider backward compatibility**
5. **Update deployment instructions** if needed

## Areas for Contribution

Looking for ways to contribute? Here are some ideas:

### High Priority
- [ ] Add comprehensive error handling and user feedback
- [ ] Implement proper loading states across the app
- [ ] Add unit tests for Lambda functions
- [ ] Add integration tests for API endpoints
- [ ] Improve chatbot semantic search with vector database

### Medium Priority
- [ ] Add export functionality (PDF/CSV)
- [ ] Implement batch upload for multiple transcripts
- [ ] Add analytics dashboard with charts
- [ ] Integrate with Gong/Chorus APIs
- [ ] Add user authentication with AWS Cognito

### Low Priority
- [ ] Add dark mode support
- [ ] Improve mobile responsiveness
- [ ] Add keyboard shortcuts
- [ ] Implement real-time updates (WebSocket)
- [ ] Add multi-language support

## Questions?

- Open an issue with the `question` label
- Check existing issues and discussions
- Review the [CLAUDE.md](./CLAUDE.md) technical documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! Your efforts help make this tool better for everyone.
