# Roadmap

<div style="text-align: center;">

## Evolution

</div>

<DiagramModal>

```mermaid
---
config:
  flowchart:
    htmlLabels: false
    curve: cardinal
---
flowchart LR
    A["v1.1.1
    Basic Integration"] --> B["v1.1.2
    Auto-Fallback"]
    B --> C["v1.1.3
    Claude Edits, Gemini Reads"]
    C --> D["v1.2.0
    The Giants United (CCG)"]
    
    classDef releasedNode fill:#1b5e20,stroke:#fff,color:#fff,stroke-width:2px
    classDef currentNode fill:#e64100,stroke:#fff,color:#fff,stroke-width:2px
    
    class A,B,C releasedNode
    class D currentNode
```
</DiagramModal>

<div style="text-align: center;">

## Timeline

</div>

<DiagramModal>

```mermaid
---
config:
  timeline:
    htmlLabels: false
  theme: dark
---
timeline
    title CCG MCP Tool Evolution
    
    section 2025
        v1.1.0 Release : Claude uses Gemini!
                       : Sandbox Mode Testing
        
        v1.1.2 Release : Fallback System
                       : Bug Fixes
                       
        v1.1.3 Release : Claude Edits, Gemini Reads!
                       : Parsing & Chunking
                       
    section 2026
        v1.2.0 Release : **Claude Code / Codex / Gemini**
                       : Multi-Provider Support
                       : Startup Configuration (args)
                       : Research-Grounded Mitigation Gates
```
</DiagramModal>
