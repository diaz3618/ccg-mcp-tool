// Tool Registry Index - Registers all tools
import { toolRegistry } from "./registry.js";
import { askAiTool } from "./ask-ai.tool.js";
import { pingTool, helpTool } from "./simple-tools.js";
import { brainstormTool } from "./brainstorm.tool.js";
import { fetchChunkTool } from "./fetch-chunk.tool.js";
import { timeoutTestTool } from "./timeout-test.tool.js";
import { analyzerTool, coordinatorTool } from "./analyzer.tool.js";

toolRegistry.push(
  askAiTool,
  pingTool,
  helpTool,
  brainstormTool,
  fetchChunkTool,
  timeoutTestTool,
  analyzerTool,
  coordinatorTool,
);

export * from "./registry.js";
