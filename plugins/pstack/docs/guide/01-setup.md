# Setup

Install the plugin for your host, optionally configure its shared role map, then run one real task.

## Codex

Add the repository marketplace and install `pstack@pstack-universal`. Start a new task after installation, then invoke `$setup-pstack` or `$poteto-mode`.

## Claude Code

Install from this fork's marketplace:

```text
/plugin marketplace add terranelabs/pstack-universal
/plugin install pstack@pstack-universal
```

During development, launch from the repository root:

```bash
claude --plugin-dir ./plugins/pstack
```

Installed plugin skills use a namespace. Invoke `/pstack:setup-pstack` or `/pstack:poteto-mode`. The [Claude Code notes](../harness/claude-code.md) explain the shared runtime.

## Antigravity

Run the repository's installer from the target project:

```bash
/absolute/path/to/pstack-universal/scripts/install-antigravity.sh .
```

Restart Antigravity, confirm the installed skills with `/skills`, then invoke `/setup-pstack` or `/poteto-mode`.

## Configure roles

`setup-pstack` writes `.pstack/config.yaml`. The same file works on each supported host. Roles inherit the parent model by default. The default panels request three workers for arena and architect. Interrogate also requests three reviewers. A host may lower the panel size to its concurrency limit or run the work sequentially when delegation is unavailable.

Choose model overrides only from values the active host exposes. Unsupported values fall back to inheritance with a report. This fork does not write Cursor model rules or Claude rules under your home directory.

You can skip setup. Missing configuration is equivalent to `inherit-parent`.

## Add verification when it helps

Setup can offer to generate a skill that drives your app with [`create-verification-skill`](../../skills/create-verification-skill/SKILL.md). The generator proves the workflow once before handing it over. You can decline and run it later.

For code whose failures tests rarely reach, [`create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) checks one property within a stated scope. A job lease that must prevent concurrent execution is one possible target. Use it when the property and tool fit the code. [Verify and ship](./06-verify-and-ship.md) explains both workflows and their evidence limits.

## Control the cost

Parallel workers and review panels use extra tokens. Shorten the panel lists in `.pstack/config.yaml` when fewer attempts are enough. Model inheritance avoids a separate model override but does not reduce the number of workers. The host controls which reasoning settings it accepts.

## Run your first task

Try a request with an observable compatibility constraint:

```text
poteto-mode: add a --json flag to this command. Keep text output identical at the byte level
and verify both modes.
```

The workflow selects the Feature playbook and copies its steps into the available task list. A skipped step retains its reason. The final report distinguishes what the agent verified from what remains unknown.

Skill persistence differs by host. Use your host's supported way to keep instructions active, or invoke the skill again when needed.

Next: [Route work through `poteto-mode`](./02-poteto-mode.md).
