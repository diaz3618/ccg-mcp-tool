# Best Practices

Get the most out of **CCG MCP Tool** with these proven practices.

## Mistake Mitigation (Critical)

### Apply Mitigation Gates Early
Before starting any significant development task, run the `requirements-grounding` skill to ensure alignment.
```bash
/ccg-tool:mitigate-mistakes skill:requirements-grounding prompt:@new-feature-req.md
```

### Unbiased Security Reviews
Use the `secure-coding-and-validation-gate` skill periodically during development. This skill is grounded in academic research and provides an unbiased perspective on security risks.
```bash
/ccg-tool:mitigate-mistakes skill:secure-coding-and-validation-gate prompt:@src/api/handler.js
```

### Deterministic Validation
When a task is complete, use the `deterministic-validation-gate` to verify that all requirements have been met and no new issues have been introduced.

## Multi-Provider Strategy

### Leverage Provider Strengths
- **Claude**: Use for complex reasoning and root-cause analysis (RCA) of difficult bugs.
- **Codex**: Use for precise refactoring and small-to-medium code generation tasks.
- **Gemini**: Use for project-wide architecture analysis and large-scale code reviews (2M token window).

### Comparative Analysis
When dealing with a particularly tricky problem, ask multiple providers for their perspective and compare the results:
```bash
# Compare Gemini and Codex
/ccg-tool:ask-ai prompt:@src/complex-logic.js refactor this provider:gemini
/ccg-tool:ask-ai prompt:@src/complex-logic.js refactor this provider:codex
```

## File Selection

### Start Specific
Begin with individual files before expanding scope:
```bash
# Good progression
@auth.js                    # Start here
@auth.js @user.model.js     # Add related files
@src/auth/*.js              # Expand to module
@src/**/*.js                # Full codebase analysis
```

### Group Related Files
Include configuration with implementation:
```bash
# Good
@webpack.config.js @src/index.js  # Config + entry point
@.env @config/*.js                # Environment + config
@schema.sql @models/*.js          # Database + models

# Less effective
@**/*.js                         # Too broad without context
```

## Query Optimization

### Be Specific About Intent
```bash
# Vague
"analyze this code"

# Specific
"identify performance bottlenecks and suggest optimizations"
"check for SQL injection vulnerabilities"
"explain the authentication flow step by step"
```

### Provide Success Criteria
```bash
# Good
"refactor this to be more testable, following SOLID principles"
"optimize for readability, targeting junior developers"
"make this TypeScript-strict compliant"
```

## Token Management

### Provider Selection
- **Large Context**: Use Gemini Pro (2M tokens)
- **Fast Tasks**: Use Gemini Flash or Codex
- **Complex Reasoning**: Use Claude 3.5 Sonnet

### Efficient File Inclusion
```bash
# Inefficient
@node_modules/**/*.js  # Don't include dependencies

# Efficient
@src/**/*.js @package.json  # Source + manifest
```

## Iterative Development

### Build on Previous Responses
```bash
1. "analyze the architecture"
2. "focus on the authentication module you mentioned"
3. "show me how to implement the improvements"
4. "write tests for the new implementation"
```

### Save Context Between Sessions
```bash
# Create a context file
/ccg-tool:ask-ai prompt:"@previous-analysis.md @src/new-feature.js continue from our last discussion"
```

## Error Handling

### Include Error Context
```bash
# Good
@error.log @src/api.js "getting 500 errors when calling /user endpoint"

# Better
@error.log @src/api.js @models/user.js @.env 
"500 errors on /user endpoint after deployment"
```

### Provide Stack Traces
Always include full error messages and stack traces when debugging.

## Code Generation

### Specify Requirements Clearly
```bash
# Vague
"create a user service"

# Clear
"create a user service with:
- CRUD operations
- input validation
- error handling
- TypeScript types
- Jest tests"
```

### Include Examples
```bash
@existing-service.js "create a similar service for products"
```

## Security Reviews

### Comprehensive Security Checks
```bash
/ccg-tool:ask-ai prompt:"@src/**/*.js @package.json @.env.example check for vulnerabilities"
- Check for hardcoded secrets
- Review authentication logic
- Identify OWASP vulnerabilities
- Check dependency vulnerabilities
- Review input validation
```

## Performance Optimization

### Measure Before Optimizing
```bash
@performance-profile.json @src/slow-endpoint.js 
"optimize based on this profiling data"
```

### Consider Trade-offs
```bash
"optimize for speed, but maintain readability"
"reduce memory usage without sacrificing features"
```

## Documentation

### Context-Aware Documentation
```bash
@src/api/*.js @README.md 
"update README with accurate API documentation"
```

### Maintain Consistency
```bash
@docs/style-guide.md @src/new-feature.js 
"document following our conventions"
```

## Common Pitfalls to Avoid

### 1. Over-broad Queries
Avoid: `@**/* "fix all issues"`
Use: `@src/auth/*.js "fix security issues in authentication"`

### 2. Missing Context
Avoid: `"why doesn't this work?"`
Use: `@error.log @config.js "why doesn't database connection work?"`

### 3. Ignoring Model Limits
Avoid: Trying to analyze 5M tokens with Flash model
Use: Using Pro for large codebases, Flash for single files

### 4. Vague Success Criteria
Avoid: "make it better"
Use: "improve performance to handle 1000 requests/second"

## Workflow Integration

### Pre-commit Reviews
```bash
alias ccg-review='/ccg-tool:ask-ai prompt:"@$(git diff --staged --name-only) review staged changes"'
```

## Advanced Tips

### 1. Chain Operations
```bash
"First analyze the bug" → 
"Now write a fix" → 
"Create tests for the fix" →
"Update documentation"
```

### 2. Learn from Patterns
When a provider suggests improvements, ask:
```bash
"explain why this approach is better"
"show me more examples of this pattern"
```
