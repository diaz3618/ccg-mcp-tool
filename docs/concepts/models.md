# Model & Provider Selection

Choose the right AI model and provider for your task.

## Available Providers

### Anthropic Claude Code
- **Best for**: Advanced reasoning, complex logic explanation, and agentic workflows.
- **Context**: State-of-the-art reasoning.
- **Models**: `claude-3-5-sonnet`.

### OpenAI Codex
- **Best for**: High-precision code generation, refactoring, and concise edits.
- **Context**: Specialized for code.
- **Models**: `gpt-5.3-codex` (default), `gpt-5.3-codex-spark`.

### Google Gemini
- **Best for**: Massive codebases, large-scale analysis, sandbox execution.
- **Context**: Up to 2M tokens.
- **Models**: `gemini-2.5-pro`, `gemini-2.5-flash`.

## Setting Providers and Models

You can specify the provider and model directly in your tool calls, or set global defaults at startup.

### At Startup (Recommended)
Set your preferred giants in your MCP configuration file:

```json
{
  "mcpServers": {
    "ccg-tool": {
      "command": "npx",
      "args": ["-y", "ccg-mcp-tool", "--provider", "codex", "--model", "gpt-5.3-codex"]
    }
  }
}
```

### Per Tool Call
You can override the defaults anytime:

```bash
# Using ask-ai tool
/ccg-tool:ask-ai prompt:@src/auth.ts refactor this provider:claude

# Using natural language
"Ask gemini to analyze the architecture of @src/"
```

## Provider Comparison

| Provider | Key Strength | Best Use Case |
|----------|--------------|---------------|
| **Claude** | Advanced Reasoning | Complex logic, bug RCA |
| **Codex** | Code Precision | Refactoring, small edits |
| **Gemini** | Massive Context | Large codebase analysis |

## Recommendations

- **Architecture Review**: Gemini (Pro)
- **Bug Root Cause Analysis**: Claude
- **Code Refactoring**: Codex
- **Quick Code Explanation**: Gemini (Flash)
- **Mistake Mitigation**: Any (Claude recommended for high-integrity gates)

## Cost & Token Optimization

1. **Use Gemini Flash** for routine analysis to save quota.
2. **Use Gemini Pro** for project-wide architecture reviews.
3. **Use Codex** when you need high-fidelity code generation without context bloat.
4. **Use Claude** when the logic is exceptionally complex.

## Context Limits

| Provider | Model | Limit |
|----------|-------|-------|
| **Gemini** | `gemini-2.5-pro` | 2 Million Tokens |
| **Gemini** | `gemini-2.5-flash` | 1 Million Tokens |
| **Claude** | `claude-3-5-sonnet` | 200k Tokens |
| **Codex** | `gpt-5.3-codex` | 128k Tokens (Optimized) |
