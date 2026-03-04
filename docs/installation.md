# Installation

Multiple ways to install **CCG MCP Tool**, depending on your needs.

## Prerequisites

- **Node.js** v16.0.0 or higher
- **Claude Desktop** or **Claude Code** with MCP support
- **AI CLI Tools** (at least one):
  - **Gemini CLI**: `npm install -g @google/gemini-cli`
  - **Codex CLI**: `npm install -g @openai/codex`
  - **Claude Code**: `npm install -g @anthropics/claude-code`

## Method 1: NPX (Recommended)

No manual installation needed - runs directly:

```json
{
  "mcpServers": {
    "ccg-tool": {
      "command": "npx",
      "args": ["-y", "ccg-mcp-tool"]
    }
  }
}
```

## Method 2: Global Installation

You can add it directly to Claude Code:

```bash
claude mcp add ccg-tool -- npx -y ccg-mcp-tool
```

Or configure manually if installed globally via `npm install -g ccg-mcp-tool`:
```json
{
  "mcpServers": {
    "ccg-tool": {
      "command": "ccg-mcp"
    }
  }
}
```

## Startup Arguments (Configuration)

You can set the default provider and model at startup in your MCP configuration:

```json
"args": ["-y", "ccg-mcp-tool", "--provider", "codex", "--model", "gpt-5.3-codex"]
```

See [Getting Started](/getting-started) for full setup instructions.
