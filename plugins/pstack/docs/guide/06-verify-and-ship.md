# Verify the result and open a PR

The [Prove It Works principle](../../skills/principle-prove-it-works/SKILL.md) requires a check against the real artifact before an agent reports success. This page explains how to state that check. It then covers app verification and formal properties, followed by performance claims and authorized delivery.

A repeatable verification workflow lets the agent check its work before asking you to inspect the result. Additional workers help only when they can run meaningful checks and report their limits.

![A prototype plane flies a real test course while she times it with a stopwatch and robots film and checklist the run; the terminal reads verify: pass, evidence: captured.](./images/verification.jpg)

## State the finish condition up front

Put what done means in the first prompt, in whatever words fit:

```text
/poteto-mode add json output to this command. text output stays byte-identical, the json parses, both run against the sample project. show me the evidence.
```

The agent now has explicit checks it can run. When the reply comes back, it should carry the exact commands and outputs. If a check couldn't run, a good reply says "inconclusive". A confident reply without evidence is a warning sign.

Match the check to the change:

- A CLI change runs the real command.
- A UI change walks the changed flow in the running app. When it must match a reference pixel for pixel, the [Visual parity playbook](../../skills/poteto-mode/playbooks/visual-parity.md) diffs screenshots against a frozen baseline instead of judging by eye.
- A parser or migration replays a saved input.
- A perf change compares before and after profiles.
- A storage change reads back the written value.

Ask for an artifact you can inspect. A test result can show the failure before the fix and the pass after it. A video can show the same app interaction before and after. If the fix has merged, rerun the check on the merged revision.

For a small diff you don't fully trust, [`/blast-radius`](../../skills/blast-radius/SKILL.md) finds what it could break elsewhere. It finds the one fact that makes the change safe and proves that fact by running code, not by arguing for it.

## Vet a measured number with `/benchmark-checklist`

A comparison between measurements is the easiest evidence to get wrong by accident. A warm cache, a debug build on one side, or work that never ran inside the timed region can each produce a convincing speedup. Before you report or act on a number, type:

```text
/benchmark-checklist vet the export speedup before it goes in the pr
```

[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) asks seven questions and wants evidence from a run for each:

1. What limits the number, and why isn't it double?
2. Did every side run tuned the way production runs?
3. Does the result break a physical limit, like disk bandwidth or core count?
4. Did anything error or return wrong output?
5. Does it reproduce over alternating runs, with a median and a range?
6. Does it matter end to end, on the path a user waits on?
7. Did the work actually happen inside the timed region?

The verdict is `faster`, `slower`, `no measurable difference`, or `inconclusive`. It includes the run count and observed range, then names what limited performance. It says inconclusive when it can't name the limiter or a side ran untuned. `/poteto-mode` already runs the checklist inside the Perf issue and Hillclimb playbooks, so you type it yourself when you measured something outside them, or when someone else's number looks too good. It's the working form of the [Explain the Number principle](../../skills/principle-explain-the-number/SKILL.md).

## Create a project verification skill

The UI bullet above hides a real requirement. The agent needs a scripted way to drive your app. If your project has one, great. If not, run:

```text
/create-verification-skill
```

[`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) inspects how users interact with the app and how the app starts locally. It selects an available way to drive the real behavior, preferring existing controls. It also checks what evidence proves the result and whether isolated instances can run concurrently. It asks only for information the repository and available tools cannot provide.

It writes `.agents/skills/verify-<app>/` for Codex or Antigravity, or `.claude/skills/verify-<app>/` for Claude Code. The instructions contain the exact Launch, Doctor, Drive, Evidence, and Cleanup sections. A Helpers section describes any scripts it supplies. A feature map under `features/` connects each app feature to its proof. The [worked feature map example](../../skills/create-verification-skill/references/feature-map-example/) shows the index and four required H2 headings in each feature file.

Before handoff, the generator starts the app and runs the doctor check. It drives one feature and captures the result, then cleans up and confirms that the evidence remains available. A failed proof leaves the generated workflow unverified.

From then on, "verify it in the app" is a step any agent can execute, in this repo, with no setup conversation. Name it in the prompt when you want the proof in a specific form:

```text
/poteto-mode build the bulk-archive action. use /verify-<app> to verify your changes and show me a video and screenshots as proof.
```

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

Once the verification skill works, [`/swarm`](../../skills/swarm/SKILL.md) can partition a full pass by feature map entry. Independent workers need separate runtime state when the app permits concurrent verification. Otherwise the runtime serializes the live checks.

Keep the verification skill in the repository so people and agents can run the same procedure. Commit it when delivery is authorized. When agents repeatedly write scripts for the same interaction, use [Build the Lever](../../skills/principle-build-the-lever/SKILL.md) to create a reusable control command. Useful controls have these properties:

- A few composable commands, each doing real work, rather than many thin ones.
- A `--dry-run` option on anything destructive.
- Subcommands that reveal features gradually instead of all at once.
- Error messages that say what to do instead.
- Rich `--help` text.
- Output that machines can parse, such as JSON.

Make setup repeatable with known test data and a command that starts the expected environment.

## Keep the verification skill honest

Run the maintenance skill when app changes can make the feature map stale. Schedule it only when you authorize a recurring job and the host supports one:

```text
/maintain-verification-skill
```

[`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md) compares each mapped feature with the source, then drives every feature in one live pass. Its `clean` result means full coverage with no correction needed. Its `changed` result describes proven corrections within the verification skill's directory. Its `blocked` result states what prevented the audit. It creates a PR only when delivery is authorized. Product regressions appear as findings and remain outside this skill's edit scope.

