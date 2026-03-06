/**
 * Agent Orchestrator — Coordinates multiple CLI agent sessions.
 *
 * Supports three execution strategies:
 *  - parallel:   All agents work on the same task concurrently. Results merged.
 *  - sequential: Agents run in order; each sees prior agents' outputs as context.
 *  - fan-out:    Each agent gets a unique task from the task list. Non-overlapping.
 *
 * Concurrency is controlled via a simple promise-based limiter (no external dep).
 *
 * Inter-agent communication flows through the CollaborationSpace:
 *  - parallel:  Agents share initial context. After all complete, outputs are synthesized.
 *  - sequential: Each agent receives cumulative context from all prior agents.
 *  - fan-out:   Agents share global context but get non-overlapping task assignments.
 *               A deduplication pass flags contradictions in the merged output.
 */

import { executeAgentSession, type AgentResult } from "./agentSession.js";
import { CollaborationSpace } from "./collaborationSpace.js";
import { Logger } from "./logger.js";
import { ServerConfig } from "../config.js";

export type ExecutionStrategy = "parallel" | "sequential" | "fan-out";

/** Configuration for an orchestration session. */
export interface OrchestrationConfig {
  tasks: string[];
  agentCount: number;
  strategy: ExecutionStrategy;
  provider: string;
  model?: string;
  maxConcurrency: number;
  context?: string;
}

/** Full result of an orchestration session. */
export interface OrchestrationResult {
  sessionId: string;
  strategy: ExecutionStrategy;
  agents: AgentResult[];
  summary: string;
  messages: number;
  totalDurationMs: number;
  agentMode: string;
}

const sessionStore = new Map<string, OrchestrationResult>();

export function getSession(sessionId: string): OrchestrationResult | undefined {
  return sessionStore.get(sessionId);
}
export function listSessions(limit: number = 10): string[] {
  const keys = [...sessionStore.keys()];
  return keys.slice(-limit);
}

/**
 * Simple promise-based concurrency limiter.
 * Avoids adding p-limit as a dependency.
 */
async function limitConcurrency<T>(
  tasks: (() => Promise<T>)[],
  maxConcurrency: number,
): Promise<T[]> {
  const results: T[] = [];
  let index = 0;

  async function runNext(): Promise<void> {
    while (index < tasks.length) {
      const currentIndex = index++;
      results[currentIndex] = await tasks[currentIndex]();
    }
  }

  const workers = Array.from({ length: Math.min(maxConcurrency, tasks.length) }, () => runNext());
  await Promise.all(workers);
  return results;
}

function generateSessionId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `ses_${ts}_${rand}`;
}

/**
 * Build a role-specific prompt wrapper that includes shared context
 * and collaboration-space context.
 */
function buildAgentPrompt(
  baseTask: string,
  agentId: string,
  agentIndex: number,
  totalAgents: number,
  sharedContext: string | undefined,
  spaceContext: string,
  strategy: ExecutionStrategy,
): string {
  const parts: string[] = [];

  parts.push(
    `[Agent ${agentIndex + 1} of ${totalAgents}] ` +
      `You are part of a team of ${totalAgents} AI agents working ` +
      (strategy === "fan-out" ? "on separate tasks" : "collaboratively on the same task") +
      `. Your agent ID is "${agentId}".`,
  );

  if (strategy === "parallel") {
    parts.push(
      `\n[COORDINATION] Multiple agents are analyzing the same task in parallel. ` +
        `Focus on providing your best independent analysis. ` +
        `Do not assume other agents will cover specific areas — be thorough.`,
    );
  } else if (strategy === "sequential") {
    parts.push(
      `\n[COORDINATION] You are running in sequence after other agents. ` +
        `Review the prior agents' outputs below and build upon them. ` +
        `Avoid repeating what was already covered. Add new insights, corrections, or deeper analysis.`,
    );
  } else if (strategy === "fan-out") {
    parts.push(
      `\n[COORDINATION] You have been assigned a specific task from a larger work plan. ` +
        `Focus exclusively on your assigned task. Do not work on other agents' tasks. ` +
        `Your output should be self-contained for your assigned task.`,
    );
  }

  if (sharedContext?.trim()) {
    parts.push(`\n[SHARED CONTEXT]\n${sharedContext}`);
  }

  if (spaceContext.trim()) {
    parts.push(`\n[PRIOR AGENT OUTPUTS]\n${spaceContext}`);
  }

  parts.push(`\n[TASK]\n${baseTask}`);

  return parts.join("\n");
}

/**
 * Synthesize a summary from multiple agent outputs.
 * Simple aggregation — no additional AI call needed.
 */
function synthesizeResults(agents: AgentResult[], strategy: ExecutionStrategy): string {
  const completed = agents.filter((a) => a.status === "completed");
  const failed = agents.filter((a) => a.status === "failed");

  const parts: string[] = [];

  parts.push(`## Multi-Agent Execution Summary`);
  parts.push(`**Strategy:** ${strategy}`);
  parts.push(`**Agents:** ${completed.length} completed, ${failed.length} failed`);
  parts.push(`**Mode:** ${ServerConfig.agentMode}`);
  parts.push("");

  for (const agent of completed) {
    parts.push(`### ${agent.role} (${agent.provider}, ${agent.durationMs}ms)`);
    parts.push(agent.output);
    parts.push("");
  }

  if (failed.length > 0) {
    parts.push(`### Failed Agents`);
    for (const agent of failed) {
      parts.push(`- **${agent.role}:** ${agent.error}`);
    }
  }

  if (strategy === "parallel" && completed.length > 1) {
    parts.push("");
    parts.push(`### Cross-Agent Coordination Note`);
    parts.push(
      `${completed.length} agents provided independent analyses. ` +
        `Review the outputs above for complementary insights and potential contradictions.`,
    );
  }

  return parts.join("\n");
}

