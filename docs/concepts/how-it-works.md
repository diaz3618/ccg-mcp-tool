# How It Works

## Natural Language Workflow Integration

The **CCG MCP Tool** is designed to seamlessly integrate into your natural workflow with your preferred MCP-compliant AI clients, achieved through carefully crafted tools and pipelines.

Claude automatically decides when to use `ask-ai` (or `ask-gemini`) based on context:

- comparative analysis - different AI perspectives (Gemini, Codex, Claude) for validation
- leveraging extra tools - Multi-provider search and reasoning functions
- code review & big changes - second opinions on implementation with research-grounded gates
- creative problem solving - brainstorming and ideation across different AI frameworks

This intelligent selection enhances your workflow exactly when the selected AI's capabilities add value.

<div align="center">When ask-ai gets called:</div>
<DiagramModal>

```mermaid
---
config:
  flowchart:
    htmlLabels: false
    curve: cardinal
---
flowchart LR
    subgraph main
        direction TB
        A[You] --> |"ask ai..."| B([**Claude**])
        B -..-> |"invokes 'ask-ai'"| C["CCG-MCP-Tool"]
        C --> |"spawn!"| D[AI-CLI]
        D e1@-.-> |"response"| C
        C -.-> |"response"| B
        B -.-> |"summary response"| A
        e1@{ animate: true }
    end
    subgraph Project
        B --> |"edits"| E["`**@*Files***`"]
        D -.-> |"reads"| E
    end
    classDef userNode fill:#1a237e,stroke:#fff,color:#fff,stroke-width:2px
    classDef claudeNode fill:#e64100,stroke:#fff,color:#fff,stroke-width:2px
    classDef geminiNode fill:#4285f4,stroke:#fff,color:#fff,stroke-width:2px
    classDef mcpNode fill:#37474f,stroke:#fff,color:#fff,stroke-width:2px
    classDef dataNode fill:#1b5e20,stroke:#fff,color:#fff,stroke-width:2px
    class A userNode
    class B claudeNode
    class C mcpNode
    class D geminiNode
    class E dataNode
```
</DiagramModal>
