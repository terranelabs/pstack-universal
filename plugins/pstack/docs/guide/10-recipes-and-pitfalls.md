# Recipes and pitfalls

Prompts worth copying, then the mistakes everyone makes once. Swap in your own paths and finish conditions. The recipes are deliberately informal. That's how they get typed in practice, and the skills read intent fine.

![She tastes a finished dish while robots cook from a recipe box, with pinned cards for understanding, testing, and iteration above the counter.](./images/recipes.jpg)

## Understand an unfamiliar subsystem

```text
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
```

Mechanics first, history second. Each skill's report tells you which sources it searched, so you know what the answer is grounded in.

## Restate a noisy report before touching code

```text
/poteto-mode read this thread. restate the underlying issue in your own words, in plain english. don't change any code yet.
```

A misreading shows up in the restatement, where it costs one message to correct. Keep your own theory to yourself until the agent has stated its own. `/in-your-own-words` asks for the restatement alone, with no playbook.

## Aim a task before it starts

```text
/sharpen write the onboarding doc for the new billing service.
```

The agent asks how an expert would do the task, what you're really after, and whether the ask says too much or too little. It keeps one outside check that the result is right, then does the work.

## Prototype before you pick

```text
/poteto-mode prototype a few options for the settings layout. put them behind a switcher and send me screenshots of each.
```

You pick from things that run, not from descriptions. The agent answers its own layout and timing questions along the way.

## Turn a settled design into a plan

```text
/poteto-mode turn this design into a plan. small verifiable PRs, each with its own proof.
```

Ask only after the design settles. The plan is the deliverable, and it names the playbook that will execute it.

## Get a second opinion on a design

```text
ask /arena for a second opinion on this thread and our approach
```

Your current design becomes one candidate among several, and the synthesis tells you whether the panel found something better or confirmed what you had. It costs little next to a design that is expensive to reverse.

## Check independent slices in parallel

```text
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
```

Each worker owns one package. The parent waits for every slice and returns one `PASS`, `ISSUES`, or `BLOCKED` report instead of raw worker dumps.

## Review a branch skeptically

```text
/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.
```

"don't change anything yet" limits the work to review. The nitpick rule asks reviewers to focus on defects with observable consequences.

## Fix a bug through a failing test

```text
/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
```

"if there's a cheap test path" matters. Forcing a test through brittle mocks proves less than running the real command, and the playbook is allowed to say so.

## Repro and fix a report with proof

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

"if it repros on main" lets the run stop early when the bug is already gone. The video lets you check the fix before you read the diff.

## Prove a property tests rarely reach

```text
/create-formal-verification-skill the retry queue. a message must never be delivered twice.
```

You get one property checked in every case within a stated scope, a counterexample in your code's terms if the code already breaks it, and a project skill the next agent runs on any change to that code.

## Vet a number before you post it

```text
/benchmark-checklist vet this 40% speedup before it goes in the pr description
```

You get faster, slower, no measurable difference, or inconclusive, with the run count, the range, and what limits the number.

## Stop correcting the same mistake

```text
/correct agents keep adding new config flags without registering them in the schema
```

The fix lands in the repo as architecture, a type, a lint, or a test, so the next agent can't make the mistake.

## Ask how without starting the work

```text
/poteto-help how do i get poteto-mode to stay on every turn?
```

You get an answer, a prompt to send, and a link to the source. Nothing runs until you send that prompt.

## Keep a run honest while you're away

```text
im going to bed, keep going autonomously until every fixture passes. do not stop. keep a decision log i can audit in the morning.
```

The full contract is on the [overnight page](./07-overnight.md). The short form works once the task and finish condition are already in the conversation.

## Redirect a drifting run

Steering prompts are one line:

```text
i said the goal is to repro. i did not ask for a fix yet.
```

```text
apply prove it works. show me the real output, not the build log.
```

```text
/unslop that, no emdashes
```

You rarely need more words. You need the right name, and [the principles page](./08-principles.md) is the vocabulary.

## Get the reply in plain words

```text
/bro
```

That's the whole prompt. [`/bro`](../../skills/bro/SKILL.md) restates the last message like one human talking to another, no jargon, shorter. Use it when a reply is technically thorough and you still don't know what it said.

## Catch up on a chat you left running

```text
/ketchup
```

[`/ketchup`](../../skills/ketchup/SKILL.md) tells you in plain words what changed since your last message, then lists each call waiting on you with its pick, evidence, and risk. It changes nothing while it reports.

## The pitfalls

- **Enumerating skills in the prompt.** "use /how then /architect then /arena" reorders steps the playbook already sequences. State the goal and constraints. Name a skill only to override a default.
- **A vague finish condition.** "make it better" gives an autonomous run nothing to check. Give a command or artifact that can pass or fail.
- **Leading with your theory of the cause.** A stated guess narrows the search. Ask the agent to restate the problem first, then share your hunch.
- **Taking the first design.** Compare working prototypes or use `/architect` before a costly decision.
- **Reviewing a plan before testing its assumptions.** Use prototypes to answer technical questions, then review the resulting change.
- **Parallel writers in one worktree.** Give each attempt its own worktree or directory, with one owner for each file.
- **Looping without verification.** Prove the verification procedure before relying on repeated autonomous work.
- **Trusting an unvetted number.** Run `/benchmark-checklist` before reporting a measured performance change.
- **Repeating a correction in chat.** `/correct` can encode a recurring rule in the repository through an authorized change.
- **Using `/arena` for coverage.** `/arena` repeats one design or code brief, then picks a base and grafts the best parts. `/swarm` partitions slices or declared race arms and aggregates one report.
- **Accepting every review comment.** Bots and humans both file real catches and noise in one list. `/interrogate` sorts findings into `Act on` and `Dismissed` groups with reasons, and you can override either way.
- **Treating `auto` as a model slug.** `auto` and `inherit-parent` mean "omit the model field so the subagent inherits the parent chat model." [Setup](./01-setup.md) covers the roles.
- **Reporting success off a green build.** A build proves it compiles. Ask for the real command, flow, stored value, or profile, and expect the evidence in the reply.
- **Writing a `SKILL.md` freehand.** Route it through the [Authoring or modifying a skill playbook](../../skills/poteto-mode/playbooks/authoring-a-skill.md) so validation and review happen.

That's the guide. If you skipped ahead, go back to [setup](./01-setup.md) and run one real task. The habits stick from use, not from reading.

Back to the [guide index](./README.md).
