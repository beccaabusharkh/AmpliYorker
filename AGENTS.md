# Agent index

| Agent name | Instructions file | Active prompt file |
| --- | --- | --- |
| Planner | `PLANNER.md` | `PROJECT_PLAN.md` |
| Builder | `BUILDER.md` | `BUILDER_HANDOFF.md` |
| UX | `UX.md` | `UX_HANDOFF.md` |

Status `START` means work; Status `IDLE` means stop.
Use one Builder thread; never start replacements.
Only the Planner may communicate with the human; Builder and UX report only to the Planner through assigned files or agent messages.
Default git permissions to none for every agent; only the Builder may perform explicitly delegated git actions for the current phase and assignment.
