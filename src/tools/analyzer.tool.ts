import { z } from "zod";
import { UnifiedTool } from "./registry.js";
import { executeAICLI } from "../utils/aiExecutor.js";
import { ServerConfig } from "../config.js";

const SKILL_CONTENT: Record<string, string> = {
  "requirements-grounding": `# Skill 01 - Requirements Grounding

## Purpose
Prevent requirement-conflicting hallucinations and low-confidence implementation jumps.

## When to trigger
- The task is underspecified
- The request includes multiple constraints
- The agent is about to implement a feature, refactor, or bugfix
- The codebase context is large or unfamiliar

## Why this exists
Research on LLM-generated code reports that hallucinations frequently conflict with user requirements and reduce functional correctness, readability, maintainability, and efficiency.

## Workflow
1. Restate the task as explicit requirements.
2. Split requirements into: must do / must not do / assumptions / unknowns.
3. Refuse to code against unresolved assumptions unless low-risk and clearly labeled.
4. Define a smallest-correct change set (files affected, interfaces impacted, test impact).
5. Produce an implementation plan before writing code.
6. After code generation, verify each requirement line-by-line against the diff.

## Hard rules
- Never invent requirements.
- Never silently broaden scope.
- Never change unrelated files without justification.
- If confidence is low, stop at the plan and surface the unknowns.

## Exit criteria
- Every requirement maps to a concrete code change or an explicit non-action.
- No hidden assumptions remain.
- Scope is bounded.`,

  "context-scope-discipline": `# Skill 02 - Context and Scope Discipline

## Purpose
Reduce context drift, over-broad changes, and degradation caused by stale or irrelevant conversation history.

## When to trigger
- Long coding sessions or multi-step debugging
- The agent starts mixing old and new tasks
- The user changes goals mid-thread
- Large codebase / multiple parallel subtasks

## Why this exists
Official GitHub guidance recommends keeping history relevant, using new threads for new tasks, and maintaining modular code, comments, and tests. Research shows prompt quality strongly affects code hallucination rates.

## Workflow
1. Identify the active task only.
2. Remove or ignore stale context (prior failed attempts, unrelated modules, older task branches).
3. Rewrite the current task into a single focused objective.
4. Constrain the working set: max 1 feature OR 1 bug OR 1 refactor per pass, max relevant files only.
5. If the task is big, decompose into: analysis / design / implementation / verification.
6. After each pass, summarize: what changed / what remains / what should be deferred.

## Hard rules
- Do not combine multiple loosely related requests into one implementation pass.
- Do not keep reusing bad previous outputs as authoritative context.
- Prefer fresh, task-specific prompts over long polluted history.

## Exit criteria
- One active objective, one bounded scope, clear next step.`,

  "dependency-verification": `# Skill 03 - Dependency Verification

## Purpose
Prevent package hallucinations, fake imports, unnecessary dependencies, and supply-chain risk.

## When to trigger
- The agent proposes adding a package/library/module
- Generated code includes a new import
- Build errors mention missing packages
- The task references "install", "npm", "pip", "cargo", or "package"

## Why this exists
Academic work documents package hallucinations as a persistent, systemic issue in code-generating LLMs, including invented package names and erroneous dependency recommendations.

## Workflow
1. Extract every proposed dependency.
2. For each dependency, verify: it actually exists / the package name is exact / it is maintained and necessary.
3. Prefer standard library or existing project dependencies before adding new ones.
4. Require justification for each new dependency (what problem it solves, why existing code cannot solve it).
5. If unverified: do not emit install commands, replace with pseudocode or a TODO marker.
6. Flag transitive risk: security review needed / license review needed / version pinning needed.

## Required checklist
- Package exists and name/version validated
- Standard-library alternative checked
- License noted, lockfile/update impact noted

## Hard rules
- Never invent package names.
- Never "guess" import paths.
- Never add a dependency just because it is commonly used.
- Never add network-facing or security-sensitive dependencies without explicit justification.

## Exit criteria
- Every new dependency is verified or removed.
- The diff includes no unverified imports.`,

  "design-doc-and-architecture-gate": `# Skill 04 - Design Doc and Architecture Gate

## Purpose
Prevent structurally messy changes, undocumented refactors, and maintainability collapse.

## When to trigger
- New subsystem or service
- Cross-cutting refactor
- Schema / API / auth changes
- Multi-file changes affecting interfaces
- Anything that changes architecture, data flow, or component boundaries

## Why this exists
Professional guidance from Software Engineering at Google stresses that each document should have a singular purpose. NIST SSDF and Microsoft SDL both require security and development practices to be integrated into the SDLC, not bolted on after implementation.

## Workflow
1. Write a short design note before coding: problem / current state / proposed change / alternatives / risks / rollback.
2. Add or update at least one architecture artifact if the change affects structure (data flow, sequence, component diagrams).
3. Define interfaces first: API boundaries / inputs / outputs / failure modes.
4. Check change radius: which modules depend on this / migration requirements / backward compatibility.
5. Only then implement.

## Minimum design-doc template
Title / Scope / Non-goals / Assumptions / Proposed design / Security-failure considerations / Test plan / Rollback plan.

## Hard rules
- No architecture-changing code without a design note.
- No mixing multiple document purposes into one artifact.
- No hidden interface changes.

## Exit criteria
- Design note exists, architecture impact is explicit, failure modes and rollback are documented.`,

  "test-and-error-path-gate": `# Skill 05 - Test and Error Path Gate

## Purpose
Prevent shallow happy-path coding, fragile changes, and undocumented failure behavior.

## When to trigger
- Any non-trivial code change, bug fixes, new endpoints / handlers / jobs
- Refactors that preserve behavior
- Any change touching parsing, IO, auth, state, or concurrency

## Why this exists
Software Engineering at Google states that thorough tests reduce reviewer effort, demonstrate correctness, cover edge cases and error conditions, and expose design problems early.

## Workflow
1. Enumerate behavior classes: happy path / edge cases / error paths / regression case.
2. Add or update tests before finalizing implementation.
3. Validate failure behavior explicitly: invalid input / empty-null state / timeouts / permission failures / malformed data.
4. Require observable outcomes: return values / exceptions / logs / retries / fallbacks.
5. If code is hard to test: flag design issue, reduce coupling, isolate side effects.

## Minimum test set
- 1 happy-path test, 1 edge-case test, 1 failure-path test, 1 regression test for the bug being fixed.

## Hard rules
- Do not mark a change complete without tests unless the user explicitly waives tests.
- Do not test only success cases.
- Do not hide exceptions with broad catch blocks.

## Exit criteria
- Error paths are specified.
- Tests cover normal and abnormal behavior.
- Design is testable enough to maintain.`,

  "secure-coding-and-validation-gate": `# Skill 06 - Secure Coding and Validation Gate

## Purpose
Reduce common security weaknesses in AI-generated code.

## When to trigger
- User input enters the system
- Data is parsed, stored, or rendered
- Auth/session/access-control code changes
- File handling, subprocesses, shell commands, templates, DB access, crypto, network endpoints

## Why this exists
A systematic literature review found LLM-generated code often contains vulnerabilities caused by inadequate input validation, improper resource management, weak cryptographic practices, and poor file handling. Injection issues (SQL, XSS) are repeatedly reported. OWASP and NIST both recommend integrating secure practices into the SDLC.

## Workflow
1. Identify trust boundaries and untrusted inputs.
2. Apply secure coding checks: input validation / output encoding / parameterized queries / access control / safe file handling / safe secrets handling / safe error handling.
3. Reject unsafe defaults: string-built SQL / unsanitized HTML output / broad CORS / plaintext secrets / unsafe path joins.
4. Require least-privilege assumptions.
5. Add security-specific tests where applicable.
6. Mark any unresolved security risk in the output.

## Security review prompts
- What inputs are attacker-controlled?
- Can this become injection, traversal, deserialization, or XSS?
- Are errors leaking sensitive data?
- Is crypto delegated to vetted libraries and safe defaults?
- Are secrets sourced from secure configuration, not code?

## Hard rules
- Never emit insecure examples as production-ready code.
- Never claim code is "secure" without review.
- Never use custom crypto where a vetted library exists.

## Exit criteria
- Trust boundaries identified / Common vulnerability classes checked / Risk notes included for anything not fully verified.`,

  "code-review-and-change-gate": `# Skill 07 - Code Review and Change Gate

## Purpose
Catch design, complexity, naming, testing, and maintainability defects before merge.

## When to trigger
- Before presenting a final patch / Before a PR / commit / release
- After a large AI-generated diff / After refactor or migration work

## Why this exists
Google's code review guidance explicitly checks design, functionality, complexity, tests, and naming. GitHub documentation states the AI assistant does not replace developer expertise.

## Review rubric
1. Design: Is the code appropriate for the system? Did boundaries/interfaces stay coherent?
2. Functionality: Does behavior match the stated requirements?
3. Complexity: Can it be simpler? Is the change larger than necessary?
4. Tests: Are automated tests present and well designed?
5. Naming / readability: Are names clear? Are comments accurate and minimal?

## Required output
- Review findings / Blocking issues / Non-blocking improvements / Risk level
- Merge recommendation: approve / revise / stop

## Hard rules
- Do not self-approve a diff with unresolved blocking issues.
- Do not confuse "it runs" with "it is review-ready."
- Do not treat AI output as authoritative.

## Exit criteria
- No blocking issues remain.
- Review notes are explicit.
- The change is traceable back to requirements and tests.`,

  "code-quality-enforcer": `# Skill 08 - Code Quality Enforcer

## Purpose
Prevent maintainability, readability, and efficiency regressions in AI-generated code before merge.

## When to trigger
- Any non-trivial feature, bugfix, or refactor
- Large AI-generated diffs / Repeated logic across files / Complex conditionals, deep nesting, long methods
- Performance-sensitive paths / Low-quality naming or comments in changed code

## Why this exists
Research reports LLM-generated code can carry code smells at non-trivial rates depending on model and prompting setup. Empirical work links specific smell classes with external quality degradation and defect-proneness. Professional guidance emphasizes readability, cognitive load reduction, and complexity checks.

## Workflow
1. Quality inventory on touched files: duplicate logic / overly long functions-classes / deep nesting / dead code / vague names.
2. Check modularity: enforce single-purpose units / extract repeated logic only when reuse is real / avoid premature abstractions.
3. Enforce readability conventions: intention-revealing names / consistent style / comments explain "why" not "what".
4. Check documentation impact: update docstrings/type hints for changed behavior.
5. Performance sanity on hot paths: identify O(n^2)+ risks, repeated I/O, unnecessary allocations.
6. Run quality tooling: formatter/linter / type checker / dead-code checks / static analysis.
7. Triage by severity: blocking (correctness/maintainability/performance risks) vs non-blocking (readability).

## Hard rules
- Do not accept duplicated business-critical or security-critical logic without justification.
- Do not trade readability for speculative performance gains.
- Do not add abstractions without demonstrated need.
- Do not mark code as quality-approved if blocking quality issues remain.

## Exit criteria
- No unresolved blocking quality issues.
- Quality findings are explicit and traceable to changed files.`,

  "deterministic-validation-gate": `# Skill 09 - Deterministic Validation Gate

## Purpose
Enforce unbiased, deterministic validation of AI-generated changes using tested scanners and explicit evidence.

## When to trigger
- Before finalizing any non-trivial patch
- Security-sensitive changes (auth, secrets, subprocess, deserialization, network)
- Dependency and build workflow changes / Architecture-affecting or cross-module refactors

## Why this exists
Research explicitly recommends deterministic enforcement (SAST/SCA/secrets/dependency checks) plus human review, instead of relying on model-only judgment. It recommends starting with tested Semgrep packs then adding repo-specific policy rules.

## Workflow
1. Validate rule configs: semgrep validate .semgrep.yml
2. Run tested Semgrep registry packs plus local policy rules: semgrep scan --config p/security-audit --config p/secrets --config .semgrep.yml
3. Run local custom policy scan: semgrep scan --config .semgrep.yml
4. Triage findings: blocking security/integrity issues / architecture boundary violations / non-blocking quality improvements.
5. Apply smallest safe fixes, then rerun validation.
6. Produce evidence bundle: commands run / finding IDs and file paths / fixes mapped to findings / residual risks.

## Hard rules
- Do not claim "secure" or "clean" without scanner output evidence.
- Do not suppress findings without a documented rationale.
- Do not rely on unsourced heuristics when deterministic evidence is available.
- Do not treat AI-generated code as trusted by default.

## Exit criteria
- Rule configs are valid / Required scans were executed.
- Blocking findings are fixed or explicitly accepted with rationale.
- Final output includes reproducible scan evidence.`,
};

