# Architecture

CCG MCP Tool is an MCP server that bridges MCP-compatible clients (Claude Code, Claude Desktop, etc.) to three AI provider CLIs: Claude Code, OpenAI Codex, and Google Gemini CLI.

```
┌─────────────────┐       MCP/STDIO        ┌─────────────────┐
│   MCP Client    │ ◄────────────────────► │                 │
│ (Claude Code,   │   tools/list           │  ccg-mcp-tool   │
│  Claude Desktop,│   tools/call           │  (MCP Server)   │
│  Warp, etc.)    │                        │                 │
└─────────────────┘                        └────────┬────────┘
                                                    │
                                           spawn child processes
                                                    │
                             ┌──────────────────────┼──────────────────────┐
                             ▼                      ▼                      ▼
                       ┌───────────┐          ┌───────────┐          ┌───────────┐
                       │  claude   │          │   codex   │          │  gemini   │
                       │   CLI     │          │    CLI    │          │   CLI     │
                       └───────────┘          └───────────┘          └───────────┘
```

## Source Layout

```
src/
├── index.ts                  Server entry point, MCP request handlers
├── config.ts                 CLI argument parsing (--provider, --model, --agent-mode)
├── constants.ts              Providers, models, timeouts, tool argument types
│
├── tools/
│   ├── registry.ts           UnifiedTool interface, tool registry, schema conversion
│   ├── index.ts              Re-exports: getToolDefinitions, executeTool, etc.
│   ├── simple-tools.ts       ping, Help tools
│   ├── ask-ai.tool.ts        ask-ai tool (core AI interaction)
│   ├── brainstorm.tool.ts    brainstorm tool (structured ideation)
│   ├── analyzer.tool.ts      mitigate-mistakes, coordinate-review tools
│   ├── fetch-chunk.tool.ts   fetch-chunk tool (retrieve chunked responses)
│   ├── deploy-agents.tool.ts deploy-agents tool (multi-agent orchestration)
│   ├── agent-status.tool.ts  agent-status tool (session monitoring)
│   └── timeout-test.tool.ts  timeout-test tool (developer utility)
│
└── utils/
    ├── commandExecutor.ts    Spawns provider CLIs, captures output
    ├── aiExecutor.ts         Builds provider-specific CLI commands
    ├── logger.ts             Structured logging (info/warn/error/debug)
    ├── chunkCache.ts         LRU cache for large response chunking
    ├── changeModeParser.ts   Parses Gemini change-mode structured output
    ├── changeModeChunker.ts  Chunks change-mode responses
    ├── changeModeTranslator.ts  Translates change-mode to apply instructions
    ├── agentOrchestrator.ts  Multi-agent orchestration engine
    ├── agentSession.ts       Session state for orchestration runs
    ├── collaborationSpace.ts Shared context space for agent coordination
    └── timeoutManager.ts     Per-tool timeout configuration
```

## Key Patterns

### Tool Registry

All tools implement `UnifiedTool` and self-register into a shared array. The server discovers tools via `getToolDefinitions()` at startup.

```typescript
interface UnifiedTool {
  name: string;
  description: string;
  zodSchema: ZodTypeAny;
  execute: (args, onProgress?) => Promise<string>;
}
```

Each tool defines its input schema with Zod. The registry converts Zod schemas to JSON Schema for MCP `tools/list` responses.

### Provider Abstraction

`aiExecutor.ts` builds CLI commands per provider. `commandExecutor.ts` spawns the CLI as a child process and captures stdout. The server doesn't call provider APIs directly — it delegates to locally installed CLIs.

### Agent Mode Enforcement

The `--agent-mode` flag (parsed in `config.ts`) maps to provider-specific permission flags:

| Agent Mode | Claude | Codex | Gemini |
|------------|--------|-------|--------|
| `read-only` | `--permission-mode plan` | `--sandbox read-only` | `--approval-mode plan` |
| `write` | Standard | Standard | Standard |

### Multi-Agent Orchestration

`deploy-agents` spawns multiple CLI processes via `AgentOrchestrator`. Three strategies:

- **Parallel**: N agents work on 1 task concurrently
- **Sequential**: Agents chain, each sees prior outputs via `CollaborationSpace`
- **Fan-out**: 1 agent per task

