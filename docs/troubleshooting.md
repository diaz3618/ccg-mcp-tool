# Troubleshooting

## "Command not found: gemini" (or codex, claude)

Install the CLI globally:

```bash
npm i -g @google/gemini-cli      # Gemini
npm i -g @openai/codex           # Codex
npm i -g @anthropics/claude-code # Claude
```

## MCP server not responding

1. Run `claude /doctor` if using Claude Code
2. Verify your JSON config is syntactically valid
3. Restart your MCP client completely
4. Confirm the CLI works directly: `gemini --help`

## Quota exceeded (Gemini)

Gemini 2.5 Pro has a daily quota. When exhausted:
- The server automatically retries with `gemini-2.5-flash`
- Or specify `model:gemini-2.5-flash` explicitly

## Large responses are truncated

Responses exceeding chunk limits are stored in cache. Use `fetch-chunk` with the returned `cacheKey` to retrieve remaining chunks.

## Agent timeout

Multi-agent orchestration has a per-agent timeout. For very large tasks, reduce `agentCount` or split into smaller `tasks` with fan-out strategy.

## Claude Desktop config not taking effect

Claude Desktop requires a full restart (not just window close) after config changes.