const ROUTING: Record<string, string[]> = {
  feature: [
    "requirements-grounding",
    "context-scope-discipline",
    "design-doc-and-architecture-gate",
    "test-and-error-path-gate",
    "secure-coding-and-validation-gate",
    "code-quality-enforcer",
    "deterministic-validation-gate",
    "code-review-and-change-gate",
  ],
  bugfix: [
    "requirements-grounding",
    "context-scope-discipline",
    "test-and-error-path-gate",
    "secure-coding-and-validation-gate",
    "code-quality-enforcer",
    "deterministic-validation-gate",
    "code-review-and-change-gate",
  ],
  refactor: [
    "requirements-grounding",
    "context-scope-discipline",
    "design-doc-and-architecture-gate",
    "test-and-error-path-gate",
    "code-quality-enforcer",
    "deterministic-validation-gate",
    "code-review-and-change-gate",
  ],
  "dependency-update": [
    "requirements-grounding",
    "context-scope-discipline",
    "dependency-verification",
    "secure-coding-and-validation-gate",
    "code-quality-enforcer",
    "deterministic-validation-gate",
    "code-review-and-change-gate",
  ],
};

// ---------------------------------------------------------------------------
// Tool 1: mitigate-mistakes
// Single targeted research-grounded skill gate.
// ---------------------------------------------------------------------------
const analyzerArgsSchema = z.object({
  prompt: z
    .string()
    .min(1)
    .describe("The code snippet or task you want to check for potential AI coding agent mistakes."),
  skill: z
    .enum(Object.keys(SKILL_CONTENT) as [string, ...string[]])
    .describe(
      "The mitigation skill gate to apply. One of: requirements-grounding, context-scope-discipline, dependency-verification, design-doc-and-architecture-gate, test-and-error-path-gate, secure-coding-and-validation-gate, code-review-and-change-gate, code-quality-enforcer, deterministic-validation-gate.",
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
      `Optional model override. Defaults to server config (${ServerConfig.defaultModel || "provider default"}).`,
    ),
});

