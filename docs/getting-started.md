# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/) v16+
- At least one AI CLI installed and authenticated:
  - [Gemini CLI](https://github.com/google-gemini/gemini-cli) — `npm i -g @google/gemini-cli`
  - [Codex CLI](https://github.com/openai/codex) — `npm i -g @openai/codex`
  - [Claude Code](https://claude.com/product/claude-code) — `npm i -g @anthropics/claude-code`

## Install

### Claude Code (recommended)

```bash
claude mcp add ccg-tool -- npx -y @diazstg/ccg-mcp-tool
```

### Manual JSON config

Add to your MCP client configuration file:

```json
{
  "mcpServers": {
    "ccg-tool": {
      "command": "npx",
      "args": ["-y", "@diazstg/ccg-mcp-tool"]
    }
  }
}
```

**Config file locations:**

| Client | Path |
|--------|------|
| Claude Code | `~/.claude.json` |
| Claude Desktop (macOS) | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Desktop (Windows) | `%APPDATA%\Claude\claude_desktop_config.json` |
| Claude Desktop (Linux) | `~/.config/claude/claude_desktop_config.json` |

### Startup options

```json
{
  "mcpServers": {
    "ccg-tool": {
      "command": "npx",
      "args": [
        "-y", "@diazstg/ccg-mcp-tool",
        "--provider", "gemini",
        "--model", "gemini-2.5-pro",
        "--agent-mode", "read-only"
      ]
    }
  }
}
```

| Argument | Default | Description |
|----------|---------|-------------|
| `--provider` | `gemini` | Default AI provider (`claude`, `codex`, `gemini`) |
| `--model` | Provider default | Default model name |
| `--agent-mode` | `read-only` | Permission mode for spawned agents (`read-only`, `write`) |

## Verify

```
/ccg-tool:ping message:"hello"
```

Then try a real query:

```
/ccg-tool:ask-ai prompt:"@README.md summarize this file"
```

## Next steps

- [Tools reference](tools.md) — all 10 tools with parameters
- [Providers & models](providers.md) — choosing the right model
- [Multi-agent orchestration](multi-agent.md) — deploying multiple agents
