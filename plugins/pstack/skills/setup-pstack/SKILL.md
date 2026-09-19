---
name: setup-pstack
description: Configure portable pstack delegation roles and panel sizes for Codex, Claude Code, or Google Antigravity. Use for setup-pstack, configure pstack models, pstack budget, or changing pstack role choices.
---

# Setup pstack

Read the **pstack-runtime** skill first. Write project-local configuration to
`.pstack/config.yaml`. This file is the one source of pstack configuration for
Codex, Claude Code, and Antigravity.

## 1. Inspect the host

Identify the active host and the delegation, model-selection, and concurrency
capabilities actually exposed in this session. Do not infer entitlements from
marketing names or from another host's configuration.

If the host can list supported model identifiers, record that set for this
setup run. If it cannot, use `inherit-parent`. Never invent a model slug.

## 2. Load current state

Read `.pstack/config.yaml` when it exists. Preserve recognized current choices
unless the user asks to reset them. Missing configuration means:

- every role uses `inherit-parent`;
- arena, architect, and interrogate each request three lanes;
- the host may lower fan-out to its concurrency limit;
- workflows run sequentially when delegation is unavailable or prohibited.

## 3. Resolve the budget

Ask only if the user did not state a budget and the answer materially affects
the requested setup. Use the host's structured question UI when available.
Otherwise ask one concise question.

Supported budgets are:

- `inherit`: keep the parent session's reasoning settings;
- `high`: prefer the host's high reasoning option when supported;
- `medium`: prefer the host's medium reasoning option when supported;
- `fast`: prefer a lower-latency option when supported.

The budget is a preference, not permission to substitute an unavailable model.

## 4. Resolve roles

Configure these roles:

- `code`: implementation and mechanical changes;
- `judgment`: design, synthesis, and ambiguous tradeoffs;
- `prose`: consequential writing;
- `reviewer`: adversarial verification;
- `explorer`: read-heavy investigation.

Each value is either `inherit-parent` or a concrete identifier reported by the
current host. A concrete identifier may be useful on one host and ignored on
another; `inherit-parent` is the portable default.

Configure panel counts for `arena`, `architect`, and `interrogate`. Clamp each
to the host's concurrency limit. A panel count is not a promise of model
diversity. Report whether the lanes use distinct models, repeated samples of
one model, or sequential passes.

## 5. Write and validate

Create `.pstack/` when needed and write the entire file idempotently:

```yaml
version: 1
budget: inherit
roles:
  code: inherit-parent
  judgment: inherit-parent
  prose: inherit-parent
  reviewer: inherit-parent
  explorer: inherit-parent
panels:
  arena: 3
  architect: 3
  interrogate: 3
```

Before writing a concrete model identifier, verify it is in the host-reported
set. Validate that `version` is `1`, every role exists, and panel counts are
positive integers.

## 6. Report

State the path written, the active host, and any degraded capability. Examples
include inherited models, sequential review because subagents are unavailable,
or a reduced panel because of a concurrency limit. The configuration applies
the next time a pstack skill reads it; a new session may be needed for hosts
that cache skill state.

Optionally offer **create-verification-skill** when the project has no real-app
verification path. Do not create it unless the user accepts or the current task
already authorized that work.