export const analyzerTool: UnifiedTool = {
  name: "mitigate-mistakes",
  description:
    "Apply a single research-grounded skill gate to detect common AI coding mistakes. Choose the gate relevant to your current task stage: requirements-grounding, context-scope-discipline, dependency-verification, design-doc-and-architecture-gate, test-and-error-path-gate, secure-coding-and-validation-gate, code-review-and-change-gate, code-quality-enforcer, or deterministic-validation-gate. Based on academic research and professional engineering standards.",
  zodSchema: analyzerArgsSchema,
  prompt: {
    description:
      "Apply a single research-grounded gate to analyze code or a task for common AI agent failure modes.",
  },
  category: "utility",
  execute: async (args, onProgress) => {
    const { prompt, skill, provider } = args as {
      prompt: string;
      skill: string;
      provider: string;
      model?: string;
    };
    const model = (args as any).model || ServerConfig.defaultModel;

    const skillContent = SKILL_CONTENT[skill];
    if (!skillContent) {
      throw new Error(
        `Unknown skill '${skill}'. Available: ${Object.keys(SKILL_CONTENT).join(", ")}`,
      );
    }

    const enhancedPrompt = `# RESEARCH-GROUNDED GATE: ${skill.toUpperCase()}

[GATE INSTRUCTIONS]
${skillContent}

[USER TASK / CODE]
${prompt}

---

Based on the research and best practices in the GATE INSTRUCTIONS above, analyze the USER TASK / CODE for potential mistakes, risks, or areas of improvement. Ground all assessments in the principles stated in the gate content — do not introduce external assumptions. Separate blocking issues from non-blocking improvements. State your exit-criteria verdict at the end.

Assessment:`;

    onProgress?.(`Applying '${skill}' gate using ${provider}...`);
    return await executeAICLI(
      enhancedPrompt,
      provider as string | undefined,
      model as string | undefined,
      false,
      false,
      onProgress,
    );
  },
};

