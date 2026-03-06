/**
 * Agent Session — Wraps a single CLI agent invocation with lifecycle management.
 *
 * Each agent is a child_process.spawn call to one of the supported CLIs
 * (claude, codex, gemini). Sessions track status, duration, and output.
 */

import { executeCommand } from "./commandExecutor.js";
import { Logger } from "./logger.js";
import { CLI, PROVIDERS } from "../constants.js";
import { ServerConfig, type AgentMode } from "../config.js";

/** Possible states of an agent session. */
export type AgentStatus = "pending" | "running" | "completed" | "failed";

export interface AgentResult {
  readonly agentId: string;
  readonly role: string;
  readonly output: string;
  readonly status: AgentStatus;
  readonly durationMs: number;
  readonly error?: string;
  readonly provider: string;
}

/**
 * Build CLI arguments for a single agent invocation.
 *
 * When agentMode is "read-only", per-provider safety flags are applied:
 *  - Claude: --permission-mode plan (native read-only enforcement)
 *  - Codex: --sandbox read-only (native sandbox enforcement)
 *  - Gemini: --approval-mode plan (native read-only enforcement)
 *
 * When agentMode is "write":
 *  - Claude: --permission-mode default, --allowedTools "Edit,Write,Bash"
 *  - Codex: normal execution
 *  - Gemini: sandbox flag allowed
 */
function buildAgentArgs(
  prompt: string,
  provider: string,
  model: string | undefined,
  agentMode: AgentMode,
): { command: string; args: string[] } {
  const args: string[] = [];
  let command: string;
  const finalPrompt = prompt;

  if (provider === PROVIDERS.CODEX) {
    command = CLI.COMMANDS.CODEX;
    args.push("exec");
    if (agentMode === "read-only") {
      args.push("--sandbox", "read-only");
    }
    if (model) {
      args.push(CLI.FLAGS.MODEL, model);
    }
    args.push(finalPrompt);
  } else if (provider === PROVIDERS.CLAUDE) {
    command = CLI.COMMANDS.CLAUDE;
    args.push("-p");
    if (agentMode === "read-only") {
      args.push("--permission-mode", "plan");
    }
    if (model) {
      args.push("--model", model);
    }
    args.push(finalPrompt);
  } else {
    // Default: Gemini
    command = CLI.COMMANDS.GEMINI;
    if (agentMode === "read-only") {
      args.push("--approval-mode", "plan");
    }
    if (model) {
      args.push(CLI.FLAGS.MODEL, model);
    }
    args.push(CLI.FLAGS.PROMPT, finalPrompt);
  }

  return { command, args };
}

/**
 * Execute a single agent session and return the result.
 *
 * @param agentId    Unique identifier for this agent within the session.
 * @param role       Human-readable role label (e.g., "agent-1", "reviewer").
 * @param prompt     The prompt to send to the CLI.
 * @param provider   CLI provider ("claude", "codex", "gemini").
 * @param model      Optional model override.
 * @param agentMode  "read-only" or "write" — determines safety flags.
 * @param onProgress Optional callback for streaming progress.
 */
export async function executeAgentSession(
  agentId: string,
  role: string,
  prompt: string,
  provider: string = ServerConfig.defaultProvider,
  model?: string,
  agentMode: AgentMode = ServerConfig.agentMode,
  onProgress?: (output: string) => void,
): Promise<AgentResult> {
  const startTime = Date.now();

  Logger.debug(`[Agent:${agentId}] Starting (provider=${provider}, mode=${agentMode})`);

  const { command, args } = buildAgentArgs(prompt, provider, model, agentMode);

  try {
    const output = await executeCommand(command, args, onProgress);
    const durationMs = Date.now() - startTime;

    Logger.debug(`[Agent:${agentId}] Completed in ${durationMs}ms`);

    return {
      agentId,
      role,
      output,
      status: "completed",
      durationMs,
      provider,
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    Logger.error(`[Agent:${agentId}] Failed after ${durationMs}ms: ${errorMessage}`);

    return {
      agentId,
      role,
      output: "",
      status: "failed",
      durationMs,
      error: errorMessage,
      provider,
    };
  }
}
