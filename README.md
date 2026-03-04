
# CCG MCP Tool (Claude Code/Codex/Gemini)

<div align="center">

[![GitHub Release](https://img.shields.io/github/v/release/diaz3618/ccg-mcp-tool?logo=github&label=GitHub)](https://github.com/diaz3618/ccg-mcp-tool/releases)
[![npm version](https://img.shields.io/npm/v/ccg-mcp-tool)](https://www.npmjs.com/package/ccg-mcp-tool)
[![npm downloads](https://img.shields.io/npm/dt/ccg-mcp-tool)](https://www.npmjs.com/package/ccg-mcp-tool)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red.svg)](https://github.com/diaz3618/ccg-mcp-tool)

</div>

> 📚 **[View Full Documentation](https://diaz3618.github.io/ccg-mcp-tool/)** - Search me!, Examples, FAQ, Troubleshooting, Best Practices

This is a powerful Model Context Protocol (MCP) server that integrates multiple AI coding agents—**Anthropic Claude Code**, **OpenAI Codex**, and **Google Gemini**—directly into your workflow. It enables seamless cross-provider analysis, leveraging Gemini's massive token window, Codex's specialized coding capabilities, and Claude's advanced reasoning.

- Ask any supported AI for its perspective.
- Brainstorm ideas with multi-provider frameworks.
- **New:** Apply research-grounded mitigation skills to avoid common AI coding mistakes.

## [![Claude](https://img.shields.io/badge/Claude-D97757?logo=claude&logoColor=fff)](#)  [![Google Gemini](https://img.shields.io/badge/Google%20Gemini-886FBF?logo=googlegemini&logoColor=fff)](#)  [![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=fff)](#)

**Goal**: Use the best AI for the job. Analyze massive codebases with Gemini, get precision edits with Codex, or use Claude's reasoning—all from a single MCP interface.

## Prerequisites

Ensure you have the following CLI tools installed and configured:

1. **[Node.js](https://nodejs.org/)** (v16.0.0 or higher)
2. **[Google Gemini CLI](https://github.com/google-gemini/gemini-cli)**
3. **[Codex CLI](https://github.com/openai/codex)** (optional)
4. **[Claude Code](https://github.com/anthropics/claude-code)** (optional)

## Installation

```bash
claude mcp add ccg-tool -- npx -y ccg-mcp-tool
```

## Configuration

Register the MCP server with your MCP client. You can set the default provider and model via command-line arguments:

### For NPX Usage (Recommended)

Add this configuration to your Claude Desktop config file:

```json
{
  "mcpServers": {
    "ccg-tool": {
      "command": "npx",
      "args": [
        "-y", 
        "ccg-mcp-tool",
        "--provider",
        "codex",
        "--model",
        "gpt-5.3-codex"
      ]
    }
  }
}
```

*Note: The `--provider` and `--model` startup arguments set the global default for all tool calls in your session. Tools still support overriding these per-request.*

## Example Workflow

- **Multi-Provider**: `ask ai --provider codex --model gpt-5.3-codex to refactor @src/auth.ts`
- **Mistake Mitigation**: `mitigate mistakes --skill requirements-grounding for @new-feature.md`
- **Gemini Specific**: `ask gemini to analyze @. and explain the architecture`

## Tools (for the AI)

### `ask-ai` (or `ask-gemini`)

Universal tool for AI analysis across providers.

- **`prompt`** (required): Your request. Use `@` for files.
- **`provider`** (optional): `gemini`, `codex`, or `claude`. Defaults to server config.
- **`model`** (optional): Specific model for the provider (e.g., `gemini-2.5-flash`, `gpt-5.3-codex`).
- **`sandbox`** (optional): Gemini-only. Run in an isolated environment.
- **`changeMode`** (optional): Gemini-only. Returns structured edits.

### `mitigate-mistakes`

Apply research-grounded gates to prevent common AI agent failure modes.

- **`skill`** (required): The mitigation gate to apply (e.g., `requirements-grounding`, `secure-coding-and-validation-gate`).
- **`prompt`** (required): The task or code to analyze.
- **`provider`** (optional): Which AI to use for the assessment.

**Available Skills:**

- `requirements-grounding`: Prevent requirement-conflicting hallucinations.
- `context-scope-discipline`: Maintain focus on the requested change set.
- `dependency-verification`: Verify imports and versions.
- `design-doc-and-architecture-gate`: Ensure structural integrity.
- `test-and-error-path-gate`: Validate edge cases and failure modes.
- `secure-coding-and-validation-gate`: Identify security risks (unbiased).
- `code-quality-enforcer`: Check for maintainability and patterns.
- `deterministic-validation-gate`: Use evidence-based checks.
- `code-review-and-change-gate`: Final gate before application.

### `brainstorm`

Generate ideas using structured methodologies like SCAMPER or Design Thinking.

- **`methodology`**: `divergent`, `convergent`, `scamper`, `lateral`, etc.
- **`domain`**: Specialized context (e.g., `software`, `security`).

## License

MIT License.

**Disclaimer:** This is an unofficial tool and is not affiliated with Google, OpenAI, or Anthropic.
