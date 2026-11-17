# BUILDER_HANDOFF

**Status:** START
**Phase:** 2 : Accounts, subscriptions, and retention (publish)
**phase_id:** 2
**assignment_id:** P2-PUBLISH-001
**phase_type:** BUILD
**Builder agent ID:** bc-3467dc4a-c7ee-539f-9d04-8640a675ef90
**Branch:** `phase-2-accounts`

Objective: publish accepted Phase 2 work from **P2-BUILD-001** (`0a002c0`) by pushing `phase-2-accounts` and opening one PR into `main`.

## Steps

1. Read BUILDER.md and PHASE_LOG.md; stop if **P2-PUBLISH-001** is already COMPLETE or BLOCKED.
2. Confirm assignment **P2-BUILD-001** is COMPLETE with P2-D1–D3 PASS at commit `0a002c0` (local branch on this Builder VM).
3. `git fetch origin main` and ensure handoff on `main` matches this START assignment (pull planner commit if needed); do not merge `main` into the feature branch unless required to resolve conflicts.
4. Push `phase-2-accounts` to `origin` with upstream tracking.
5. Open or update a single PR: base `main`, head `phase-2-accounts`, title/body per Planner template below.
6. Append COMPLETE to PHASE_LOG.md with PR URL and head SHA; notify Planner only. Do not merge.

## Definition of done

- P2-PUB-D1: `origin/phase-2-accounts` contains commit `0a002c0` (or descendant with same Phase 2 deliverables).
- P2-PUB-D2: exactly one open PR into `main` from `phase-2-accounts` with URL recorded.

## Git permissions

Git permissions: Commit: Yes (PHASE_LOG only) | Push: Yes (`phase-2-accounts` → `origin`) | PR: Yes | Merge: No | Deployment: No

## PR template

**Title:** `feat(phase-2): accounts, subscriptions, and retention`

**Body summary:** P2-BUILD-001 — simulated registration/login, saved/followed state, paywall and plans, introductory offer, simulated checkout and confirmation, account hub, billing/plan changes, cancellation reasons, retention module, demo reset/time controls, device-switch simulation, account-support chat. P2-D1–D3 PASS at `0a002c0`. Merge awaits Planner approval.

Do NOT proceed past this assignment without checking in.
