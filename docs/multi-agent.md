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

## Claude Code Agent Teams

When using the `claude` provider, you can enable **Claude Code Agent Teams** — an experimental Anthropic feature where Claude Code natively orchestrates a team of Claude Code sessions.

Instead of the CCG orchestrator spawning separate CLI processes, a single Claude Code session acts as the team lead, creates teammates, assigns tasks, and coordinates via a shared task list and inter-agent messaging.

### Prerequisites

1. **Claude Code** must be installed and available as `claude` in your PATH
2. **Agent Teams must be enabled** in Claude Code. Set the environment variable or add it to your Claude Code `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

See Anthropic's official documentation: https://code.claude.com/docs/en/agent-teams

### Usage

Pass `useAgentTeams: true` with `provider: "claude"`:

```
/ccg-tool:deploy-agents tasks:["review auth module"] strategy:parallel agentCount:3 provider:claude useAgentTeams:true
```

```
/ccg-tool:deploy-agents tasks:["add tests for auth","add tests for api","add tests for db"] strategy:fan-out provider:claude useAgentTeams:true
```

When `useAgentTeams` is enabled:
- The CCG orchestrator delegates entirely to Claude Code's native team coordination
- Claude Code spawns teammates, manages a shared task list, and handles inter-agent messaging
- The strategy parameter (`parallel`, `sequential`, `fan-out`) is translated into team instructions
- The output is the synthesized result from the team lead

### Limitations

- **Claude only** — `useAgentTeams` is ignored (and returns an error) for `codex` and `gemini` providers
- **Experimental** — Agent Teams is an experimental Anthropic feature with known limitations around session resumption and shutdown
- **Higher token usage** — Each teammate is a separate Claude instance with its own context window
- **Requires Claude Code** — This uses Claude Code's CLI, not the API directly

## How it works

The `AgentOrchestrator` in `src/utils/agentOrchestrator.ts`:

1. Creates a `CollaborationSpace` for the session
2. Generates agent assignments based on strategy
3. Spawns CLI processes with a concurrency limiter (no external dependency)
4. Collects results and synthesizes a summary
5. Stores the session for later status queries

See [ARCHITECTURE.md](../ARCHITECTURE.md) for the full flow diagram.
