# pstack

pstack is Lauren Tan's rigorous engineering workflow collection. This fork
keeps the original principles and playbooks while making the execution layer
portable across Codex, Claude Code, and Google Antigravity.

The goal is to write less, higher-quality code: understand the system, choose a
small coherent change, prove the behavior, and make uncertainty visible.

## Start here

1. Optionally run [`setup-pstack`](./skills/setup-pstack/SKILL.md) to create the
   shared `.pstack/config.yaml` role configuration.
2. Use [`poteto-mode`](./skills/poteto-mode/SKILL.md) for non-trivial work.
3. Read [`pstack-runtime`](./skills/pstack-runtime/SKILL.md) whenever a workflow
   needs delegation, model selection, questions, transcripts, or scheduling.

Host invocation syntax differs:

- Codex: `$poteto-mode`
- Claude Code: `/pstack:poteto-mode`
- Antigravity: `/poteto-mode` or ask for the skill by name

## Portable execution

The skills use one capability contract:

- native subagents when available and permitted;
- sequential fallback when delegation is unavailable;
- inherited models unless the host confirms an override;
- scoped task history only when the host exposes it;
- host-native wait or scheduling, never a guessed background daemon;
- current user and host permissions for every external write or destructive
  action.

This means a workflow can preserve its evidence standard without pretending
every host exposes the same tool names.

## Main workflows

| Skill | Use it for |
| --- | --- |
| [`poteto-mode`](./skills/poteto-mode/SKILL.md) | Route a non-trivial task to the matching playbook. |
| [`how`](./skills/how/SKILL.md) | Explain how a subsystem works. |
| [`why`](./skills/why/SKILL.md) | Reconstruct rationale from code and available records. |
| [`blast-radius`](./skills/blast-radius/SKILL.md) | Find what a small-looking change could break. |
| [`architect`](./skills/architect/SKILL.md) | Compare concrete designs before implementation. |
| [`arena`](./skills/arena/SKILL.md) | Produce competing candidates, pick a base, and graft. |
| [`swarm`](./skills/swarm/SKILL.md) | Cover independent slices or run a controlled race. |
| [`interrogate`](./skills/interrogate/SKILL.md) | Adversarially review a diff without auto-applying findings. |
| [`tdd`](./skills/tdd/SKILL.md) | Capture a cheap failing behavior before a fix. |
| [`no-comments`](./skills/no-comments/SKILL.md) | Review comments and replace workaround prose with structure. |
| [`technical-writing`](./skills/technical-writing/SKILL.md) | Write layered technical documentation. |
| [`unslop`](./skills/unslop/SKILL.md) | Remove vague, repetitive, or synthetic prose. |
| [`show-me-your-work`](./skills/show-me-your-work/SKILL.md) | Keep a reviewable decision trail. |
| [`create-verification-skill`](./skills/create-verification-skill/SKILL.md) | Build a project-specific real-app verification workflow. |

The principles live in the `principle-*` skills. `poteto-mode` indexes them and
loads the relevant leaf before applying one.

## Claude custom agents

Claude Code can load the bundled agents in [`agents/`](./agents/). Codex and
Antigravity ignore that directory and follow the host-neutral delegation rules
in the shared skills. `no-comments` tells non-Claude hosts how to run the same
review lens from [`agents/comment-sicko.md`](./agents/comment-sicko.md).

## Removed Cursor-only surfaces

The upstream benny Cursor Automations pack and Cursor webhook UI skill are not
included because neither has an equivalent portable contract in all three
target hosts. This fork does not relabel unsupported automation as compatible.

## Guide

The deeper workflow guide begins at [`docs/guide/README.md`](./docs/guide/README.md).

## License and provenance

MIT. See [`LICENSE`](./LICENSE) and [`NOTICE.md`](./NOTICE.md).
