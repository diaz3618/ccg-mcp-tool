import { PROVIDERS } from "./constants.js";

export type AgentMode = "read-only" | "write";

export const ServerConfig = {
  defaultProvider: PROVIDERS.GEMINI as string,
  defaultModel: undefined as string | undefined,
  agentMode: "read-only" as AgentMode,
};

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--provider" && i + 1 < args.length) {
    ServerConfig.defaultProvider = args[i + 1].toLowerCase();
    i++;
  } else if ((args[i] === "--model" || args[i] === "-m") && i + 1 < args.length) {
    ServerConfig.defaultModel = args[i + 1];
    i++;
  } else if (args[i] === "--agent-mode" && i + 1 < args.length) {
    const mode = args[i + 1].toLowerCase();
    if (mode === "read-only" || mode === "write") {
      ServerConfig.agentMode = mode;
    }
    i++;
  }
}
