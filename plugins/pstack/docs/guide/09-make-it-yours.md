# Make it yours

`poteto-mode` reflects one person's working style. You can adapt the shared playbooks and roles to yours. This page covers personal modes and lessons from a session. It also explains how to prevent recurring mistakes and evaluate skill changes.

Start smaller than you think. You don't need many skills on day one, or even this whole plugin. Prompt plainly, watch where agents fail, and add a skill or a check when the same failure shows up twice.

## Generate your own mode with `/automate-me`

```text
/automate-me
```

[`automate-me`](../../skills/automate-me/SKILL.md) can mine scoped history only when the active host exposes it and you authorize that use. Otherwise it works from the current conversation and direct questions. It drafts a project skill in `.agents/skills/` for Codex or Antigravity, or `.claude/skills/` for Claude Code, then runs the draft through [`unslop`](../../skills/unslop/SKILL.md). It commits or opens a PR only when you ask.

Run it again whenever your habits drift:

```text
/automate-me update my mode skill with everything since its last edit
```

Update mode mines only the history since the skill last changed. It keeps rules you haven't contradicted, revises the ones with new evidence, and adds sections only for new patterns.

## Capture a session's lessons with `/reflect`

Right after a task that taught you something, run:

```text
/reflect that took way too long. capture what we learned so the next run doesn't repeat it.
```

[`/reflect`](../../skills/reflect/SKILL.md) uses the available transcript within the current task's scope. When the host permits delegation, independent reviewers propose skill changes. A synthesizer sorts them into `Accepted`, `Rejected`, and `Backlog`. The skill waits for your approval before editing a skill. It reports a limited review when delegation or history is unavailable. Approve a proposal only if it would change a future decision.

## Fix the environment with `/correct`

When you correct agents for the same mistake again and again, the fix belongs in the repo, not in your next prompt. Rank the options by how well they hold:

1. Make the mistake impossible with architecture or a better data structure.
2. Block it with types, or with a lint or CI check whose error names the fix.
3. Catch it with a test.
4. Write it down as a doc or agent rule. Nothing fails when an agent skips a rule, so this comes last.

Human review isn't on the list. A reviewer who must catch the same mistake on every PR is the problem this fixes. [`/correct`](../../skills/correct/SKILL.md) does the work:

```text
/correct agents keep calling the database client directly instead of going through the repository layer
```

It examines recurring mistakes in the evidence available to the task. A class qualifies after at least two occurrences. It proposes or makes the authorized change at the strongest practical level, then shows that the check catches a past mistake. It keeps a table pairing each rule with its enforcement. Commits and external delivery require your authorization.

Run it with no argument and it finds the classes from history on its own. `/reflect` and `/correct` split the work. `/reflect` improves skills from one session. `/correct` changes the repo so a mistake class can't come back. Pair it with `/architect` when the fix is a new boundary. [Run several projects](./07-overnight.md#run-several-projects) has a prompt that does both across a whole repo.

## Author a focused skill

When you already know the workflow you want to capture:

```text
/poteto-mode write a skill for verifying database migrations in this repo
```

Writing a skill matches the [Authoring or modifying a skill playbook](../../skills/poteto-mode/playbooks/authoring-a-skill.md). It uses the host's skill authoring workflow when one is installed and checks the frontmatter and links. Text addressed to an agent needs precise conditions because another agent will execute it as an instruction.

Two special cases have their own generators. A skill that must drive your app and prove behavior is a verification skill, so use [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) and [`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md) instead. A skill that checks a property of your code with a model checker, a proof, or another verifier is a formal verification skill, so use [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) and [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md). [Verify and ship](./06-verify-and-ship.md#prove-a-property-with-a-formal-verification-skill) covers both kinds.

## Write docs to a standard with `/technical-writing`

Skills aren't the only prose you ship. For docs, RFCs, readmes, PR descriptions, and commit messages:

```text
/technical-writing review the readme changes
```

[`/technical-writing`](../../skills/technical-writing/SKILL.md) chooses the document's purpose before editing its prose. It separates tutorials from procedures and reference material. It then checks who acts in each sentence and whether the wording has more than one reading. Use it to review a draft or name it when requesting a document.

## Test a skill change blind

A skill edit affects every future session, so test it like the experiment it is. The same goes for adopting someone else's skill. Check that it makes the agent better on your work before you keep it.

```text
/poteto-mode run the eval playbook on this skill change. same task for both variants, candidates stay blind.
```

When a skill keeps missing and you know what it should do, change and test it in one task:

```text
/poteto-mode update the review skill so it flags missing migrations, and eval the change.
```

Asking for the eval up front keeps the edit honest. A fix written from one bad session tends to overfit that session, and over many edits the skill drifts. The eval catches the drift before it ships.

The [Eval playbook](../../skills/poteto-mode/playbooks/eval.md) limits the observer effect by giving candidates ordinary tasks in sanitized directories. Candidates see neither evaluation labels nor each other's existence. One judge scores outputs under neutral labels. Evidence of the files each candidate read establishes whether it followed the workflow. Candidate claims alone do not establish compliance.

Read every output yourself before accepting the verdict. If you disagree with the judge, suspect the rubric before you suspect your judgment.


**Pitfall:** don't edit a skill during a task because it's misbehaving. Fix it in its own PR and keep the task moving. A skill edit that ships tangled into feature work is invisible to review and impossible to evaluate.

Next: [Recipes and pitfalls](./10-recipes-and-pitfalls.md).
