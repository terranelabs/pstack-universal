### Worktree and simulator cleanup

**Audit first. Delete only exact, approved targets.** This playbook concerns
user state and is destructive. Read **pstack-runtime** and follow the host's
approval rules even when another pstack playbook encourages autonomy.

1. **Snapshot and audit.** Record disk availability, then run
   `scripts/worktree-audit.sh`. It reads exact paths from `git worktree list`
   and classifies size, age, merge state, uncommitted work, remote state, and PR
   state. Set `PSTACK_TRANSCRIPTS_DIR` only when the host explicitly exposes a
   transcript directory for this workspace.
2. **Resolve active work.** Cross-check candidates against current tasks,
   branches, PRs, and any host-native pinned-task list. An unavailable task list
   is uncertainty, not permission to delete.
3. **Inspect every candidate.** Show tracked changes, untracked files, branch,
   head SHA, merge status, and whether a remote branch or PR preserves the work.
   Never infer safety from age or directory name.
4. **Request approval.** Present the exact paths proposed for removal and what
   would be recoverable. Any tracked or untracked work requires an explicit
   per-target decision. Do not bundle simulator, cache, or IDE-data deletion
   into worktree approval.
5. **Remove the approved set.** Prefer ordinary `git worktree remove <path>`.
   Use `--force` only when the user explicitly approved that exact dirty target.
   Do not run a recursive filesystem delete as a fallback. If ignored build
   artifacts prevent removal, report the residue and request a separate
   decision. Run `git worktree prune` only after the registered worktrees are
   reconciled.
6. **Handle simulators and caches separately.** Inventory stale simulators,
   runtimes, Xcode data, and package caches with read-only commands. Ask for
   exact approval before deletion, and prefer recoverable cleanup mechanisms.
7. **Verify.** Re-list worktrees, re-check disk availability, and report space
   reclaimed plus every path held back.

**Reply:** disk availability before and after, exact worktrees removed, exact
commands used, recoverability, and one-line reasons for every held target.
