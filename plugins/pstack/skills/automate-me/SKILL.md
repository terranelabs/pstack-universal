---
name: automate-me
description: "Use for \"automate me\", \"create/update/refresh my -mode skill\", \"turn/capture my preferences or working style into a skill\", or wanting agents to follow how the user works. Drafts or revises a personal mode skill via the host's skill-authoring workflow and unslop, using only scoped history the host exposes."
---

# Automate me

A guided flow for turning the user's working conventions into a skill agents will follow. The output is one `-mode` skill tailored to them (e.g. `jay-mode`, `priya-mode`).

Read **pstack-runtime** first. This skill sequences an inline mining pass, the
host's skill-authoring workflow when installed, and **unslop**. It does not
broaden transcript access or authorize commits and pull requests.

## Flow

### 0. Check for an existing skill

Look in the active project's host-native skills directory for a matching mode skill: `.agents/skills/` for Codex or Antigravity, and `.claude/skills/` for Claude Code. Search a personal skills directory only when the user asked for a personal skill. If one exists, confirm intent with the host's question UI when available, unless the user already said "update my skill" or similar:

- Update the existing skill (default for repeat runs)
- Start fresh (rare, ask why before doing it)

Update mode changes the rest of the flow:
- Step 1 mines only history since the skill was last edited (`git log -1 --format=%cI <path>`).
- Step 2 asks what's changed or missing, not what to capture from zero.
- Step 4 edits the existing file in place. Preserve sections the user hasn't contradicted. Revise ones with new evidence. Add new sections only for genuinely new rules.

### 1. Mine their history

Use recent transcripts only when the host explicitly exposes a path or API for
this task and the user has asked to mine their history. Never glob across user
or workspace history. If scoped history is unavailable, use the current
conversation and direct user answers.

Survey only the approved scope for recurring patterns. When native delegation is available and permitted, give each worker a separate slice and forbid writes. Otherwise mine sequentially. Each worker reads only the scoped history supplied by the parent and returns a short structured list with evidence pointers. Choose reasoning and speed settings only when the host exposes them, as described in the Subagents section of **poteto-mode**. Default signals worth hunting:

- Response preferences (length, tone, format, "dumb it down" corrections)
- Delegation habits (subagents, models, specialized workflows, parallelism)
- Verification posture (what "done" means, unit tests vs live repro, reviewers)
- Code and prose discipline (style, principles cited, lint/format tools)
- Process conventions (worktrees, commits, PRs, review/merge tooling)
- Meta preferences (fixing skills mid-task, proposing new ones)

Cross-check across slices before elevating a signal. Patterns seen in 2+ slices are high-confidence. Lone signals are weak and usually get dropped.

### 2. Ask the user directly

Mining misses intent that has not come up yet. Use the host's structured question UI when available, or ask concise plain-text questions.

Shape: one or two questions with 4-6 options each, `allow_multiple: true` for category questions. Start broad ("Which areas matter most?"), then follow up on selected areas with specific options. After the structured rounds, one free-form chat question catches anything the options missed.

Don't dump 20 questions.

### 3. Cluster findings

Group the combined signals into sections. Common ones (use only what applies):

- **Response style**: length, tone, format.
- **Autonomy**: how much to do without asking, MCP tool use.
- **Understand first**: which skills to reach for when scoping or investigating a change.
- **Subagents**: default, parallelism, model-to-task, specialized workflows.
- **Prose / code discipline**: principles, lint tools, style guides.
- **Review and verify**: repro posture, verification skills, live-testing tools.
- **Process**: git worktrees, commits, PRs, review/merge tooling.
- **Skills**: skill-authoring habits, fix-the-skill-first, proposing new skills.

The **poteto-mode** skill shows the shape. Read it for granularity. Don't copy its content. The user's rules are not the same as poteto-mode's.

### 4. Draft the skill

Use the host's skill-authoring skill when installed; otherwise follow the portable Agent Skills format and validate the result. Placement:

- Path: preserve an existing mode skill's category. For a new project skill, use `.agents/skills/<handle>-mode/SKILL.md` on Codex or Antigravity and `.claude/skills/<handle>-mode/SKILL.md` on Claude Code. Use a personal directory only when the user explicitly requests personal scope.
- Handle: the user's first name or chosen identifier.
- Frontmatter `description`: trigger on their name + `/<handle>-mode` + "work in their style", not on generic keywords like "write code" or "review PR".
- Frontmatter formatting: use portable `name` and `description` fields. Keep `description` as one YAML scalar. Do not add host-only fields to a shared skill.

### 5. Iterate on prose

Apply **unslop** and the selected host's skill-authoring guidance to every line.

Show the draft to the user and take feedback. Expect multiple iterations. Cut ruthlessly. A mode skill is not a manual.

### 6. Land it

If the user asked to commit or open a PR, work in an isolated branch or worktree
and follow that request. Otherwise leave the validated skill as an uncommitted
change and report its path.

## Guardrails

- **Don't overfit to one conversation.** A preference stated once and contradicted another time is noise. Require multiple instances before codifying it.
- **Don't be clever.** Restating other skills' contents, inventing metaphors, or writing "poetic" prose for an agent reader is cost without benefit. Keep it operational.
- **Reference, don't inline.** Other skills the user relies on should appear as path references, not pasted excerpts. Same for any principle docs they maintain elsewhere.
- **Keep sections minimal.** Only add a section if the user has a specific, non-default rule there. "Communicate clearly" is not a section. "Short paragraphs. Tables when comparing options. Bullets only when items are genuinely parallel." is.
- **Name conventions generic.** Use "the user" or "the human" in imperatives, not the author's first name.
- **Don't force symmetry.** If a user has no process rules worth writing down, skip the Process section entirely.

## Evaluation

A `-mode` skill is subjective output. A benchmark loop is not useful here. Vibe-check with the user: does it read like them? Did it miss anything? Then hand over the validated change.

Run a description-optimization loop only if the skill's trigger accuracy turns out to be a problem in practice.

## When not to use

- User wants a task-specific skill (not working conventions): use the host's skill-authoring workflow, with no mining required.
- User wants to capture one narrow workflow (e.g. "how I write commit messages"). That's a regular skill, not a mode skill.
