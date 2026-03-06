import { z } from "zod";
import { UnifiedTool } from "./registry.js";
import { executeCommand } from "../utils/commandExecutor.js";
import { ServerConfig } from "../config.js";
import { CLI } from "../constants.js";

const pingArgsSchema = z.object({
  prompt: z.string().default("").describe("Message to echo "),
});

export const pingTool: UnifiedTool = {
  name: "ping",
  description: "Echo",
  zodSchema: pingArgsSchema,
  prompt: {
    description: "Echo test message with structured response.",
  },
  category: "simple",
  execute: async (args) => {
    const message = args.prompt || args.message || "Pong!";
    return String(message);
  },
};

const helpArgsSchema = z.object({});

export const helpTool: UnifiedTool = {
  name: "Help",
  description: "Display help information for the configured AI provider CLI",
  zodSchema: helpArgsSchema,
  prompt: {
    description: "Display help information for the configured AI provider CLI",
  },
  category: "simple",
  execute: async (_args, onProgress) => {
    const provider = ServerConfig.defaultProvider;
    const command = (CLI.COMMANDS as Record<string, string>)[provider.toUpperCase()] || provider;
    return executeCommand(command, [CLI.FLAGS.HELP], onProgress);
  },
};
