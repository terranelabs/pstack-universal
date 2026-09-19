### Autonomous run

**You own the exit condition. Define done, then drive to it without stopping.**

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero).
2. Read **pstack-runtime** and use the host's native event wait, task heartbeat, or scheduler. An event to watch (CI, a merge, a ref advancing) gets an event watcher with a long time-based heartbeat as fallback. Without a supported wake primitive, continue only while the current session can wait safely and state the continuation needed. Do not create a hidden daemon.
3. Each iteration makes the smallest change the evidence justifies and verifies it against the predicate. Commit only when the user authorized commits. Discard changes that did not help. Belt-and-suspenders that "might help" gets reverted, not left to ride.
   Sequence the work via the **sequence-verifiable-units** principle skill, verifying each unit before the next instead of batching checks at the end.
4. Address in-scope broken skills, related bugs, flaky verifiers, review noise, tooling failures, and fixable drift via poteto-mode. Do not silently expand into unrelated fixes or open side PRs without authorization. Ask only about irreversible actions, genuine product or preference calls no experiment can settle, or a real dead end. Keep the predicate as the main drive.
5. Checkpoint every iteration via the **show-me-your-work** skill, a row for what changed and whether the predicate moved.
6. Stop when the predicate is met. A plateau is not a stop, so keep going and pivot your approach to push past it. Surface a genuine dead end rather than spinning, and never relax the predicate to declare victory.

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state.
