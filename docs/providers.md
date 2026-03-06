# Providers & Models

CCG MCP Tool delegates to locally installed AI CLIs. Each provider has strengths suited to different tasks.

## Provider overview

| Provider | CLI | Default model | Context window | Best for |
|----------|-----|---------------|----------------|----------|
| Gemini | `gemini` | `gemini-2.5-pro` | Up to 2M tokens | Codebase-wide analysis, sandbox execution |
| Codex | `codex` | `gpt-5.3-codex` | 128k tokens | Precise edits, targeted refactoring |
| Claude | `claude` | `sonnet` | 200k tokens | Complex reasoning, nuanced code review |

## Gemini models

| Model | Context | Output limit | Notes |
|-------|---------|-------------|-------|
| `gemini-2.5-pro` | 1M–2M tokens | 65,536 tokens | Best reasoning; daily quota may fall back to Flash |
| `gemini-2.5-flash` | 1M tokens | 65,536 tokens | 3–5× faster, near-equal quality, higher quota |
| `gemini-2.0-flash` | 1M tokens | 8,192 tokens | Previous-gen stable fallback |
| `gemini-1.5-pro` | 2M tokens | 8,192 tokens | Largest context window |
| `gemini-1.5-flash` | 1M tokens | 8,192 tokens | Fast, low-cost |

All Gemini models support sandbox mode (`sandbox:true`).

## Claude models

The Claude CLI accepts short aliases (`sonnet`, `opus`, `haiku`) or full model names.

| Model | Context | Output limit | Notes |
|-------|---------|-------------|-------|
| `claude-opus-4-5` | 200k tokens | 32,000 tokens | Highest reasoning quality |
| `claude-sonnet-4-5` | 200k tokens | 16,000 tokens | Balanced speed and quality — the workhorse |
| `claude-3-7-sonnet` | 200k tokens | 64,000 tokens | Extended thinking mode available |
| `claude-3-5-sonnet` | 200k tokens | 8,192 tokens | Legacy stable baseline |
| `claude-3-5-haiku` | 200k tokens | 8,192 tokens | Fastest, lowest cost |

## Codex models

| Model | Context | Output limit | Notes |
|-------|---------|-------------|-------|
| `gpt-5.3-codex` | 128k tokens | 16,384 tokens | Code-specialized, highest edit precision |
| `gpt-5.3-codex-spark` | 64k tokens | 8,192 tokens | Lighter, faster variant |
| `o3` | 200k tokens | 100k tokens | Strongest reasoning model |
| `o3-mini` | 128k tokens | 65,536 tokens | Cost-efficient reasoning |
| `gpt-4.1` | 1M tokens | 32,768 tokens | Large context, general purpose |
| `gpt-4o` | 128k tokens | 16,384 tokens | Multimodal, fast baseline |

## Setting provider and model

### At startup (recommended)

```json
{
  "mcpServers": {
    "ccg-tool": {
      "command": "npx",
      "args": ["-y", "@diazstg/ccg-mcp-tool", "--provider", "gemini", "--model", "gemini-2.5-pro"]
    }
  }
}
```

### Per tool call

Override on any request:

```
/ccg-tool:ask-ai prompt:"@src/auth.ts refactor" provider:claude model:sonnet
/ccg-tool:ask-ai prompt:"@. architecture review" provider:gemini
```

## Recommendations by task

| Task | Recommended model | Reason |
|------|-------------------|--------|
| Full codebase review | `gemini-2.5-pro` | 2M token window ingests the entire repo |
| Quick file explanation | `gemini-2.5-flash` | Fast, lower quota cost |
| Complex bug RCA | `claude-opus-4-5` or `o3` | Deep multi-step reasoning |
| Targeted refactoring | `gpt-5.3-codex` | Highest code edit precision |
| Security review | `o3` or `claude-opus-4-5` | Strong adversarial reasoning |
| Test generation | `gpt-5.3-codex` or `claude-sonnet-4-5` | Structured output, low hallucination |
| Sandbox execution | `gemini-2.5-pro` or `gemini-2.5-flash` | Gemini-only feature |
| Mitigation gates | `claude-opus-4-5` | Best reasoning for high-integrity checks |
