# File Analysis with @ Syntax

One of the most powerful features of **CCG MCP Tool** is the ability to analyze files using the `@` syntax across all supported providers (Claude, Codex, and Gemini).

## Basic Usage

```
/ccg-tool:ask-ai prompt:"@index.js explain this code"
```
```
ask codex to analyze the @src/ directory and suggest optimizations
```
```
Ask gemini to explain @index.js by reading the entire codebase first
```
```
Have claude analyze @main and determine the top 3 architectural improvements
```

## Multiple Files

Analyze multiple files in one request:
```
/ccg-tool:ask-ai prompt:"@src/server.js @src/client.js how do these interact?"
```

## Entire Directories

Analyze whole directories using glob patterns:
```
/ccg-tool:ask-ai prompt:"@src/**/*.ts summarize the TypeScript architecture"
```

## Why @ Syntax?

- **Familiar**: Native support in modern AI coding agents.
- **Explicit**: Clearly defines the context boundary for the AI.
- **Cross-Provider**: Works identically whether you are using Gemini's 2M context or Codex's precision.

## Best Practices

### 1. Be Specific
```
# Good
@src/auth/login.js explain the authentication flow

# Too vague
@src explain everything
```

### 2. Use Patterns Wisely
```
# Analyze all test files
@**/*.test.js are all tests passing?

# Analyze specific module
@modules/payment/*.js review payment logic
```

### 3. Combine with Questions
```
@package.json @src/index.js is this properly configured?
```

## Token Optimization

By using Gemini's massive context window via `ccg-tool`, you can analyze entire codebases while keeping your primary agent's (e.g. Claude) token usage minimal. Use `@` to point the way.
