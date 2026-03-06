# Model & Provider Selection

Choose the right AI model and provider for your task.

## Available Providers & Models

---

### Google Gemini

Accessed via the [Gemini CLI](https://github.com/google-gemini/gemini-cli). Best for massive context windows, codebase-wide analysis, and sandbox code execution.

#### `gemini-2.5-pro` *(default)*
| Property | Value |
|---|---|
| **Context window** | 1M tokens input / 2M tokens (extended) |
| **Output limit** | 65,536 tokens |
| **Strengths** | Best reasoning quality in the Gemini family, deep multi-file analysis, chain-of-thought |
| **Best for** | Architecture reviews, large codebase exploration, complex debugging |
| **Quota** | Daily limit; auto-falls back to Flash on exhaustion |
| **Sandbox** | ✅ Supported |

#### `gemini-2.5-flash`
| Property | Value |
|---|---|
| **Context window** | 1M tokens |
| **Output limit** | 65,536 tokens |
| **Strengths** | 3–5× faster than Pro, near-identical quality on most coding tasks, generous quota |
| **Best for** | Routine analysis, quick explanations, high-volume use cases |
| **Quota** | Higher daily limit than Pro |
| **Sandbox** | ✅ Supported |

#### `gemini-2.0-flash`
| Property | Value |
|---|---|
| **Context window** | 1M tokens |
| **Output limit** | 8,192 tokens |
| **Strengths** | Previous-generation Flash, stable, widely available |
| **Best for** | Fallback when 2.5 variants are unavailable; legacy compatible tasks |
| **Sandbox** | ✅ Supported |

#### `gemini-1.5-pro`
| Property | Value |
|---|---|
| **Context window** | 2M tokens |
| **Output limit** | 8,192 tokens |
| **Strengths** | Extremely large context window, solid code understanding |
| **Best for** | Legacy use cases; monorepo-wide analysis when 2.5 Pro quota is exhausted |
| **Sandbox** | ✅ Supported |

#### `gemini-1.5-flash`
| Property | Value |
|---|---|
| **Context window** | 1M tokens |
| **Output limit** | 8,192 tokens |
| **Strengths** | Fast, cheap, good for straightforward queries |
| **Best for** | High-frequency, low-complexity tasks |
| **Sandbox** | ✅ Supported |

---

### Anthropic Claude Code

Accessed via the [Claude Code CLI](https://claude.com/product/claude-code). Best for advanced reasoning, nuanced code review, and agentic multi-step workflows. Supports `changeMode` for structured edit output.

::: tip Claude CLI Model Aliases
The Claude CLI accepts short aliases: `sonnet`, `opus`, `haiku` (resolves to the latest model in each family), or full model names like `claude-sonnet-4-5-20250929`. Use aliases for convenience.
:::

#### `claude-opus-4-5` *(most capable)*
| Property | Value |
|---|---|
| **Context window** | 200k tokens |
| **Output limit** | 32,000 tokens |
| **Strengths** | Highest reasoning quality, best for ambiguous problems and extended thinking |
| **Best for** | Complex architectures, root cause analysis, design reviews |
| **Speed** | Slower; higher cost |

#### `claude-sonnet-4-5`
| Property | Value |
|---|---|
| **Context window** | 200k tokens |
| **Output limit** | 16,000 tokens |
| **Strengths** | Balanced quality and speed; the workhorse model |
| **Best for** | General-purpose coding, refactoring, most production use cases |
| **Speed** | Medium |

#### `claude-3-7-sonnet`
| Property | Value |
|---|---|
| **Context window** | 200k tokens |
| **Output limit** | 64,000 tokens |
| **Strengths** | Extended thinking mode available; strong at long-horizon tasks |
| **Best for** | Multi-step agentic coding tasks, planning phases |
| **Speed** | Medium |

#### `claude-3-5-sonnet` *(legacy)*
| Property | Value |
|---|---|
| **Context window** | 200k tokens |
| **Output limit** | 8,192 tokens |
| **Strengths** | Well-tested, widely compatible, stable baseline |
| **Best for** | Stable production use; environments where newer models aren't yet available |
| **Speed** | Fast |

#### `claude-3-5-haiku`
| Property | Value |
|---|---|
| **Context window** | 200k tokens |
| **Output limit** | 8,192 tokens |
| **Strengths** | Fastest Claude model; very low cost |
| **Best for** | Quick explanations, inline completions, high-volume low-cost queries |
| **Speed** | Fastest |

---

### OpenAI Codex

Accessed via the [Codex CLI](https://github.com/openai/codex). Best for precise code generation, targeted refactoring, and structured output.

#### `gpt-5.3-codex` *(default)*
| Property | Value |
|---|---|
| **Context window** | 128k tokens (code-optimized) |
| **Output limit** | 16,384 tokens |
| **Strengths** | Trained specifically on code; highest precision for edit tasks; minimal hallucination on code structure |
| **Best for** | Refactoring, bug fixes, API implementation, concise well-scoped edits |

#### `gpt-5.3-codex-spark`
| Property | Value |
|---|---|
| **Context window** | 64k tokens |
| **Output limit** | 8,192 tokens |
| **Strengths** | Lighter and faster variant of Codex; reduced cost |
| **Best for** | Single-file edits, quick code fixes, inline completions |

#### `o3`
| Property | Value |
|---|---|
| **Context window** | 200k tokens |
| **Output limit** | 100k tokens |
| **Strengths** | OpenAI's strongest reasoning model; exceptional for logic-heavy problems |
| **Best for** | Algorithm analysis, security review, problems requiring multi-step reasoning |
| **Speed** | Slower; premium cost |

#### `o3-mini`
| Property | Value |
|---|---|
| **Context window** | 128k tokens |
| **Output limit** | 65,536 tokens |
| **Strengths** | Cost-efficient reasoning; fast for structured problem solving |
| **Best for** | Math-heavy tasks, structured debugging, test generation |

#### `gpt-4.1`
| Property | Value |
|---|---|
| **Context window** | 1M tokens |
| **Output limit** | 32,768 tokens |
| **Strengths** | Extremely large context; strong general-purpose coding; instruction following |
| **Best for** | Large file analysis, multi-file context, general use |

#### `gpt-4o`
| Property | Value |
|---|---|
| **Context window** | 128k tokens |
| **Output limit** | 16,384 tokens |
| **Strengths** | Multimodal, fast, versatile; strong baseline |
| **Best for** | General coding, when you need a reliable fast model |

---

## Setting Providers and Models

### At Startup (Recommended)
Set your preferred provider and model in your MCP configuration file:

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

### Per Tool Call
Override the defaults at any time:

```
/ccg-tool:ask-ai prompt:@src/auth.ts refactor this provider:claude model:sonnet
/ccg-tool:ask-ai prompt:@. analyze architecture provider:gemini model:gemini-2.5-pro
/ccg-tool:ask-ai prompt:add unit tests to @api.ts provider:codex
```

---

## Provider Comparison

| Provider | Context Window | Code Quality | Speed | Best Use Case |
|---|---|---|---|---|
| **Gemini 2.5 Pro** | 2M tokens | ⭐⭐⭐⭐ | Medium | Entire codebase analysis |
| **Gemini 2.5 Flash** | 1M tokens | ⭐⭐⭐ | Fast | Routine queries, high volume |
| **Claude Opus 4** | 200k tokens | ⭐⭐⭐⭐⭐ | Slow | Complex reasoning, RCA |
| **Claude Sonnet 4** | 200k tokens | ⭐⭐⭐⭐ | Medium | General coding, refactoring |
| **Claude Haiku** | 200k tokens | ⭐⭐⭐ | Fastest | Quick lookups, completions |
| **Codex (gpt-5.3)** | 128k tokens | ⭐⭐⭐⭐⭐ | Medium | Precise edits, targeted fixes |
| **o3** | 200k tokens | ⭐⭐⭐⭐⭐ | Slow | Logic, security, algorithms |
| **gpt-4.1** | 1M tokens | ⭐⭐⭐⭐ | Medium | Large file analysis |

---

## Recommendations by Task

| Task | Recommended Model | Reason |
|---|---|---|
| **Full codebase architecture review** | `gemini-2.5-pro` | 2M token window ingests entire repo |
| **Routine file explanation** | `gemini-2.5-flash` | Fast, lower quota cost |
| **Complex bug root cause analysis** | `claude-opus-4-5` or `o3` | Deep multi-step reasoning |
| **Targeted refactoring / edits** | `gpt-5.3-codex` | Highest code precision |
| **Security review** | `o3` or `claude-opus-4-5` | Strong logic and adversarial reasoning |
| **Test generation** | `gpt-5.3-codex` or `claude-sonnet-4-5` | Structured output, low hallucination |
| **Change mode (structured diffs)** | `gemini-2.5-pro` or `claude-sonnet-4-5` | Structured edit format support |
| **Mistake mitigation gates** | `claude-opus-4-5` | Best reasoning for high-integrity checks |
| **Sandbox code execution** | `gemini-2.5-pro` or `gemini-2.5-flash` | Gemini-only feature |
| **Quick inline help** | `claude-3-5-haiku` or `gemini-2.5-flash` | Speed over depth |

---

## Context Limits Reference

| Provider | Model | Input Context | Output Limit |
|---|---|---|---|
| **Gemini** | `gemini-2.5-pro` | 1M–2M tokens | 65,536 tokens |
| **Gemini** | `gemini-2.5-flash` | 1M tokens | 65,536 tokens |
| **Gemini** | `gemini-2.0-flash` | 1M tokens | 8,192 tokens |
| **Gemini** | `gemini-1.5-pro` | 2M tokens | 8,192 tokens |
| **Gemini** | `gemini-1.5-flash` | 1M tokens | 8,192 tokens |
| **Claude** | `claude-opus-4-5` | 200k tokens | 32,000 tokens |
| **Claude** | `claude-sonnet-4-5` | 200k tokens | 16,000 tokens |
| **Claude** | `claude-3-7-sonnet` | 200k tokens | 64,000 tokens |
| **Claude** | `claude-3-5-sonnet` | 200k tokens | 8,192 tokens |
| **Claude** | `claude-3-5-haiku` | 200k tokens | 8,192 tokens |
| **Codex** | `gpt-5.3-codex` | 128k tokens | 16,384 tokens |
| **Codex** | `gpt-5.3-codex-spark` | 64k tokens | 8,192 tokens |
| **Codex** | `o3` | 200k tokens | 100k tokens |
| **Codex** | `o3-mini` | 128k tokens | 65,536 tokens |
| **Codex** | `gpt-4.1` | 1M tokens | 32,768 tokens |
| **Codex** | `gpt-4o` | 128k tokens | 16,384 tokens |
