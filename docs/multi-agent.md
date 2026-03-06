# Multi-Agent Orchestration

Deploy multiple AI agents to work on tasks collaboratively or independently using the `deploy-agents` tool. Agents communicate through a `CollaborationSpace` to share context and avoid redundancy.

## Strategies

### Parallel

All agents work on the same task concurrently. Each gets the shared context plus the task. Outputs are merged after completion.

```
deploy 3 agents to review @src/auth.ts for security issues
```

### Sequential

Agents process in order. Each agent sees the cumulative output of all prior agents, enabling iterative refinement.

```
deploy agents with strategy sequential to refactor @src/utils.ts
```

### Fan-out

Each agent gets a separate task from the list. One agent per task, non-overlapping.

```
deploy agents with tasks: ["add tests for auth", "add tests for api", "add tests for db"] strategy: fan-out
```

## Agent mode

The `--agent-mode` server argument controls what spawned agents can do:

| Mode | Description | Claude | Codex | Gemini |
|------|-------------|--------|-------|--------|
| `read-only` (default) | Agents can only read and analyze | `--permission-mode plan` | `--sandbox read-only` | `--approval-mode plan` |
| `write` | Agents can modify files | Standard permissions | Standard | Standard |

Set in your MCP config:

```json
{
  "mcpServers": {
    "ccg-tool": {
      "command": "npx",
      "args": ["-y", "@diazstg/ccg-mcp-tool", "--agent-mode", "read-only"]
    }
  }
}
```

## Checking status

Use `agent-status` to monitor sessions:

```
/ccg-tool:agent-status
/ccg-tool:agent-status sessionId:"ses_abc123"
```

## How it works

The `AgentOrchestrator` in `src/utils/agentOrchestrator.ts`:

1. Creates a `CollaborationSpace` for the session
2. Generates agent assignments based on strategy
3. Spawns CLI processes with a concurrency limiter (no external dependency)
4. Collects results and synthesizes a summary
5. Stores the session for later status queries

See [ARCHITECTURE.md](../ARCHITECTURE.md) for the full flow diagram.
