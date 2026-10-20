# pstack in Claude Code

This fork uses the same skill tree on every supported host. Claude Code invokes installed skills with a namespace, such as `/pstack:poteto-mode`.

Read [`pstack-runtime`](../../skills/pstack-runtime/SKILL.md) before delegation or other host operations. Use only the tools and accepted fields the active session exposes. If delegation is unavailable, use the runtime's sequential fallback and report the evidence limits.

[`setup-pstack`](../../skills/setup-pstack/SKILL.md) writes the shared project file `.pstack/config.yaml`. Roles inherit the parent model unless the host exposes and accepts an override. This fork does not translate Cursor model identifiers or write model rules into your home directory.

Use scoped history tools or an explicitly supplied transcript path. Do not infer a transcript location or select a session by file age. A missing history tool limits the review to the context available.

The bundled [agents](../../agents/) provide Claude custom agent instructions. Use their names only when the session exposes them. Every operation follows the user's existing permissions. Missing Cursor services do not authorize a replacement external action.
