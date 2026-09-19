# pstack universal

This repository is a portable fork of Lauren Tan's
[pstack](https://github.com/cursor/plugins/tree/main/pstack). It keeps one shared
skill tree and packages it for Codex, Claude Code, and Google Antigravity.

The fork tracks upstream pstack `0.15.2` at commit
`032be146865d973682535de75f2287da438550bf`. The original MIT license and
attribution are preserved in `plugins/pstack/LICENSE` and `UPSTREAM.md`.

## What changed

- Added the portable Agent Plugins manifest and a Codex compatibility manifest.
- Added a Claude Code manifest and marketplace.
- Added a Codex marketplace.
- Added an Antigravity installer that links the shared skills into a project's
  `.agents/skills/` directory.
- Replaced Cursor-only task, question, model, transcript, and configuration
  assumptions with runtime capability checks.
- Removed the Cursor Automations-only `benny` pack and Cursor webhook UI skill.
  They are documented as upstream-only rather than advertised as portable.

## Install

### Codex

Add the Terrane Labs marketplace and install pstack:

```bash
codex plugin marketplace add terranelabs/pstack-universal
codex plugin add pstack@pstack-universal
```

For local development, add this checkout instead:

```bash
codex plugin marketplace add /absolute/path/to/pstack-universal
codex plugin add pstack@pstack-universal
```

Start a new Codex task after installation so the skills are discovered.

### Claude Code

Test the plugin directly:

```bash
claude --plugin-dir ./plugins/pstack
```

Or install it from this repository's marketplace:

```text
/plugin marketplace add terranelabs/pstack-universal
/plugin install pstack@pstack-universal
```

Claude namespaces plugin skills, so invoke the entry point as
`/pstack:poteto-mode`.

### Antigravity

Antigravity consumes Agent Skills rather than Codex or Claude plugin manifests.
From the target project, run:

```bash
/absolute/path/to/pstack-universal/scripts/install-antigravity.sh .
```

The installer creates relative links under `.agents/skills/`. Use `--copy` if
the target environment cannot follow symbolic links. Restart Antigravity, then
confirm the skills with `/skills`.

## Use

Run `setup-pstack` once in the target repository if you want to tune delegation
roles. It writes `.pstack/config.yaml`, which is shared across all three hosts.
The default is deliberately portable: inherit the current model and use the
host's native subagent support when available.

Then invoke `poteto-mode` for non-trivial work. Skill invocation syntax varies:

- Codex: `$poteto-mode`
- Claude Code: `/pstack:poteto-mode`
- Antigravity: `/poteto-mode` or ask for the skill by name

## Compatibility boundary

The common denominator is the Agent Skills format. Claude custom agents remain
available under `plugins/pstack/agents/`; Codex and Antigravity ignore that
directory and follow the host-neutral delegation instructions in the skills.
Features that require a host capability degrade explicitly:

- no subagents: run the lane sequentially in the parent session;
- no model override: inherit the parent model;
- no transcript API: use the decision trail and current conversation;
- no scheduler or wake primitive: poll only while the current session remains
  active, or ask the user to configure a host-native scheduled continuation.

The fork does not claim Cursor Automations compatibility for the removed benny
pack. Retrieve it from upstream if you still use Cursor.

## Validate

```bash
./scripts/validate.sh
```

The validator checks JSON, both plugin manifests, every skill frontmatter
block, relative links, and the bundled TypeScript tests.
