---
name: pstack-runtime
description: Resolve host capabilities and portability rules for pstack on Codex, Claude Code, and Google Antigravity. Read before any pstack workflow delegates, asks a structured question, reads transcripts, schedules a continuation, or uses model overrides.
---

# pstack runtime

Use capabilities, not guessed product APIs. Host and user instructions always
override this skill. A pstack workflow never grants permission to mutate an
external system, publish, merge, deploy, contact people, or delete data.

## Identify the host

Infer the active host from tools and explicit system context. Do not rely on a
single environment variable. If the host is unclear, use the common-denominator
behavior below.

| Capability | Codex | Claude Code | Antigravity |
| --- | --- | --- | --- |
| Shared skills | plugin `skills/` | plugin `skills/` | project `.agents/skills/` |
| Delegation | native subagent tools when enabled | Agent/Task tools and plugin agents | Agent Manager or CLI delegation when exposed |
| Model override | only listed supported models | only accepted model slugs | only models exposed by the current runtime |
| Structured question | host question UI when available | host question tool when available | host question UI when available |
| Wake or schedule | host task/automation tools | host loop/schedule tools | host scheduler or explicit user continuation |
| Transcript access | only a path or API exposed for this task | only a path or API exposed for this session | only a path or API exposed for this workspace |

Never name a tool merely because another host has it. Inspect the tools that are
actually available in this session.

## Common-denominator behavior

- If delegation exists and the governing instructions permit it, use one worker
  per independent scope and one writer per file. Use the host's native spawn,
  message, wait, and interrupt operations.
- If delegation is absent or prohibited, run the lane sequentially in the parent
  session. Preserve the same evidence and verification requirements. Do not
  claim an independent review occurred.
- If a model override is unsupported or rejected, inherit the parent model. Do
  not invent a slug or silently substitute a named model family.
- If structured questions are unavailable, ask one concise plain-text question
  only when the answer materially changes the result and cannot be observed.
- If no transcript path or API is explicitly available, use the current
  conversation, Git history, and `decisions.tsv`. Never search unrelated user
  history.
- If no wake primitive exists, wait only with the host's supported wait tool
  while the session is active. Otherwise state the continuation needed. Do not
  implement a hidden background daemon.

## Configuration

Read optional project configuration from `.pstack/config.yaml`. Missing config
means `inherit-parent` for every role and the workflow's stated fan-out.

Supported values are intentionally small:

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

A role may use a concrete model identifier only when the current host reports it
as available. `inherit-parent` is always portable. Panel counts control fan-out;
the host may lower them because of concurrency limits.

## Safety boundary

Treat host permission rules as authoritative. Reversible repository edits can
proceed when the user requested implementation. External writes, merges,
deployments, messages, releases, credential changes, and destructive actions
require the authorization that the host and current request demand. A request
for review, diagnosis, explanation, or status is read-only.
