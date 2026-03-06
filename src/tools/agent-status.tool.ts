/**
 * agent-status tool — Check status of completed multi-agent sessions.
 *
 * Can query a specific session by ID or list recent sessions.
 */

import { z } from "zod";
import { UnifiedTool } from "./registry.js";
import { getSession, listSessions } from "../utils/agentOrchestrator.js";
import { ServerConfig } from "../config.js";

const agentStatusSchema = z.object({
  sessionId: z
    .string()
    .optional()
    .describe("Session ID to query (e.g., 'ses_abc123'). " + "Omit to list recent sessions."),
});

export const agentStatusTool: UnifiedTool = {
  name: "agent-status",
  description:
    "Check status of multi-agent orchestration sessions. " +
    "Provide a sessionId to get details, or omit to list recent sessions. " +
    `Current agent mode: ${ServerConfig.agentMode}.`,
  zodSchema: agentStatusSchema,
  category: "utility",
  execute: async (args) => {
    const sessionId = args.sessionId as string | undefined;

    if (sessionId) {
      const session = getSession(sessionId);
      if (!session) {
        return `No session found with ID: ${sessionId}`;
      }

      const agentLines = session.agents.map((a) => {
        const status = a.status === "completed" ? "✅" : "❌";
        const detail =
          a.status === "completed"
            ? `${a.output.substring(0, 200)}${a.output.length > 200 ? "..." : ""}`
            : a.error || "Unknown error";
        return `${status} **${a.role}** (${a.provider}, ${a.durationMs}ms): ${detail}`;
      });

      return [
        `## Session: ${session.sessionId}`,
        `**Strategy:** ${session.strategy}`,
        `**Mode:** ${session.agentMode}`,
        `**Duration:** ${session.totalDurationMs}ms`,
        `**Messages:** ${session.messages}`,
        "",
        "### Agent Results",
        ...agentLines,
      ].join("\n");
    }

    // List recent sessions
    const ids = listSessions(10);
    if (ids.length === 0) {
      return "No multi-agent sessions found. Use the `deploy-agents` tool to start one.";
    }

    const lines = ids.map((id) => {
      const s = getSession(id);
      if (!s) return `- ${id}: (data unavailable)`;
      const completedCount = s.agents.filter((a) => a.status === "completed").length;
      const failedCount = s.agents.filter((a) => a.status === "failed").length;
      return (
        `- **${id}**: ${s.strategy} | ${completedCount} completed, ${failedCount} failed | ` +
        `${s.totalDurationMs}ms | mode=${s.agentMode}`
      );
    });

    return ["## Recent Multi-Agent Sessions", "", ...lines].join("\n");
  },
};
