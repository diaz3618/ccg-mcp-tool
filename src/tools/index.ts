import { toolRegistry } from "./registry.js";
import { askAiTool } from "./ask-ai.tool.js";
import { pingTool, helpTool } from "./simple-tools.js";
import { brainstormTool } from "./brainstorm.tool.js";
import { fetchChunkTool } from "./fetch-chunk.tool.js";
import { timeoutTestTool } from "./timeout-test.tool.js";
import { analyzerTool, coordinatorTool } from "./analyzer.tool.js";
import { deployAgentsTool } from "./deploy-agents.tool.js";
import { agentStatusTool } from "./agent-status.tool.js";

toolRegistry.push(
  askAiTool,
  pingTool,
  helpTool,
  brainstormTool,
  fetchChunkTool,
  timeoutTestTool,
  analyzerTool,
  coordinatorTool,
  deployAgentsTool,
  agentStatusTool,
);

export * from "./registry.js";
