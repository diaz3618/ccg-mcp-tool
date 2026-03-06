/**
 * deploy-agents tool — MCP tool for multi-agent deployment.
 *
 * Supports three strategies:
 *  - parallel:   Multiple agents work on the same task concurrently.
 *  - sequential: Agents process in order, each building on prior outputs.
 *  - fan-out:    Each agent gets a separate task from the list.
 *
 * The number of agents is determined by:
 *  - parallel/sequential: `agentCount` parameter (default 3).
 *  - fan-out: length of the `tasks` array (one agent per task).
 *
 * Agent mode (read-only/write) is enforced by the server --agent-mode arg.
 */

import { z } from "zod";
import { UnifiedTool } from "./registry.js";
import { ServerConfig } from "../config.js";
import { orchestrate, type ExecutionStrategy } from "../utils/agentOrchestrator.js";

const deployAgentsSchema = z.object({
  tasks: z
    .array(z.string().min(1))
    .min(1)
    .describe(
      "Array of task descriptions. Single task = collaborative (parallel/sequential). " +
        "Multiple tasks = fan-out (one agent per task).",
    ),
  agentCount: z
    .number()
    .int()
    .min(2)
    .max(10)
    .default(3)
    .describe(
      "Number of agents to deploy for parallel/sequential strategies (2-10). " +
        "Ignored in fan-out mode where agent count = number of tasks.",
    ),
  strategy: z
    .enum(["parallel", "sequential", "fan-out"])
    .default("parallel")
    .describe(
      "Execution strategy: " +
        "'parallel' = all agents work on 1 task concurrently, " +
        "'sequential' = agents chain, each sees prior outputs, " +
        "'fan-out' = each agent gets a separate task.",
    ),
  provider: z
    .string()
    .optional()
    .default(ServerConfig.defaultProvider)
    .describe(
      `CLI provider to use ('claude', 'codex', 'gemini'). Defaults to '${ServerConfig.defaultProvider}'.`,
    ),
  model: z.string().optional().describe("Optional model override. Defaults to server config."),
  maxConcurrency: z
    .number()
    .int()
    .min(1)
    .max(10)
    .default(3)
    .describe("Max parallel agent processes (1-10, default 3). Controls resource usage."),
  context: z
    .string()
    .optional()
    .describe(
      "Shared context injected into every agent's prompt. " +
        "Use for project background, constraints, or coordination instructions.",
    ),
  useAgentTeams: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "Enable Claude Code Agent Teams (Claude provider only). " +
        "Delegates team coordination to Claude Code's native Agent Teams feature. " +
        "Requires CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS enabled in Claude Code settings. " +
        "See: https://code.claude.com/docs/en/agent-teams",
    ),
});

export const deployAgentsTool: UnifiedTool = {
  name: "deploy-agents",
  description:
    "Deploy multiple AI agents to work on tasks collaboratively or independently. " +
    "Strategies: 'parallel' (N agents on 1 task), 'sequential' (chained, each sees prior output), " +
    "'fan-out' (1 agent per task). Agents communicate via shared context to avoid conflicts and redundancy. " +
    `Current agent mode: ${ServerConfig.agentMode}.`,
  zodSchema: deployAgentsSchema,
  prompt: {
    description:
      "Deploy multiple AI agents with coordination. " +
      "Supports parallel collaborative analysis, sequential refinement, and fan-out task distribution.",
  },
  category: "utility",
  execute: async (args) => {
    const { tasks, strategy, provider, maxConcurrency, context, useAgentTeams } = args;

    const agentCount = args.agentCount as number;
    const model =
      (args.model as string | undefined) ||
      ((provider as string) === ServerConfig.defaultProvider
        ? ServerConfig.defaultModel
        : undefined);

    // Validate strategy vs tasks
    if ((strategy === "parallel" || strategy === "sequential") && (tasks as string[]).length > 1) {
      return (
        `Error: '${strategy}' strategy expects a single task in the tasks array. ` +
        `Got ${(tasks as string[]).length} tasks. Use 'fan-out' for multiple separate tasks.`
      );
    }
    if (strategy === "fan-out" && (tasks as string[]).length < 2) {
      return (
        `Error: 'fan-out' strategy requires at least 2 tasks. ` +
        `Got ${(tasks as string[]).length}. Use 'parallel' or 'sequential' for a single task.`
      );
    }

    // Validate useAgentTeams — only works with Claude
    if (useAgentTeams && (provider as string) !== "claude") {
      return (
        `Error: 'useAgentTeams' is only supported with the 'claude' provider. ` +
        `Current provider: '${provider as string}'. ` +
        `Either set provider to 'claude' or disable useAgentTeams.`
      );
    }

    const effectiveAgentCount =
      strategy === "fan-out" ? (tasks as string[]).length : (agentCount as number);

    const result = await orchestrate({
      tasks: tasks as string[],
      agentCount: effectiveAgentCount,
      strategy: strategy as ExecutionStrategy,
      provider: provider as string,
      model: model as string | undefined,
      maxConcurrency: maxConcurrency as number,
      context: context as string | undefined,
      useAgentTeams: (useAgentTeams as boolean) || false,
    });

    // Format output
    const header = [
      `**Session:** ${result.sessionId}`,
      `**Strategy:** ${result.strategy}`,
      `**Agents:** ${result.agents.length}`,
      `**Mode:** ${result.agentMode}`,
      `**Duration:** ${result.totalDurationMs}ms`,
      `**Messages:** ${result.messages}`,
    ].join(" | ");

    return `${header}\n\n${result.summary}`;
  },
};
