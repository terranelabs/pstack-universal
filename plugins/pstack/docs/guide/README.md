# The pstack guide

pstack works best when you stop micromanaging the agent. You describe what you want and how you'll know it's done. `/poteto-mode` picks the playbook, runs the other skills as the steps need them, and shows you the evidence. This guide teaches that habit with realistic prompts.

The guide follows a task through these pages:

1. [Set up pstack](./01-setup.md). Install the plugin and configure roles when needed.
2. [Route work through `/poteto-mode`](./02-poteto-mode.md). State a goal and its acceptance check.
3. [Understand the code](./03-understand.md). Investigate behavior and rationale before editing.
4. [Design the change](./04-design.md). Test open questions with prototypes and compare designs.
5. [Build and clean the change](./05-build-and-clean.md). Apply the build playbooks and review the diff.
6. [Verify and ship](./06-verify-and-ship.md). Collect evidence of behavior and check measured claims. Delivery requires authority.
7. [Run work while you sleep](./07-overnight.md). Establish the finish condition and record decisions. Use continuation tools the host exposes.
8. [Steer with principle names](./08-principles.md). Use the 24 principles to change a concrete decision.
9. [Make it yours](./09-make-it-yours.md). Adapt a mode and prevent recurring mistakes. Evaluate skill changes before relying on them.
10. [Recipes and pitfalls](./10-recipes-and-pitfalls.md). Use example prompts and recognize common failures.

Read the pages in order the first time. After that, each page stands alone.

When you're stuck, or can't tell which skill fits, type [`/poteto-help`](../../skills/poteto-help/SKILL.md) with your question:

```text
/poteto-help which skill should i use to review this branch?
```

It answers, hands you a prompt to send, and links the skill or guide page the answer came from. It doesn't start the work, because a pstack run spends real tokens, so you send the prompt when you're ready. It runs only when you type it.

## If you only remember one thing

Give the agent a goal and a way to check it, in your own words:

```text
/poteto-mode the export writes duplicate rows when a retry lands mid-run. repro first, then fix and verify.
```

You don't need to name a playbook or list skills. "repro first" and a checkable outcome are all the routing signal `/poteto-mode` needs. It matches the Bug fix playbook, copies the steps into a todo list, and calls the right skills as each step fires.

Next: [Set up pstack](./01-setup.md).
