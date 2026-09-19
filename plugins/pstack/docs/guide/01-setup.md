# Setup

Install the plugin for your host, optionally configure its portable role map,
then run one real task.

## Codex

Add the repository marketplace and install `pstack@pstack-universal`. Start a
new task after installation, then invoke `$setup-pstack` or `$poteto-mode`.

## Claude Code

During development, launch with:

```bash
claude --plugin-dir ./plugins/pstack
```

Installed plugin skills are namespaced. Invoke `/pstack:setup-pstack` or
`/pstack:poteto-mode`.

## Antigravity

Run the repository's installer from the target project:

```bash
/absolute/path/to/pstack-universal/scripts/install-antigravity.sh .
```

Restart Antigravity, confirm the installed skills with `/skills`, then invoke
`/setup-pstack` or `/poteto-mode`.

## Configure roles

`setup-pstack` writes `.pstack/config.yaml`. The same file works on all three
hosts. It defaults to the current parent model and requests three lanes for
arena, architect, and interrogate. A host may lower fan-out to its concurrency
limit or run sequentially when delegation is unavailable.

You can skip setup. Missing configuration is equivalent to `inherit-parent`.

## First task

Try a request with an observable compatibility constraint:

```text
poteto-mode: add a --json flag to this command. Keep text output byte-identical
and verify both modes.
```

The workflow should select the Feature playbook, make the smallest coherent
change, and distinguish what it actually verified from what remains unknown.

Next: [Route work through poteto-mode](./02-poteto-mode.md).
