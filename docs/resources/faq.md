# Frequently Asked Questions

## General

### What is CCG MCP Tool?
A bridge between MCP-compatible clients (like Claude Code) and three AI giants: **Claude Code**, **OpenAI Codex**, and **Google Gemini**.

### Why use this instead of the CLIs directly?
- **Unified Interface**: One MCP server for all your favorite coding agents.
- **Workflow Integration**: No context switching—use them inside your primary IDE or chat interface.
- **Mistake Mitigation**: Research-grounded gates to prevent common AI coding errors.
- **Multi-Provider Strategy**: Use the right tool for the job (e.g. Gemini for context, Codex for precision).

### Is it free?
The tool itself is open-source and free. You will need the respective CLI tools and access/API keys for the underlying models.

## Setup

### Which CLI tools do I need?
At least one of the following:
- **Gemini CLI**: `npm install -g @google/gemini-cli`
- **Codex CLI**: `npm install -g @openai/codex`
- **Claude Code**: `npm install -g @anthropics/claude-code`

### Can I use this with Claude Desktop?
Yes! It works with both Claude Desktop and Claude Code.

## Usage

### What's the @ syntax?
It's how you reference files for analysis:
- `@file.js` - Single file
- `@src/*.js` - Multiple files
- `@**/*.ts` - All TypeScript files

### How do I switch providers?
Use the `provider` argument in your tool calls (e.g. `provider:codex`) or set a default in your MCP configuration using the `--provider` startup argument.

### Which model should I use?
- **Large Codebase Analysis**: Gemini Pro
- **Precise Refactoring**: OpenAI Codex
- **Complex Reasoning & Bugs**: Claude 3.5 Sonnet

## Features

### What is "Mistake Mitigation"?
It's a set of 9 research-grounded skills (e.g. `requirements-grounding`, `secure-coding`) that analyze your task or code for common failure modes identified in academic studies of AI coding agents.

### Does it work offline?
No, it requires an internet connection to communicate with the respective AI providers via their CLI tools.

## Troubleshooting

### Why is it slow?
Analyzing large codebases takes time. Gemini Pro can handle millions of tokens, but it's not instantaneous. Try using Gemini Flash or Codex for smaller, targeted tasks.

### "Command not found"
Ensure the underlying CLI tool (gemini, codex, or claude) is in your system PATH and accessible from your terminal.

## Privacy & Security

### Is my code secure?
Code is processed according to the privacy policies of the respective providers (Google, OpenAI, Anthropic). We do not store or transmit your code anywhere else.

<div style="text-align: center;">

## Why CCG MCP?

</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin: 24px 0;">
  <div style="background: var(--vp-c-bg-soft); padding: 16px; border-radius: 8px; border: 1px solid var(--vp-c-divider);">
    <h4 style="margin: 0 0 8px 0; color: var(--vp-c-brand);">Research-Grounded</h4>
    <p style="margin: 0; font-size: 14px; line-height: 1.5;">Built-in mitigation gates based on academic journals to prevent common AI mistakes.</p>
  </div>
  
  <div style="background: var(--vp-c-bg-soft); padding: 16px; border-radius: 8px; border: 1px solid var(--vp-c-divider);">
    <h4 style="margin: 0 0 8px 0; color: var(--vp-c-brand);">Multi-Provider</h4>
    <p style="margin: 0; font-size: 14px; line-height: 1.5;">Claude, Codex, and Gemini all in one place. Choose your giant per-request.</p>
  </div>
  
  <div style="background: var(--vp-c-bg-soft); padding: 16px; border-radius: 8px; border: 1px solid var(--vp-c-divider);">
    <h4 style="margin: 0 0 8px 0; color: var(--vp-c-brand);">Large Context</h4>
    <p style="margin: 0; font-size: 14px; line-height: 1.5;">Leverage Gemini's 2M token window to analyze entire repositories at once.</p>
  </div>
</div>

## More Questions?

- Check [GitHub Issues](https://github.com/diaz3618/ccg-mcp-tool/issues)
- Browse the [Best Practices](/usage/best-practices) guide
