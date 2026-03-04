import { z } from "zod";
import { UnifiedTool } from "./registry.js";
import { executeAICLI, processChangeModeOutput } from "../utils/aiExecutor.js";
import { ERROR_MESSAGES, STATUS_MESSAGES, PROVIDERS } from "../constants.js";
import { ServerConfig } from "../config.js";

const askAiArgsSchema = z.object({
  prompt: z
    .string()
    .min(1)
    .describe(
      "Analysis request. Use @ syntax to include files (e.g., '@largefile.js explain what this does') or ask general questions",
    ),
  provider: z
    .string()
    .optional()
    .default(ServerConfig.defaultProvider)
    .describe(
      `Provider to use (e.g., 'gemini', 'codex', 'claude'). Defaults to server config ('${ServerConfig.defaultProvider}').`,
    ),
  model: z
    .string()
    .optional()
    .describe(
      `Optional model to use (e.g., 'gemini-2.5-flash', 'gpt-5.3-codex'). If not specified, uses the server default (${ServerConfig.defaultModel || "provider default"}).`,
    ),
  sandbox: z
    .boolean()
    .default(false)
    .describe(
      "Use sandbox mode (-s flag, Gemini only) to safely test code changes, execute scripts, or run potentially risky operations in an isolated environment",
    ),
  changeMode: z
    .boolean()
    .default(false)
    .describe(
      "Enable structured change mode (Gemini only) - formats prompts to prevent tool errors and returns structured edit suggestions that Claude can apply directly",
    ),
  chunkIndex: z
    .union([z.number(), z.string()])
    .optional()
    .describe("Which chunk to return (1-based)"),
  chunkCacheKey: z.string().optional().describe("Optional cache key for continuation"),
});

export const askAiTool: UnifiedTool = {
  name: "ask-ai",
  description:
    "Provider selection [--provider], model selection [-m], sandbox [-s], and changeMode:boolean for providing edits. Supports Gemini, Codex, and Claude Code.",
  zodSchema: askAiArgsSchema,
  prompt: {
    description:
      "Execute AI analysis using Gemini, Codex, or Claude. Supports enhanced change mode for structured edit suggestions (Gemini only).",
  },
  category: "utility",
  execute: async (args, onProgress) => {
    const { prompt, provider, sandbox, changeMode, chunkIndex, chunkCacheKey } = args;
    const model = args.model || ServerConfig.defaultModel;
    if (!prompt?.trim()) {
      throw new Error(ERROR_MESSAGES.NO_PROMPT_PROVIDED);
    }

    if (changeMode && chunkIndex && chunkCacheKey) {
      return processChangeModeOutput(
        "", // empty for cache...
        chunkIndex as number,
        chunkCacheKey as string,
        prompt as string,
      );
    }

    const result = await executeAICLI(
      prompt as string,
      provider as string | undefined,
      model as string | undefined,
      !!sandbox,
      !!changeMode,
      onProgress,
    );

    if (changeMode && provider === PROVIDERS.GEMINI) {
      return processChangeModeOutput(
        result,
        args.chunkIndex as number | undefined,
        undefined,
        prompt as string,
      );
    }

    const responsePrefix =
      provider === PROVIDERS.GEMINI ? STATUS_MESSAGES.GEMINI_RESPONSE : `${provider} response:`;
    return `${responsePrefix}\n${result}`;
  },
};