## Prove a property with a formal verification skill

An app verification skill checks the paths it drives. Other failures can depend on event ordering. A lock might expire during a write, or a retry might overlap the original operation. Tests rarely reach every such ordering. For code where such a bug is costly, run:

```text
/create-formal-verification-skill
```

[`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) picks the target from the code: a promise the code makes, where a break harms users and tests rarely reach the case that breaks it. It picks the strongest target, not the easiest to verify. Name an area or a bug to start there instead:

```text
/create-formal-verification-skill the job lease and retry logic. a job must never run twice at once.
```

The property determines the tool. A model checker can explore event ordering in a bounded design model, with TLA+ as a common choice. A verifier that operates on the source can check inputs against the actual code. If no suitable verifier exists, the agent reports that limit and can use generated tests against the real code. Generated tests establish only the cases exercised. A property that must hold for every size may require a proof.

It verifies one property and shows that property failing on a broken variant of the code, because a check you've never seen fail proves nothing. When the current code already breaks the property, you get the counterexample as a short sequence of steps in your code's terms. The property stays as stated, so the finding stays a finding. Product code doesn't change unless you ask.

It writes a project skill that identifies the verified code and the command to check it. Before handoff, the generator makes a scratch change that breaks the property and confirms that the check catches it. The report states the tool and bounds. It also explains each failure and the remaining limits. A pass applies to the stated model or bound.

The skill also records which code each check covers and the commit where the check last matched it. Merges and refactors that skip the skill can leave the check passing on a description of code that's gone. After them, run [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md). It updates the verification from the code, reruns it, shows that each updated check can still fail, and tells you whether each failure is drift in the verification or a bug in the code.

## Open the PR

```text
/poteto-mode open the pr. small ordered commits, evidence in the description.
```

The [Opening a PR playbook](../../skills/poteto-mode/playbooks/opening-a-pr.md) prepares a focused diff in an isolated worktree. It arranges small coherent commits and reviews the prose. Commit, push, and PR creation each require authority from the task. The playbook returns the PR link after authorized delivery.

## Prepare the PR for merge with Babysit

An open PR starts collecting blockers immediately. Checks fail, reviewers comment, trunk moves. Hand that churn to the [Babysit playbook](../../skills/poteto-mode/playbooks/babysit.md):

```text
/poteto-mode babysit this pr. get it green.
```

Babysit uses the bundled GitHub watcher or an available Origin CLI to inspect the PR. It resolves conflicts before review findings, then handles failing checks. It batches known fixes into an authorized push so the checks restart once. A dismissed finding requires evidence. A status request returns status without starting the repair loop:

```text
/poteto-mode check on pr 123. anything outstanding?
```

Babysit stops when the PR is ready for merge. Merging requires a separate request.

## Land the stack with Shipping

When you are ready to authorize merge, say so:

```text
/poteto-mode land the stack.
```

The [Shipping playbook](../../skills/poteto-mode/playbooks/shipping.md) requires merge authority and current verification for every PR it lands. An independent verifier checks the behavior against the current revision when the host supports delegation. If independent verification is required but unavailable, the run reports the gap. Shipping merges the contiguous verified portion of the stack in dependency order. An unverified prerequisite stops later PRs from merging.

Next: [Run work while you sleep](./07-overnight.md).
