# Understand the code before changing it

Editing code you don't understand is how subtle regressions ship, and that's as true for the agent as for you. Agents usually fail in one of two ways. They misread what you want, or they don't have the context to do the work right. [What goes in a prompt](./02-poteto-mode.md#what-goes-in-a-prompt) handles the first. This page handles the second.

`/how` explains the current behavior. `/why` reconstructs the reasons for the design. `/teach` combines those findings into an explanation. `/recall` rebuilds recent context on a topic. Each skill cites evidence you can inspect.

![A detective studies a machine blueprint with a magnifying glass while robots fetch case files; the evidence board behind her links clues under /how and /why.](./images/understanding.jpg)

## Investigate before editing

When the cause is unclear, request an investigation before edits:

```text
/poteto-mode investigate why background jobs time out every few hours. give me what we know, what data you used, and your best hypotheses. don't change any code yet.
```

"don't change any code yet" routes this to the [Investigation playbook](../../skills/poteto-mode/playbooks/investigation.md). It runs `/how`, adds `/why` for questions about motivation, and returns a cited explanation. For a choice between options, it returns a recommendation with a comparison table. Asking "what data you used" makes the agent separate its evidence from its guesses. When the findings point at a fix, start the fix as a new task.

## Trace behavior with `/how`

```text
/how do we dedupe notifications? is there an n+1 when we look up subscribers?
```

[`/how`](../../skills/how/SKILL.md) reads the code and explains its runtime flow. It names the types and behavior that matter to your question. For a large subsystem, it can delegate separate source investigations when the host supports them. Otherwise it reads sequentially and reports that limit.

## Dig up history with `/why`

```text
/why was the retry limit set to five? does the reason still hold?
```

[`/why`](../../skills/why/SKILL.md) starts with source control. It queries additional evidence through the tools available to the active host. The report cites its sources and separates direct evidence from inference. It also reports searches that found no record of a reason.

The two compose naturally. `do why first then how` is a good prompt when you suspect the history explains the mess.

## Actually understand it with `/teach`

```text
/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.
```

[`/teach`](../../skills/teach/SKILL.md) is for when a summary isn't enough. It runs `/how` and `/why`, for a small change maybe just one of them, and weaves the findings into a plain explanation that builds up diagram by diagram. The "convince me" framing is worth reusing. It turns the explanation into an argument you can test instead of a tour.

It works on the agent's own choices too:

```text
/teach me why you implemented it this way and not with a queue. what did you trade off, and why?
```

Teaching helps the agent as much as you. An agent that has to explain its work must read the code and back each claim with evidence, instead of stating it confidently and moving on.

## Rebuild your own context with `/recall`

```text
/recall catch me up on the export work from last week
```

[`/recall`](../../skills/recall/SKILL.md) rebuilds recent context using history the host exposes within the task's scope. It checks that history against current evidence and returns a brief with the resume point. It uses only the current conversation when no authorized history source is available. It never guesses a transcript path.

```text
/recall my work on the virtualized list from yesterday, then read this bug report.
```

Use the Session pickup playbook below to resume a specific chat.

## Take over prior work with Session pickup

When another agent (or you, last week) left a branch before finishing it:

```text
/poteto-mode take over this branch. read the decision log, figure out what's done, and continue from there. don't redo finished work.
```

The [Session pickup playbook](../../skills/poteto-mode/playbooks/session-pickup.md) reconstructs the branch state from the available record. It identifies the resume point and verifies inherited claims against the original goal before continuing. Historical notes explain decisions. Current files establish the present state.

**Pitfall:** don't skip this page's skills because "the agent will read the code anyway." An agent that starts editing without a traced model tends to fix the symptom at the first plausible spot. `/how` first is cheaper than the second bug.

Next: [Design the change](./04-design.md).