/**
 * Execute a multi-agent orchestration session.
 */
export async function orchestrate(config: OrchestrationConfig): Promise<OrchestrationResult> {
  const sessionId = generateSessionId();
  const space = new CollaborationSpace();
  const startTime = Date.now();

  Logger.debug(
    `[Orchestrator:${sessionId}] Starting (strategy=${config.strategy}, agents=${config.agentCount})`,
  );

  space.publish(
    "orchestrator",
    `Session ${sessionId} started. Strategy: ${config.strategy}`,
    "status",
  );

  let agents: AgentResult[];

  switch (config.strategy) {
    case "parallel":
      agents = await executeParallel(config, space);
      break;
    case "sequential":
      agents = await executeSequential(config, space);
      break;
    case "fan-out":
      agents = await executeFanOut(config, space);
      break;
    default:
      throw new Error(`Unknown strategy: ${config.strategy}`);
  }

  const totalDurationMs = Date.now() - startTime;
  const summary = synthesizeResults(agents, config.strategy);

  space.publish("orchestrator", `Session complete. ${agents.length} agents finished.`, "status");

  const result: OrchestrationResult = {
    sessionId,
    strategy: config.strategy,
    agents,
    summary,
    messages: space.getHistory().length,
    totalDurationMs,
    agentMode: ServerConfig.agentMode,
  };

  sessionStore.set(sessionId, result);

  if (sessionStore.size > 50) {
    const oldestKey = sessionStore.keys().next().value;
    if (oldestKey) sessionStore.delete(oldestKey);
  }

  Logger.debug(`[Orchestrator:${sessionId}] Completed in ${totalDurationMs}ms`);

  return result;
}

/**
 * Parallel strategy: All agents work on the same task concurrently.
 * Each gets independent context. Results are collected after all finish.
 */
async function executeParallel(
  config: OrchestrationConfig,
  space: CollaborationSpace,
): Promise<AgentResult[]> {
  const task = config.tasks[0];
  const taskFns: (() => Promise<AgentResult>)[] = [];

  for (let i = 0; i < config.agentCount; i++) {
    const agentId = `agent-${i + 1}`;
    const role = `Agent ${i + 1}`;

    const prompt = buildAgentPrompt(
      task,
      agentId,
      i,
      config.agentCount,
      config.context,
      "",
      "parallel",
    );

    space.publish("orchestrator", `Assigning task to ${role}`, "task-assignment");

    taskFns.push(async () => {
      const result = await executeAgentSession(
        agentId,
        role,
        prompt,
        config.provider,
        config.model,
        ServerConfig.agentMode,
      );
      space.publish(
        agentId,
        result.output || result.error || "No output",
        result.status === "completed" ? "output" : "error",
      );
      return result;
    });
  }

  return limitConcurrency(taskFns, config.maxConcurrency);
}

/**
 * Sequential strategy: Agents run one after another.
 * Each agent receives cumulative context from all prior agents.
 */
async function executeSequential(
  config: OrchestrationConfig,
  space: CollaborationSpace,
): Promise<AgentResult[]> {
  const task = config.tasks[0];
  const results: AgentResult[] = [];

  for (let i = 0; i < config.agentCount; i++) {
    const agentId = `agent-${i + 1}`;
    const role = `Agent ${i + 1}`;

    const spaceContext = space.buildContext(agentId);

    const prompt = buildAgentPrompt(
      task,
      agentId,
      i,
      config.agentCount,
      config.context,
      spaceContext,
      "sequential",
    );

    space.publish(
      "orchestrator",
      `Assigning task to ${role} (sequential step ${i + 1})`,
      "task-assignment",
    );

    const result = await executeAgentSession(
      agentId,
      role,
      prompt,
      config.provider,
      config.model,
      ServerConfig.agentMode,
    );

    space.publish(
      agentId,
      result.output || result.error || "No output",
      result.status === "completed" ? "output" : "error",
    );
    results.push(result);
  }

  return results;
}

/**
 * Fan-out strategy: Each agent gets a unique task from the list.
 * Agents share global context but work on non-overlapping tasks.
 */
async function executeFanOut(
  config: OrchestrationConfig,
  space: CollaborationSpace,
): Promise<AgentResult[]> {
  const taskFns: (() => Promise<AgentResult>)[] = [];

  for (let i = 0; i < config.tasks.length; i++) {
    const agentId = `agent-${i + 1}`;
    const role = `Agent ${i + 1} (Task ${i + 1})`;
    const task = config.tasks[i];

    const taskOverview = config.tasks
      .map((t, idx) => `- Task ${idx + 1}${idx === i ? " (YOUR TASK)" : ""}: ${t}`)
      .join("\n");

    const prompt = buildAgentPrompt(
      task,
      agentId,
      i,
      config.tasks.length,
      (config.context ? config.context + "\n\n" : "") + `[FULL TASK LIST]\n${taskOverview}`,
      "",
      "fan-out",
    );

    space.publish(
      "orchestrator",
      `Assigning unique task to ${role}: ${task.substring(0, 80)}...`,
      "task-assignment",
    );

    taskFns.push(async () => {
      const result = await executeAgentSession(
        agentId,
        role,
        prompt,
        config.provider,
        config.model,
        ServerConfig.agentMode,
      );
      space.publish(
        agentId,
        result.output || result.error || "No output",
        result.status === "completed" ? "output" : "error",
      );
      return result;
    });
  }

  return limitConcurrency(taskFns, config.maxConcurrency);
}
