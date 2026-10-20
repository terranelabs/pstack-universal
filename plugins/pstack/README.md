# pstack

pstack is Lauren Tan's engineering workflow collection. This fork keeps the principles and playbooks while making execution portable across Codex and Claude Code. It also supports Google Antigravity.

The workflow starts by understanding the system. It chooses a coherent change and verifies the resulting behavior. Reports distinguish evidence from uncertainty.

## Start here

1. Optionally run [`setup-pstack`](./skills/setup-pstack/SKILL.md) to create the shared `.pstack/config.yaml` role configuration.
2. Use [`poteto-mode`](./skills/poteto-mode/SKILL.md) for work that needs a playbook.
3. Read [`pstack-runtime`](./skills/pstack-runtime/SKILL.md) before a workflow uses host capabilities such as delegation or scheduling.

Use the invocation syntax for your host:

- Codex uses `$poteto-mode`.
- Claude Code uses `/pstack:poteto-mode`.
- Antigravity uses `/poteto-mode`, or a request that names the skill.

The [guide](./docs/guide/README.md) walks through a task from setup to verification. [`poteto-help`](./skills/poteto-help/SKILL.md) answers questions about the workflow and suggests a prompt without starting the work.

## Portable execution

The skills share these rules:

- Use native subagents when the host provides them and permits delegation.
- Work sequentially when delegation is unavailable.
- Inherit the parent model unless the host confirms a supported override.
- Read task history only through an exposed host capability or an explicitly supplied transcript path.
- Use the host's wait or scheduling tools. Create no hidden background process.
- Follow current permissions for external writes and destructive actions.

A workflow reports a missing capability and explains the effect on its evidence. A missing tool cannot authorize an action or establish that a required check passed.

## Skills

The table lists the workflow skills. The [principles guide](./docs/guide/08-principles.md) indexes the `principle-*` skills.

| Skill | Use it for |
| --- | --- |
| [`poteto-mode`](./skills/poteto-mode/SKILL.md) | Route a task to the matching playbook. |
| [`poteto-help`](./skills/poteto-help/SKILL.md) | Find the workflow or setup instructions for a goal. |
| [`in-your-own-words`](./skills/in-your-own-words/SKILL.md) | Restate the intended goal before acting. |
| [`sharpen`](./skills/sharpen/SKILL.md) | Refine a task's approach and its acceptance check. |
| [`how`](./skills/how/SKILL.md) | Explain how a subsystem works. |
| [`why`](./skills/why/SKILL.md) | Reconstruct rationale from code and available records. |
| [`recall`](./skills/recall/SKILL.md) | Rebuild recent context from scoped history and current evidence. |
| [`ketchup`](./skills/ketchup/SKILL.md) | Report progress in this chat and list decisions waiting on you. |
| [`teach`](./skills/teach/SKILL.md) | Explain a change or subsystem using behavior and rationale. |
| [`blast-radius`](./skills/blast-radius/SKILL.md) | Find what a change could break and test the safety claim. |
| [`architect`](./skills/architect/SKILL.md) | Compare concrete designs before implementation. |
| [`arena`](./skills/arena/SKILL.md) | Produce competing candidates and combine the strongest parts. |
| [`swarm`](./skills/swarm/SKILL.md) | Cover independent slices or run a controlled race. |
| [`interrogate`](./skills/interrogate/SKILL.md) | Review a diff from independent angles. |
| [`tdd`](./skills/tdd/SKILL.md) | Capture a cheap failing behavior before a fix. |
| [`benchmark-checklist`](./skills/benchmark-checklist/SKILL.md) | Check what a measured performance number proves. |
| [`no-comments`](./skills/no-comments/SKILL.md) | Review comments and encode accepted constraints in code. |
| [`typescript-best-practices`](./skills/typescript-best-practices/SKILL.md) | Apply TypeScript rules while reading or editing code. |
| [`technical-writing`](./skills/technical-writing/SKILL.md) | Write technical documentation for its intended reader. |
| [`unslop`](./skills/unslop/SKILL.md) | Remove vague or repetitive prose. |
| [`figure-it-out`](./skills/figure-it-out/SKILL.md) | Design an auditable workflow when no playbook fits. |
| [`show-me-your-work`](./skills/show-me-your-work/SKILL.md) | Keep a decision trail that a reviewer can check. |
| [`automate-me`](./skills/automate-me/SKILL.md) | Create a personal mode from authorized working history. |
| [`reflect`](./skills/reflect/SKILL.md) | Propose skill changes from lessons in the current session. |
| [`correct`](./skills/correct/SKILL.md) | Prevent recurring agent mistakes through changes to the repository. |
| [`create-verification-skill`](./skills/create-verification-skill/SKILL.md) | Build a workflow that drives the real app and records evidence. |
| [`maintain-verification-skill`](./skills/maintain-verification-skill/SKILL.md) | Reconcile the verification workflow with current app behavior. |
| [`create-formal-verification-skill`](./skills/create-formal-verification-skill/SKILL.md) | Check one property within stated verification bounds. |
| [`maintain-formal-verification-skill`](./skills/maintain-formal-verification-skill/SKILL.md) | Update formal checks when the code they describe changes. |
| [`bro`](./skills/bro/SKILL.md) | Restate the last message in plain language. |
| [`setup-pstack`](./skills/setup-pstack/SKILL.md) | Configure shared roles and panel sizes. |
| [`pstack-runtime`](./skills/pstack-runtime/SKILL.md) | Resolve the active host's tools and permission boundaries. |

## Playbooks

[`poteto-mode`](./skills/poteto-mode/SKILL.md) indexes the [playbooks](./skills/poteto-mode/playbooks/). They cover implementation and investigation. Separate playbooks handle verification and authorized delivery. A request to review a change remains a review unless you ask for edits.

The new verification workflows complement app checks. Formal verification states the property and its bounds. [`benchmark-checklist`](./skills/benchmark-checklist/SKILL.md) tests whether a performance number describes the intended work. Neither establishes behavior outside the evidence collected.

## Claude custom agents

Claude Code can load the bundled agents in [`agents/`](./agents/). Codex and Antigravity follow the shared delegation rules. [`no-comments`](./skills/no-comments/SKILL.md) explains how those hosts use the review instructions in [`comment-sicko.md`](./agents/comment-sicko.md).

The [Claude Code notes](./docs/harness/claude-code.md) describe the fork's shared runtime configuration.

## Upstream exclusions

The upstream benny automation pack and `make-bot-ui` skill require Cursor services. This fork excludes them. Cursor custom modes and `/loop` are also host features. Use a supported host continuation mechanism when one is available.

## License and provenance

MIT. See [`LICENSE`](./LICENSE) and [`NOTICE.md`](./NOTICE.md).
