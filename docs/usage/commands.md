# Commands Reference

Complete list of available commands and their usage.

## Slash Commands

The default prefix is `/ccg-tool` (configurable in your client).

### `/ccg-tool:ask-ai` (or `/ccg-tool:ask-gemini`)
Analyze files or ask questions about code using various AI providers.

```
/ccg-tool:ask-ai prompt:@file.js explain this code provider:codex
/ccg-tool:ask-ai prompt:@src/*.ts find security issues provider:gemini model:gemini-2.5-flash
/ccg-tool:ask-ai prompt:how do I implement authentication? provider:claude
```

**Arguments:**
- `prompt` (required): Your request. Use `@` for files.
- `provider`: `gemini`, `codex`, or `claude`. Defaults to server startup config.
- `model`: Specific model for the provider.
- `sandbox`: (Gemini only) Run in isolated environment.
- `changeMode`: (Gemini only) Returns structured edits.

### `/ccg-tool:mitigate-mistakes`
Apply research-grounded mitigation gates to your code or task.

```
/ccg-tool:mitigate-mistakes skill:requirements-grounding prompt:@new-feature.md
/ccg-tool:mitigate-mistakes skill:secure-coding-and-validation-gate prompt:@api.js provider:codex
```

**Arguments:**
- `skill`: The gate to apply (e.g., `requirements-grounding`, `secure-coding`, etc.)
- `prompt`: The task or code to analyze.
- `provider`: Which AI to use for assessment.

### `/ccg-tool:brainstorm`
Generate novel ideas with dynamic context gathering.

```
/ccg-tool:brainstorm prompt:New feature for my app methodology:scamper domain:software
/ccg-tool:brainstorm prompt:Marketing strategy domain:marketing provider:claude
```

### `/ccg-tool:sandbox`
Execute code in a safe environment (Gemini only).

```
/ccg-tool:sandbox prompt:create a Python fibonacci generator
```

### `/ccg-tool:help`
Show help information and available tools.

## Natural Language Alternative

Instead of slash commands, you can use natural language:

- "Use gemini to analyze index.js"
- "Ask codex to refactor this @file.ts"
- "Have claude explain this error"
- "Mitigate mistakes for my @code.js using requirements-grounding"

## File Patterns

### Single File
```
@README.md
@src/index.js
```

### Wildcards
```
@*.json           # All JSON files in current directory
@src/*.js         # All JS files in src
@**/*.test.js     # All test files recursively
```

## Tips

1. **Provider Selection**: Use Gemini for large codebase analysis, Codex for precision refactoring, and Claude for complex reasoning.
2. **Mitigation Skills**: Always run `requirements-grounding` before starting a complex task.
3. **Sandbox Mode**: Use sandbox mode when asking AI to run or test generated scripts.
