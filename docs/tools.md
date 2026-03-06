# Tools Reference

CCG MCP Tool exposes 10 tools over [MCP](https://modelcontextprotocol.io/) STDIO transport.

---

## ask-ai

Universal AI analysis across providers. Use `@` syntax to reference files.

```
/ccg-tool:ask-ai prompt:"@src/index.ts explain this" provider:codex
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `prompt` | Yes | — | Your request. Use `@file` to include files |
| `provider` | No | Server default | `gemini`, `codex`, or `claude` |
| `model` | No | Provider default | Model override (e.g. `gemini-2.5-flash`, `sonnet`) |
| `sandbox` | No | `false` | Gemini only — run in isolated sandbox |
| `changeMode` | No | `false` | Gemini only — structured edit output |
| `chunkIndex` | No | — | Chunk to return (1-based) |
| `chunkCacheKey` | No | — | Cache key for continuation |

---

## brainstorm

Structured ideation using multiple methodologies.

```
/ccg-tool:brainstorm prompt:"feature ideas for auth module" methodology:scamper
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `prompt` | Yes | — | Topic to brainstorm |
| `methodology` | No | `auto` | `divergent`, `convergent`, `scamper`, `lateral`, `design-thinking`, `auto` |
| `domain` | No | — | Context domain (e.g. `software`, `security`) |
| `constraints` | No | — | Boundaries for ideation |
| `existingContext` | No | — | Background context |
| `ideaCount` | No | 5 | Number of ideas to generate |
| `includeAnalysis` | No | `false` | Add feasibility/impact/innovation scoring |
| `provider` | No | Server default | Which AI to use |

---

## mitigate-mistakes

Apply a research-grounded skill gate to detect common AI coding agent failures. Based on academic research and professional engineering standards.

```
/ccg-tool:mitigate-mistakes skill:requirements-grounding prompt:"@feature-spec.md"
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `skill` | Yes | — | Gate to apply (see below) |
| `prompt` | Yes | — | Task description or `@file` to analyze |
| `provider` | No | Server default | Which AI to use |
| `model` | No | Provider default | Model override |

**Available skills:**

| Skill | Purpose |
|-------|---------|
| `requirements-grounding` | Prevent requirement-conflicting hallucinations |
| `context-scope-discipline` | Maintain focus on the requested change set |
| `dependency-verification` | Verify imports, packages, and versions |
| `design-doc-and-architecture-gate` | Ensure structural and interface integrity |
| `test-and-error-path-gate` | Validate edge cases and failure modes |
| `secure-coding-and-validation-gate` | Identify security risks |
| `code-review-and-change-gate` | Final gate before applying changes |
| `code-quality-enforcer` | Check maintainability and patterns |
| `deterministic-validation-gate` | Evidence-based (not model-judgment) checks |

---

## coordinate-review

Coordinated multi-gate review. Auto-selects the minimum set of skill gates for a given task type and runs them in a single pass. Produces gate-by-gate findings and a merge recommendation.

```
/ccg-tool:coordinate-review prompt:"@src/auth.ts" task_type:feature
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `prompt` | Yes | — | Code or task to review |
| `task_type` | Yes | — | `feature`, `bugfix`, `refactor`, or `dependency-update` |
| `provider` | No | Server default | Which AI to use |
| `model` | No | Provider default | Model override |

**Gate routing by task type:**

| Type | Gates applied |
|------|---------------|
| `feature` | 8 gates (all except dependency-verification) |
| `bugfix` | 7 gates |
| `refactor` | 7 gates |
| `dependency-update` | 7 gates (includes dependency-verification) |

---

## deploy-agents

Deploy multiple AI agents to work on tasks collaboratively or independently. Agents communicate via a shared context space.

```
/ccg-tool:deploy-agents tasks:["refactor auth","add tests"] strategy:fan-out
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `tasks` | Yes | — | Array of task descriptions |
| `agentCount` | No | `3` | Number of agents (2–10). Ignored in fan-out mode |
| `strategy` | No | `parallel` | `parallel`, `sequential`, or `fan-out` |
| `provider` | No | Server default | `claude`, `codex`, or `gemini` |
| `model` | No | Provider default | Model override |
| `maxConcurrency` | No | `3` | Max parallel processes (1–10) |
| `context` | No | — | Shared context injected into every agent prompt |

**Strategies:**

| Strategy | Behavior |
|----------|----------|
| `parallel` | N agents work on 1 task concurrently — diverse perspectives |
| `sequential` | Agents chain — each sees prior outputs via CollaborationSpace |
| `fan-out` | 1 agent per task — divide and conquer |

---

## agent-status

Check status of multi-agent orchestration sessions.

```
/ccg-tool:agent-status
/ccg-tool:agent-status sessionId:"ses_abc123"
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `sessionId` | No | — | Query a specific session. Omit to list recent sessions |

---

## fetch-chunk

Retrieve a specific chunk from a previous large response (used with `changeMode`).

```
/ccg-tool:fetch-chunk cacheKey:"abc123" chunkIndex:2
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `cacheKey` | Yes | Hex cache key from a changeMode response |
| `chunkIndex` | Yes | Chunk index to retrieve (1-based) |

---

## ping

Test server connectivity.

```
/ccg-tool:ping message:"hello"
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `prompt` | No | Message to echo back |

---

## Help

Display help information for the configured AI provider CLI.

```
/ccg-tool:Help
```

No parameters.

---

## timeout-test

Developer utility for testing timeout behavior.

```
/ccg-tool:timeout-test duration:5000
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `duration` | Yes | Duration in milliseconds (minimum 10ms) |
