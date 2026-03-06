# Mitigation Skills

Research-grounded gates that analyze your task or code for common AI coding agent failure modes. Based on academic and professional studies of AI coding behavior.

## How it works

Each skill targets a specific failure category. Pass a skill name and a prompt to `mitigate-mistakes`:

```
/ccg-tool:mitigate-mistakes skill:requirements-grounding prompt:"@feature-spec.md"
```

Or use `coordinate-review` to auto-select the right set of gates for a task type:

```
/ccg-tool:coordinate-review prompt:"@src/auth.ts" task_type:feature
```

## Available skills

| Skill | Purpose |
|-------|---------|
| `requirements-grounding` | Prevent requirement-conflicting hallucinations |
| `context-scope-discipline` | Maintain focus on the requested change set |
| `dependency-verification` | Verify imports, packages, and versions |
| `design-doc-and-architecture-gate` | Ensure structural and interface integrity |
| `test-and-error-path-gate` | Validate edge cases and failure modes |
| `secure-coding-and-validation-gate` | Identify security risks |
| `code-review-and-change-gate` | Final gate before applying changes |
| `code-quality-enforcer` | Check maintainability and patterns |
| `deterministic-validation-gate` | Evidence-based (not model-judgment) checks |

## Gate routing (coordinate-review)

`coordinate-review` selects gates based on `task_type`:

| Task type | Gates (in order) |
|-----------|------------------|
| `feature` | requirements-grounding → context-scope → design-doc → test-and-error → secure-coding → code-quality → deterministic → code-review |
| `bugfix` | requirements-grounding → context-scope → test-and-error → secure-coding → code-quality → deterministic → code-review |
| `refactor` | requirements-grounding → context-scope → design-doc → test-and-error → code-quality → deterministic → code-review |
| `dependency-update` | requirements-grounding → context-scope → dependency-verification → secure-coding → code-quality → deterministic → code-review |

## Examples

**Security review before merging:**

```
/ccg-tool:mitigate-mistakes skill:secure-coding-and-validation-gate prompt:"@src/api/auth.ts"
```

**Architecture check on a new module:**

```
/ccg-tool:mitigate-mistakes skill:design-doc-and-architecture-gate prompt:"@src/services/payment.ts" provider:gemini
```

**Full coordinated review for a feature:**

```
/ccg-tool:coordinate-review prompt:"@src/features/checkout.ts" task_type:feature
```
