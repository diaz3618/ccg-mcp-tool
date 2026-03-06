# Changelog

## [Unreleased]

### Multi-Agent Orchestration
- **Feature**: `deploy-agents` tool — deploy 2-10 AI agents working collaboratively or independently
  - **parallel**: Multiple agents analyze the same task concurrently, results merged
  - **sequential**: Agents chain in order, each building on prior agents' outputs
  - **fan-out**: Each agent works on a separate task from a list (one agent per task)
- **Feature**: `agent-status` tool — query session history and per-agent results
- **Feature**: `--agent-mode` server arg (`read-only` | `write`) for strict enforcement
  - Claude: `--permission-mode plan` (native)
  - Codex: `--sandbox read-only` (native)
  - Gemini: `--approval-mode plan` (native)
- **Feature**: Inter-agent communication via CollaborationSpace message bus
- **Feature**: Custom concurrency limiter (no external dependency)
- **Architecture**: New modules: `agentSession.ts`, `agentOrchestrator.ts`, `collaborationSpace.ts`
- **Scan**: Snyk 0 issues, semgrep 0 findings (384 rules), knip 0 issues, tsc clean

## [0.3.1] - 2026-03-06
- **Security**: Upgraded `@modelcontextprotocol/sdk` from 0.5.0 to 1.27.1 (fixes GHSA-8r9q-7v3j-jr4g ReDoS, GHSA-w48q-cv73-mx4w DNS rebinding)
- **Security**: Added path traversal guard with `path.resolve` validation in chunkCache.ts
- **Security**: Added nosemgrep annotations for validated command execution and path operations
- **Fix**: Removed deprecated `notifications` capability from Server config (breaking change in SDK 1.x)
- **Docker**: Added multi-stage Dockerfile (node:20-slim, 73MB content size)
- **Docker**: Added .dockerignore for optimized build context
- **CI**: Cleaned up docker-publish.yml (GHCR only, removed DockerHub references)
- **Scan**: Knip 0 issues, ESLint 0 errors, semgrep 0 unresolved findings

## [0.3.0] - 2026-03-05
- **Fix**: Claude CLI model name changed from invalid `claude-3-5-sonnet` to alias `sonnet` (Claude CLI accepts aliases: `sonnet`, `opus`, `haiku`)
- **Fix**: Help tool now uses `--help` for all providers (was incorrectly using `-help` for Gemini)
- **Fix**: `CLI.FLAGS.HELP` constant corrected from `-help` to `--help`
- **Docs**: Updated README config example to use `--provider claude --model sonnet`
- **Docs**: Added Claude CLI alias guidance to models.md
- **Docs**: Fixed `gemini -help` → `gemini --help` in getting-started.md
- **Docs**: Fixed FundingHero component name from "Gemini MCP Tool" to "CCG MCP Tool"
- **Docs**: Updated troubleshooting model recommendations to use CLI-valid names
- **Docs**: Removed legacy `ask-gemini` alias reference from fetch-chunk error message

## [0.2.0] - 2026-07-01
- **Security**: Fixed shell injection in GitHub Actions workflows (moved `github.event.inputs.tag` to `env:` block in docker-publish.yml and npm-publish.yml)
- **Security**: Added `cacheKey` hex validation in `chunkCache.ts` to prevent path traversal
- **Security**: Added `nosemgrep` suppressions for intentional `child_process` usage and Prism.js `v-html`
- **Docs**: Rewrote `docs/concepts/models.md` with full model listing for Gemini (5 models), Claude (5 models), and Codex/OpenAI (6 models) including context windows, output limits, strengths, and use-case tables
- **Dev tooling**: Added Prettier, ESLint (flat config), and Husky pre-push hooks — prettier/eslint hard-fail, knip soft-warn (false-positive safe)
- **Code quality**: Resolved 13 ESLint errors (unused vars, prefer-const) across source files; all sources formatted with Prettier

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
