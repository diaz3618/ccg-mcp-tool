export const LOG_PREFIX = "[CCG]";

export const ERROR_MESSAGES = {
  QUOTA_EXCEEDED: "Quota exceeded for quota metric 'Gemini 2.5 Pro Requests'",
  QUOTA_EXCEEDED_SHORT:
    "⚠️ Gemini 2.5 Pro daily quota exceeded. Please retry with model: 'gemini-2.5-flash'",
  TOOL_NOT_FOUND: "not found in registry",
  NO_PROMPT_PROVIDED:
    "Please provide a prompt for analysis. Use @ syntax to include files (e.g., '@largefile.js explain what this does') or ask general questions",
} as const;

export const STATUS_MESSAGES = {
  QUOTA_SWITCHING: "🚫 Gemini 2.5 Pro quota exceeded, switching to Flash model...",
  FLASH_RETRY: "⚡ Retrying with Gemini 2.5 Flash...",
  FLASH_SUCCESS: "✅ Flash model completed successfully",
  SANDBOX_EXECUTING: "🔒 Executing CLI command in sandbox mode...",
  GEMINI_RESPONSE: "Gemini response:",
  PROCESSING_START: "🔍 Starting analysis (may take 5-15 minutes for large codebases)",
  PROCESSING_CONTINUE: "⏳ Still processing... AI is working on your request",
  PROCESSING_COMPLETE: "✅ Analysis completed successfully",
} as const;

export const MODELS = {
  PRO: "gemini-2.5-pro",
  FLASH: "gemini-2.5-flash",
  CODEX: "gpt-5.3-codex",
  CLAUDE: "sonnet",
} as const;

export const PROVIDERS = {
  GEMINI: "gemini",
  CODEX: "codex",
  CLAUDE: "claude",
} as const;

export const PROTOCOL = {
  ROLES: {
    USER: "user",
    ASSISTANT: "assistant",
  },
  CONTENT_TYPES: {
    TEXT: "text",
  },
  STATUS: {
    SUCCESS: "success",
    ERROR: "error",
    FAILED: "failed",
    REPORT: "report",
  },
  NOTIFICATIONS: {
    PROGRESS: "notifications/progress",
  },
  KEEPALIVE_INTERVAL: 25000, // 25 seconds
} as const;

export const AGENT_TEAMS = {
  ENV_VAR: "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS",
} as const;

export const CLI = {
  COMMANDS: {
    GEMINI: "gemini",
    CODEX: "codex",
    CLAUDE: "claude",
    ECHO: "echo",
  },
  FLAGS: {
    MODEL: "-m",
    SANDBOX: "-s",
    PROMPT: "-p",
    HELP: "--help",
    PROVIDER: "--provider",
  },
  DEFAULTS: {
    MODEL: "default",
    BOOLEAN_TRUE: "true",
    BOOLEAN_FALSE: "false",
    PROVIDER: PROVIDERS.GEMINI,
  },
} as const;

export interface ToolArguments {
  prompt?: string;
  provider?: string;
  model?: string;
  sandbox?: boolean | string;
  changeMode?: boolean | string;
  chunkIndex?: number | string;
  chunkCacheKey?: string;

  message?: string;

  skill?: string;
  methodology?: string;
  domain?: string;
  constraints?: string;
  existingContext?: string;
  ideaCount?: number;
  includeAnalysis?: boolean;

  tasks?: string[];
  agentCount?: number;
  strategy?: string;
  maxConcurrency?: number;
  context?: string;
  useAgentTeams?: boolean;
  sessionId?: string;
  task_type?: string;

  [key: string]: string | boolean | number | string[] | undefined;
}
