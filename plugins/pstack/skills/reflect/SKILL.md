---
name: reflect
description: Spawn three parallel review subagents over the active transcript, surface learnings, and route each to a concrete edit on an existing skill. Use when the user says reflect.
---

# Reflect

Mine the current conversation for durable learnings, then route them into skill edits.

Read **pstack-runtime** first. Reflection does not authorize edits to skills,
backlog systems, or external services.

## When to invoke

Invoke when the user says "reflect" or "/reflect". Skip when the conversation is trivial, off-topic, or already covered by an existing skill the parent followed correctly. One-offs are not learnings.

## 1. Capture the current task

Use a transcript only when the host explicitly exposes a path or API for this
task. Verify that the record matches the current conversation before using it.
Never glob across user history or another workspace. If no scoped transcript
is available, write a tight digest from the current conversation and pass that
instead.

## 2. Run three review lenses

When native delegation is available and permitted, launch three reviewers in
parallel. Otherwise run the lenses sequentially in the parent session. Use the
configured `reviewer` role only when supported.

Choose reasoning and speed settings only when the host exposes them, as
described in the Subagents section of **poteto-mode**.

| Lens | Prompt template |
|---|---|
| Judgment | `references/judgment-reviewer.md` |
| Tooling | `references/tooling-reviewer.md` |
| Divergent | `references/divergent-reviewer.md` |

Pass each template with the scoped transcript path or digest. Give reviewers
read access for cited context, but no file or external write authority.

## 3. Synthesize

Use one native synthesis worker when available; otherwise synthesize in the
parent session. The synthesizer may verify citations using tools that read.
Use the configured `judgment` role only when supported.
Use `references/synthesizer.md` with each reviewer's full output. It returns a
structured Accepted / Rejected / Backlog list.

## 4. Structural enforcement check

Move any Accepted item that a lint rule, script, metadata flag, or runtime check would enforce more reliably to Backlog. See the **encode-lessons-in-structure** principle skill.

## 5. Apply

Present the synthesizer's full Accepted / Rejected / Backlog output and wait for explicit approval before applying any Accepted edit. The user picks the subset and may redirect routings. Skill changes affect every future agent in the org. Do not auto-apply.

Do not file backlog items automatically. External tracker writes need explicit
authorization. Keep proposed backlog entries in the report until authorized.

Follow each approved row's Routing exactly:

- Trivial existing-skill edit (a one-line bullet, a tightened sentence, a stale fact corrected): parent does directly.
- Substantive existing-skill edit (a new section, a new pattern table, more than ~10 lines): use the host's skill-authoring skill when installed; otherwise follow the Agent Skills format and validate locally.
- `tune description: <skill path>` (the skill exists but did not trigger when it should have): use the host's skill-authoring workflow when installed.
- `new skill: <kebab-name>`: use the host's skill-authoring workflow. Do not invent the shape ad hoc.

If your environment ships a SKILL.md validator, run it on every touched skill before declaring done.

## 6. Summarize for the user

Short list, no preamble:

- Edits applied: `<skill path>`. What changed, one line each.
- New skills created: `<skill path>`. One line each (rare).
- Backlog proposed or, when explicitly authorized, filed to the devex tracker: `<issue title>` (`<tags>`). One line each.
- Dropped: one line per rejected finding + reason from the synthesizer.