const coordinatorArgsSchema = z.object({
  prompt: z.string().min(1).describe("The code, diff, or task description to review."),
  task_type: z
    .enum(["feature", "bugfix", "refactor", "dependency-update"])
    .describe(
      "The type of change being made. Determines which minimum skill gates are applied: feature (8 gates), bugfix (7 gates), refactor (7 gates), dependency-update (7 gates).",
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
      `Optional model override. Defaults to server config (${ServerConfig.defaultModel || "provider default"}).`,
    ),
});

export const coordinatorTool: UnifiedTool = {
  name: "coordinate-review",
  description:
    "Coordinated multi-gate review. Auto-selects the minimum set of research-grounded skill gates for a given task type (feature/bugfix/refactor/dependency-update) and runs them in a single structured pass. Produces gate-by-gate findings, blocking issues, and a final merge recommendation. Uses the AI Coding Agent Mitigator coordinator pattern.",
  zodSchema: coordinatorArgsSchema,
  prompt: {
    description:
      "Run the minimum relevant skill gates for a task type in a single coordinated review pass.",
  },
  category: "utility",
  execute: async (args, onProgress) => {
    const { prompt, task_type, provider } = args as {
      prompt: string;
      task_type: string;
      provider: string;
      model?: string;
    };
    const model = (args as any).model || ServerConfig.defaultModel;

    const selectedSkills = ROUTING[task_type];
    if (!selectedSkills || selectedSkills.length === 0) {
      throw new Error(
        `Unknown task type '${task_type}'. Available: ${Object.keys(ROUTING).join(", ")}`,
      );
    }

    onProgress?.(
      `Running coordinated review for '${task_type}' (${selectedSkills.length} gates) using ${provider}...`,
    );

    const gateSections = selectedSkills
      .map((skill, idx) => {
        const content = SKILL_CONTENT[skill] || `[content not found for ${skill}]`;
        const label = skill.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
        return `### Gate ${idx + 1}: ${label}\n\n${content}`;
      })
      .join("\n\n---\n\n");

    const enhancedPrompt = `# AI CODING AGENT COORDINATED REVIEW

## Task Classification: ${task_type}
## Active Gates (${selectedSkills.length}): ${selectedSkills.map((s) => s.replace(/-/g, " ")).join(", ")}

## Coordinator Operating Rules
- Keep one bounded objective per gate pass.
- Do not invent requirements, dependencies, or security claims.
- Use deterministic evidence before model judgment; avoid unsourced assumptions.
- Surface unresolved unknowns, risks, and blocking issues instead of guessing.
- Do not mark changes complete without gate outcomes unless explicitly waived.

[GATE INSTRUCTIONS]

${gateSections}

---

[USER TASK / CODE]
${prompt}

---

## Required Output Format

Apply each gate strictly in sequence. For each gate provide:
**Gate N: [name]** — Findings (list blocking issues, then non-blocking improvements)

Then conclude with a **Summary** section:
- Active task summary
- Blocking issues (consolidated list)
- Non-blocking improvements (consolidated list)
- Risk level: low / medium / high
- Final recommendation: approve / revise / stop

Review:`;

    return await executeAICLI(
      enhancedPrompt,
      provider as string | undefined,
      model as string | undefined,
      false,
      false,
      onProgress,
    );
  },
};
