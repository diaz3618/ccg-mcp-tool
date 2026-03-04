import { PROVIDERS } from './constants.js';

export const ServerConfig = {
  defaultProvider: PROVIDERS.GEMINI as string,
  defaultModel: undefined as string | undefined,
};

// Parse command-line arguments passed to the MCP server
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--provider' && i + 1 < args.length) {
    ServerConfig.defaultProvider = args[i + 1].toLowerCase();
    i++;
  } else if ((args[i] === '--model' || args[i] === '-m') && i + 1 < args.length) {
    ServerConfig.defaultModel = args[i + 1];
    i++;
  }
}
