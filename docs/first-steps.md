# First Steps

Once installed, here's how to hit the ground running with **CCG MCP Tool**.

## 1. Test Connection

Verify your setup by pinging the server:
```
/ccg-tool:ping message:"Hello from CCG!"
```

## 2. Your First Analysis

Analyze a file using your default provider:
```
/ccg-tool:ask-ai prompt:"@README.md summarize this"
```

## 3. Switch Providers

Try a different giant for a quick refactor:
```
/ccg-tool:ask-ai prompt:"@src/index.ts refactor for clarity" provider:codex
```

## 4. Run a Mitigation Gate

Prevent common AI mistakes early:
```
/ccg-tool:mitigate-mistakes skill:requirements-grounding prompt:"Add a login page"
```

## 5. Natural Language

Don't worry about the commands—just talk to your giants:
- "Use **gemini** to explain this codebase"
- "Ask **codex** to refactor @auth.js"
- "Have **claude** review this complex logic"

## Next Steps

- Learn about [@file syntax](/concepts/file-analysis)
- Explore [Provider & Model selection](/concepts/models)
- Apply [Mistake Mitigation](/usage/best-practices#mistake-mitigation-critical)
