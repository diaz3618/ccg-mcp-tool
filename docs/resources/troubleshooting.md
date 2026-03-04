# Troubleshooting

Common issues and their solutions. Click any issue below to see the detailed solution.

<script setup>
import TroubleshootingModal from '../.vitepress/components/TroubleshootingModal.vue'
</script>

## Installation Issues

<TroubleshootingModal 
  title='"Command not found: gemini" (or codex/claude)'
  preview="An underlying AI CLI is not installed or not in your PATH"
>

The required CLI is not installed. Install the ones you plan to use:
```bash
# For Gemini
npm install -g @google/gemini-cli

# For Codex
npm install -g @openai/codex

# For Claude Code
npm install -g @anthropics/claude-code
```

After installation, verify it works:
```bash
gemini --version
codex --version
claude --version
```

If you still get "command not found", restart your terminal or add your npm global bin to your PATH.

</TroubleshootingModal>

<TroubleshootingModal 
  title="Windows NPX Installation Issues"
  preview='Error: unknown option "-y" when using Claude Code on Windows'
>

**Problem**: `error: unknown option '-y'` when using Claude Code on Windows

**Solution**: Use one of these alternative installation methods:

```bash
# Method 1: Install globally first
npm install -g ccg-mcp-tool
claude mcp add ccg-tool -- ccg-mcp-tool

# Method 2: Use --yes instead of -y
claude mcp add ccg-tool -- npx --yes ccg-mcp-tool

# Method 3: Remove the -y flag entirely
claude mcp add ccg-tool -- npx ccg-mcp-tool
```

</TroubleshootingModal>

<TroubleshootingModal 
  title='"MCP server not responding"'
  preview="Claude Desktop can't connect to the MCP server"
>

**Step-by-step solution**:

1. **Check your Claude Desktop config file location**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Verify JSON syntax is correct**
   - Ensure the `args` array has correct comma separation.
   - Example: `["-y", "ccg-mcp-tool", "--provider", "codex"]`

3. **Restart Claude Desktop completely**
   - Quit completely (Cmd+Q on Mac)
   - Wait 5 seconds
   - Restart Claude Desktop

</TroubleshootingModal>

## Provider Issues

<TroubleshootingModal 
  title='"Failed to connect to Provider"'
  preview="Authentication problems with Gemini, OpenAI, or Anthropic"
>

Each provider requires its own authentication:

1. **Gemini**: Run `gemini config set api_key YOUR_KEY`
2. **Codex**: Run `codex auth` or ensure your API key is in environment variables.
3. **Claude Code**: Ensure you are logged in via `claude auth`.

Test basic connectivity:
```bash
/ccg-tool:ping "test"
```

</TroubleshootingModal>

<TroubleshootingModal 
  title='"Timeout errors"'
  preview="Requests taking too long or timing out"
>

**Common causes and solutions**:

1. **Large files naturally take time** - Analyzing 2M tokens with Gemini Pro can take several minutes.

2. **Switch to a faster model**:
   - For Gemini: Use `gemini-2.5-flash`
   - For Codex: Use `gpt-5.3-codex-spark`

3. **The tool prevents timeouts automatically**:
   - Progress updates are sent every 25 seconds to keep the connection alive.
   - If your client still times out, try more specific file patterns with `@` to reduce the load.

</TroubleshootingModal>

## Debug Mode

Enable debug logging to see what's happening under the hood:
```json
{
  "mcpServers": {
    "ccg-tool": {
      "command": "npx",
      "args": ["-y", "ccg-mcp-tool"],
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

## Model Recommendations

| **Provider** | **Recommended Model** | **Best For** |
|--------------|----------------------|------------|
| Gemini | `gemini-2.5-flash` | Fast file analysis |
| Codex | `gpt-5.3-codex` | Precision refactoring |
| Claude | `claude-3-5-sonnet` | Complex logic / RCA |

## Reset Everything

If you are stuck, try a clean install:
```bash
npm uninstall -g ccg-mcp-tool
npm install -g ccg-mcp-tool
```