`CollaborationSpace` provides a shared context area where agents read/write findings to avoid redundancy.

#### Parallel strategy

```
                      ┌───────────────────────────┐
                      │      deploy-agents        │
                      │   strategy: parallel      │
                      │   tasks: ["review auth"]  │
                      └─────────────┬─────────────┘
                                    │
                        ┌───────────▼───────────┐
                        │   AgentOrchestrator   │
                        │  (generates session)  │
                        └───┬────┬──────────┬───┘
        ┌───────────────────┘    │          └─────────┬───────────────┐
        │                        ▼                    │               │
        │ (independent)    buildAgentPrompt           │ (independent) │
        ▼                   (independent)             ▼               │
  ┌───────────┐             ┌───────────┐       ┌───────────┐         │
  │  Agent 1  │             │  Agent 2  │       │  Agent 3  │         │
  │ spawn CLI │             │ spawn CLI │       │ spawn CLI │         │
  └─────┬─────┘             └─────┬─────┘       └─────┬─────┘         │
        │                         │                   │               │
        └───────┬─────────────────┴──┬────────────────┘               │
                │  limitConcurrency  │                                │
                │  (maxConcurrency)  │                                │
                ▼                    ▼                                │
        ┌─────────────────────────────────┐                           │
        │    CollaborationSpace           │◄──────────────────────────┘
        │  publish(agentId, output)       │
        │  agents share results after     │
        └───────────────┬─────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │ synthesize    │
                │ Results       │
                │ (aggregate)   │
                └───────┬───────┘
                        │
                        ▼
             ┌─────────────────────┐
             │ OrchestrationResult │
             │ stored in session   │
             └─────────────────────┘
```

#### Sequential strategy

```
  ┌──────────────────────────────┐
  │      AgentOrchestrator       │
  │    strategy: sequential      │
  └──────────────┬───────────────┘
                 │
                 ▼
          ┌─────────────┐
          │   Agent 1   │───► spawn CLI ───► output
          └──────┬──────┘
                 │ publish output to CollaborationSpace
                 ▼
          ┌─────────────┐
          │   Agent 2   │◄── buildContext(agent-2)  ← sees Agent 1 output
          │             │───► spawn CLI ───► output
          └──────┬──────┘
                 │ publish output
                 ▼
          ┌─────────────┐
          │   Agent 3   │◄── buildContext(agent-3)  ← sees Agent 1+2 outputs
          │             │───► spawn CLI ───► output
          └──────┬──────┘
                 │
                 ▼
          ┌─────────────┐
          │  synthesize │
          └─────────────┘
```

#### Fan-out strategy

```
  ┌──────────────────────────────────────────────────┐
  │               AgentOrchestrator                  │
  │               strategy: fan-out                  │
  │  tasks: ["tests auth", "tests api", "tests db"]  │
  └──────┬───────────────┬───────────────┬───────────┘
         │               │               │
         ▼               ▼               ▼
  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
  │   Agent 1   │ │   Agent 2   │ │   Agent 3   │
  │ "tests auth"│ │ "tests api" │ │ "tests db"  │
  │ + task list │ │ + task list │ │ + task list │
  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
         │               │               │
         └───────────────┼───────────────┘
                         │ limitConcurrency
                         ▼
                  ┌──────────────┐
                  │  synthesize  │
                  └──────────────┘
```

### Response Chunking

Large provider outputs are split into chunks stored in `ChunkCache` (LRU, 50-entry limit). The client retrieves subsequent chunks via `fetch-chunk`.

## Dependencies

| Package | Purpose |
|---------|---------|
| `@modelcontextprotocol/sdk` | MCP server framework (STDIO transport) |
| `zod` | Input schema validation |
| `zod-to-json-schema` | Convert Zod schemas to JSON Schema for MCP |

## Build & Runtime

- **Language**: TypeScript (strict mode, ES2022 target)
- **Module**: ESM (`"type": "module"`, `.js` import extensions)
- **Build**: `tsc` → `dist/`
- **Entry**: `dist/index.js` (shebang: `#!/usr/bin/env node`)
- **Runtime**: Node.js ≥ 16
