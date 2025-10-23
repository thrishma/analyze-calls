# Security Policy

## Supported Versions

This project is currently in active development. Security updates will be applied to the latest version on the `main` branch.

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

### How to Report

**Please DO NOT open a public GitHub issue for security vulnerabilities.**

Instead, please:

1. **Email**: Create a private security advisory on GitHub
   - Go to the [Security tab](https://github.com/thrishma/analyze-calls/security)
   - Click "Report a vulnerability"
   - Provide detailed information about the vulnerability

2. **What to include**:
   - Type of vulnerability (e.g., SQL injection, XSS, insecure storage)
   - Location of the vulnerable code (file path and line number)
   - Step-by-step instructions to reproduce
   - Potential impact of the vulnerability
   - Suggested fix (if you have one)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity (critical issues within 7 days)

## Security Best Practices for Users

### API Keys and Secrets

**Never commit sensitive data to git:**

- ✅ Store OpenAI API key in AWS Parameter Store (encrypted)
- ✅ Use `.env` files for local development (ignored by git)
- ✅ Use AWS IAM roles for Lambda function permissions
- ❌ Never hardcode API keys in source code
- ❌ Never commit `.env` or `samconfig.toml` to git

**Verify your configuration:**

```bash
# Check that sensitive files are ignored
git status --ignored

# These should appear in ignored files:
# - .env
# - samconfig.toml
# - node_modules/
```

### AWS Security

**IAM Permissions:**
- Use least-privilege IAM policies
- Lambda functions only have access to required services (S3, Parameter Store)
- API Gateway endpoints are public by default (consider adding authentication)

**S3 Bucket Security:**
- Buckets are private by default
- Enable versioning for data recovery
- Consider enabling server-side encryption
- Review bucket policies regularly

**API Gateway:**
- CORS is enabled for frontend access
- Consider adding API keys or AWS WAF for production
- Monitor API usage with CloudWatch

### Data Privacy

**Transcript Data:**
- All transcripts are stored in your AWS S3 bucket
- Data is not shared with third parties (except OpenAI for analysis)
- You own all data and can delete it at any time

**OpenAI API:**
- Transcripts are sent to OpenAI API for analysis
- Review [OpenAI's data usage policy](https://openai.com/policies/privacy-policy)
- Consider using [zero data retention](https://openai.com/blog/api-data-privacy) for API calls
- For sensitive data, consider self-hosted AI models

### Production Deployment

**Checklist for secure production deployment:**

- [ ] Enable AWS CloudTrail for audit logging
- [ ] Set up AWS Config for compliance monitoring
- [ ] Enable S3 bucket versioning and lifecycle policies
- [ ] Configure CloudWatch Alarms for suspicious activity
- [ ] Use AWS Secrets Manager or Parameter Store for all secrets
- [ ] Implement API authentication (AWS Cognito, API keys, or custom auth)
- [ ] Enable AWS WAF to protect against common web exploits
- [ ] Review and minimize IAM permissions
- [ ] Enable MFA on AWS root account
- [ ] Use separate AWS accounts for dev/staging/production
- [ ] Implement rate limiting on API Gateway
- [ ] Regular security audits and dependency updates

## Known Security Considerations

### Current Architecture

1. **API Gateway is Public**: The API endpoints are publicly accessible. For production:
   - Add authentication (AWS Cognito, API keys, or custom)
   - Implement rate limiting
   - Use AWS WAF

2. **OpenAI API Calls**: Transcripts are sent to OpenAI:
   - Data is processed by OpenAI's models
   - Review OpenAI's privacy policy
   - Consider API zero data retention settings
   - For highly sensitive data, use self-hosted models

3. **No User Authentication**: Current version has no auth:
   - Anyone with the frontend URL can upload/view calls
   - Recommended: Add AWS Cognito or similar for multi-user deployments

4. **CORS Configuration**: Frontend domain is allowed via CORS:
   - Update CORS settings in `backend/template.yaml` for production
   - Restrict to specific domains, not `*`

## Dependency Security

### Automated Scanning

This project uses GitHub Dependabot to:
- Monitor dependencies for known vulnerabilities
- Automatically create PRs for security updates

### Manual Audits

Run regular security audits:

```bash
# Frontend dependencies
cd frontend
npm audit
npm audit fix

# Backend Lambda dependencies
cd backend/lambda/processCall
npm audit
npm audit fix
```

## Secure Development Practices

### For Contributors

1. **Never commit secrets**: Always use environment variables or AWS Parameter Store
2. **Keep dependencies updated**: Regularly run `npm audit` and update packages
3. **Review third-party code**: Understand what dependencies do before adding them
4. **Use parameterized queries**: Prevent injection attacks (if adding database)
5. **Validate input**: Always validate and sanitize user input
6. **Handle errors safely**: Don't expose sensitive information in error messages

### Code Review Checklist

Before merging PRs, verify:

- [ ] No hardcoded credentials or API keys
- [ ] Environment variables used for configuration
- [ ] Input validation on all user-provided data
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies are up-to-date and audited
- [ ] CORS policies are restrictive
- [ ] Logging doesn't include sensitive data

## Incident Response

In the event of a security incident:

1. **Immediately rotate compromised credentials**:
   ```bash
   aws ssm put-parameter \
     --name /call-analysis/prod/openai-api-key \
     --value "new-key-here" \
     --type SecureString \
     --overwrite
   ```

2. **Review CloudWatch Logs** for suspicious activity

3. **Check S3 bucket access logs** for unauthorized access

4. **Notify affected users** if data was compromised

5. **Document the incident** and implement preventive measures

## Additional Resources

- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [AWS Well-Architected Framework - Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html)
- [OpenAI API Data Privacy](https://openai.com/policies/api-data-usage-policies)

## Questions?

For security-related questions (not vulnerabilities), open a GitHub issue with the `security` label.

---

**Thank you for helping keep this project secure!**
