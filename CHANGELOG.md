# Changelog

## [Unreleased]

## [0.1.0] - 2026-03-04
- **Initial release** of `@diazstg/ccg-mcp-tool`
- Multi-provider AI CLI integration: Gemini, Codex, and Claude Code
- `ask-ai` tool with `--provider`, `--model`, `--sandbox`, and change mode support
- `brainstorm`, `analyze`, `fetch-chunk`, `ping`, and `help` tools
- Structured change mode output (FILE:OLD/NEW blocks) for programmatic code editing
- Chunked response cache for large AI outputs

## [1.2.0] - 2026-03-03
- **Rebranding**: Project renamed to **CCG MCP Tool** (Claude Code/Codex/Gemini).
- **Multi-Provider Support**: Integrated **OpenAI Codex** and **Anthropic Claude Code** CLI alongside Google Gemini.
- **Unified AI Tool**: Added `ask-ai` tool (with `ask-gemini` alias) supporting `--provider` and `--model` flags for cross-provider analysis.
- **Mistake Mitigation**: Introduced `mitigate-mistakes` tool with 9 research-grounded skills (e.g., `requirements-grounding`, `secure-coding`) to avoid common AI agent failure modes.
- **Research-Grounded Skills**: Leveraged academic and professional journals for unbiased mitigation gates, accessible across all supported providers.
- **Startup Configuration**: Added support for `--provider` and `--model` arguments in the MCP server startup configuration to set global defaults.
- **Enhanced Documentation**: Updated comprehensive guides for multi-provider workflows and mistake mitigation best practices.

## [1.1.3]
- "gemini reads, claude edits"
- Added `changeMode` parameter to `ask-ai` (or `ask-gemini`) tool for structured edit responses using claude edit diff.
- Testing intelligent parsing and chunking for large edit responses (>25k characters). I recommend you provide a focused prompt, although large (2000+) line edits have had success in testing.
- Added structured response format with Analysis, Suggested Changes, and Next Steps sections
- Improved guidance for applying edits using Claude's Edit/MultiEdit tools, avoids reading...
- Testing token limit handling with continuation support for large responses

## [1.1.2]
- Gemini-2.5-pro quota limit exceeded now falls back to gemini-2.5-flash automatically. Unless you ask for pro or flash, it will default to pro.

## [1.1.1]

- Public
- Basic Gemini CLI integration
- Support for file analysis with @ syntax
- Sandbox mode support
