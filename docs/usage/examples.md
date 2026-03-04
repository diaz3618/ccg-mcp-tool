# Real-World Examples

Practical examples of using **CCG MCP Tool** in development workflows.

## Multi-Provider Analysis

### Comparative Review
```
# Get Gemini's perspective on a large file
/ccg-tool:ask-ai prompt:@src/auth.ts review this security implementation provider:gemini

# Get Codex's precision refactoring
/ccg-tool:ask-ai prompt:@src/auth.ts refactor this for performance provider:codex model:gpt-5.3-codex

# Get Claude's reasoning for complex logic
/ccg-tool:ask-ai prompt:@src/auth.ts explain the complex logic here provider:claude
```

## Mistake Mitigation (Research-Grounded)

### Requirements Grounding
```
# Prevent hallucinations and misalignment before starting a task
/ccg-tool:mitigate-mistakes skill:requirements-grounding prompt:@new-feature-req.md
```

### Secure Coding Gate
```
# Unbiased security audit based on professional journals
/ccg-tool:mitigate-mistakes skill:secure-coding-and-validation-gate prompt:@src/api/handler.js provider:codex
```

### Context & Scope Discipline
```
# Ensure changes stay within requested boundaries
/ccg-tool:mitigate-mistakes skill:context-scope-discipline prompt:"Refactor the auth module but don't touch the database"
```

## Architecture Analysis

### Understanding a New Codebase
```
/ccg-tool:ask-ai prompt:"@package.json @src/**/*.js @README.md give me an overview of this project's architecture" provider:gemini
```

### Dependency Analysis
```
/ccg-tool:ask-ai prompt:"@package.json @package-lock.json are there any security vulnerabilities or outdated packages?"
```

## Documentation

### Generating API Docs
```
/ccg-tool:ask-ai prompt:"@routes/api/*.js generate OpenAPI documentation for these endpoints"
```

## Testing

### Writing Tests
```
/ccg-tool:ask-ai prompt:"@src/utils/validator.js write comprehensive Jest tests for this module" provider:codex
```

## Security Audit

### OWASP Check
```
/ccg-tool:mitigate-mistakes skill:secure-coding-and-validation-gate prompt:"@src/api/**/*.js check for OWASP Top 10 vulnerabilities"
```

## Real Project Workflow

### Step-by-Step Feature Implementation
```bash
# 1. Ground requirements first
/ccg-tool:mitigate-mistakes skill:requirements-grounding prompt:"Add SSO support using SAML"

# 2. Design the architecture
/ccg-tool:ask-ai prompt:"@src/auth/ Proposed architecture for SAML integration" provider:claude

# 3. Generate high-precision code
/ccg-tool:ask-ai prompt:"@src/auth/ Implement SAML strategy" provider:codex

# 4. Final Review
/ccg-tool:mitigate-mistakes skill:code-review-and-change-gate prompt:"@src/auth/saml.strategy.ts review for edge cases"
```

## Tips for Effective Usage

1. **Start Broad, Then Narrow**: Use Gemini Pro for the big picture, then switch to Codex or Claude for implementation.
2. **Combine Related Files**: Include configs with source code for context.
3. **Use Mitigation Gates**: Always run a gate before and after a major change.
4. **Compare Providers**: If one provider gets stuck, try another!
