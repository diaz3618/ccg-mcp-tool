# Natural Language Usage

You don't need to memorize complex commands—just ask naturally!

## How It Works

Modern MCP-compliant clients (like Claude Code) understand your intent and automatically route requests to the **CCG MCP Tool** when you mention one of your giants.

## Examples

### File Analysis
Instead of: `/ccg-tool:ask-ai prompt:"@app.js explain"`

Say:
- "Use **gemini** to explain @app.js"
- "Ask **codex** what @this_code.py does"
- "Have **claude** analyze the main application file"

### Code Generation
Instead of: `/ccg-tool:ask-ai prompt:"create a web server" sandbox:true`

Say:
- "Get **gemini** to create a simple web server in sandbox"
- "I need **codex** to write a REST API example"
- "Can **claude** show me how to build an Express server?"

### Debugging & Mitigation
Say:
- "Help me debug this error using **claude**"
- "Mitigate mistakes for @new-feature.md using requirements-grounding"
- "Run a secure coding gate on @api.js"

## Keywords That Trigger Tools

The tool responds to natural mentions of:
- "**gemini**..."
- "**codex**..."
- "**claude**..." (when used as a tool provider)
- "**mitigate mistakes**..."
- "**brainstorm**..."

## Best Practices

### 1. Be Conversational
```
# Generic
"Hey, can gemini check if my config.json is valid?"

# Specific
"Ask codex to refactor @auth.ts for better performance"
```

### 2. Provide Context
```
"Gemini, I'm getting a null pointer error in my auth handler, can you help?"
```

### 3. Specify Files Naturally
```
"How do utils.js and helpers.js work together? Ask gemini."
```

## Common Patterns

### Code Review
- "Gemini, review my latest changes"
- "Use codex to check my pull request for logic errors"
- "Run a code quality enforcer gate on @src/"

### Learning
- "Gemini, explain how React hooks work"
- "Can codex show me Python best practices?"

### Refactoring
- "Gemini, how can I make this code cleaner?"
- "Use codex to refactor this function"
- "Help me optimize this algorithm with claude"

## Mixing Commands and Natural Language

You can combine both approaches:

```
"I need to debug this" → /ccg-tool:ask-ai prompt:"@app.js @error.log"
```

Your client understands the context and uses the appropriate tool automatically.

## Tips

1. **Just Ask**: Don't overthink the syntax.
2. **Specify Your Provider**: Mention "gemini", "codex", or "claude" to steer the request.
3. **Iterate**: Have a conversation with follow-up questions.
4. **No Memorization**: Use whatever feels natural.

Remember: The goal is to make AI assistance feel like a collaborative partnership!
