## Getting Started

<div align="center">Find your setup below</div>

<ClientGrid>
  <div class="client-card client-card--recommended claude-code-card">
    <h3>Claude Code</h3>
    <div class="client-badge">Power Users</div>
    <p>One-command setup</p>
    <a href="#claude-code-recommended" class="client-button">Get Started →</a>
  </div>
  
  <div class="client-card">
    <h3>Claude Desktop</h3>
    <div class="client-badge">Everyday users</div>
    <p>JSON configuration</p>
    <a href="#claude-desktop" class="client-button">Setup Guide →</a>
  </div>
  
  <div class="client-card">
    <h3>Other Clients</h3>
    <div class="client-badge">40+ Options</div>
    <p>Warp, Copilot, and More</p>
    <a href="#other-mcp-clients" class="client-button">More →</a>
  </div>
</ClientGrid>

## Client Setup

## Prerequisites

Before installing, ensure you have:

- **[Node.js](https://nodejs.org/)** v16.0.0 or higher
- **AI CLI Tools** (Gemini CLI, Codex CLI, and/or Claude Code) installed and configured on your system
- **[Claude Desktop](https://claude.ai/download)** or **[Claude Code](https://www.anthropic.com/claude-code)** with MCP support


## Claude Code (Recommended)
::: warning ccg-mcp-tool is tested extensively with claude code
:::
Claude Code offers the smoothest experience.

```bash
# install for claude code
claude mcp add ccg-tool -- npx -y ccg-mcp-tool

# Start Claude Code - it's automatically configured!
claude
```

## Claude Desktop
---
#### Configuration File Locations

<ConfigModal>

*Where are my Claude Desktop Config Files?:*

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

</ConfigModal>

---

For Claude Desktop users, add this to your configuration file:

```json
{
  "mcpServers": {
    "ccg-tool": {
      "command": "npx",
      "args": [
        "-y", 
        "ccg-mcp-tool",
        "--provider",
        "gemini",
        "--model",
        "gemini-2.5-pro"
      ]
    }
  }
}
```

::: warning
You must restart Claude Desktop ***completely*** for changes to take effect.
:::
## Other MCP Clients

CCG MCP Tool works with 40+ MCP clients! Here are the common configuration patterns:

### STDIO Transport (Most Common)
```json
{
  "transport": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "ccg-mcp-tool"]
  }
}
```

### Popular Clients

<details>
<summary><strong>Warp</strong> - Modern terminal with AI features</summary>

**Configuration Location:** Terminal Settings → AI Settings → MCP Configuration

```json
{
  "ccg-tool": {
    "command": "npx",
    "args": [
      "-y",
      "ccg-mcp-tool"
    ],
    "env": {},
    "working_directory": null,
    "start_on_launch": true
  }
}
```

**Features:** Terminal-native MCP integration, AI-powered command suggestions
</details>
### Generic Setup Steps

1. **Install Prerequisites**: Ensure your preferred AI CLIs are installed
2. **Add Server Config**: Use the STDIO transport pattern above
3. **Restart Client**: Most clients require restart after config changes
4. **Test Connection**: Try `/ccg-tool:ping` or natural language commands

## Verify Your Setup

Once configured, test that everything is working:

### 1. Basic Connectivity Test
Type in Claude:
```
/ccg-tool:ping "Hello from CCG MCP!"
```

### 2. Test File Analysis
```
/ccg-tool:ask-ai prompt:@README.md summarize this file
```

### 3. Test Provider Selection
```
/ccg-tool:ask-ai prompt:"What is the capital of France?" provider:codex
```

## Quick Command Reference

Once installed, you can use natural language or slash commands:

### Natural Language Examples
- "use gemini to explain index.html"
- "ask codex to refactor this @file.js"
- "have claude explain this error"
- "mitigate mistakes for @new-feature.md"

### Slash Commands in Claude Code
Type `/ccg-tool` and these commands will appear:
- `/ccg-tool:ask-ai` - Universal tool for AI analysis
- `/ccg-tool:mitigate-mistakes` - Apply research-grounded gates
- `/ccg-tool:brainstorm` - Multi-methodology ideation
- `/ccg-tool:ask-ai` (with `sandbox:true`) - Safe code execution (Gemini)
- `/ccg-tool:help` - Show help information
- `/ccg-tool:ping` - Test connectivity

## Need a Different Client?

Don't see your MCP client listed? CCG MCP Tool uses standard MCP protocol and works with any compatible client.

::: tip Find More MCP Clients
- **Official List**: [modelcontextprotocol.io/clients](https://modelcontextprotocol.io/clients)
- **Configuration Help**: Most clients follow the STDIO transport pattern above
- **Community**: Join discussions on GitHub for client-specific tips
:::

## Common Issues

### "Command not found: gemini" (or codex/claude)
Make sure you've installed the respective CLI:
```bash
npm install -g @google/gemini-cli
# or
npm install -g @openai/codex
# or
npm install -g @anthropics/claude-code
```

### "MCP server not responding"
0. run claude code --> /doctor
1. Check your configuration file path
2. Ensure JSON syntax is correct
3. Restart your MCP client completely
4. Verify your AI CLI works (e.g. `gemini --help`)


### Client-Specific Issues
- **Claude Desktop**: Must restart completely after config changes
- **Other Clients**: Check their specific documentation for MCP setup

## Next Steps

Now that you're set up:
- Learn about file analysis with @ syntax
- Explore provider-specific strengths
- Apply research-grounded mitigation skills
- Check out real-world examples in the README

::: info Need Help?
If you run into issues, [open an issue](https://github.com/diaz3618/ccg-mcp-tool/issues) on GitHub.
:::