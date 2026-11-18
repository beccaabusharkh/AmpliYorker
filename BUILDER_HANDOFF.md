# BUILDER_HANDOFF

**Status:** START
**Phase:** 4 : Statsig gates and experiments (publish)
**phase_id:** 4
**assignment_id:** P4-PUBLISH-001
**phase_type:** BUILD
**Builder agent ID:** bc-08e3bbe4-9fe1-557c-a303-74c7a8cfe114
**Branch:** `phase-4-statsig`

Objective: publish accepted Phase 4 work from **P4-BUILD-001** (`53abe42`) by pushing `phase-4-statsig` and opening one PR into `main`. No product changes unless required to resolve a push/PR blocker.

## Steps

1. Read BUILDER.md and PHASE_LOG.md; stop if **P4-PUBLISH-001** is already COMPLETE or BLOCKED.
2. Confirm assignment **P4-BUILD-001** is COMPLETE with P4-D1–D3 PASS at commit `53abe422ea485ae7ebcf0892081ca45d3a72e9bb` (local branch on this Builder VM). If your VM head differs, publish the COMPLETE tree that contains the accepted Statsig deliverables; record the published head SHA in PHASE_LOG.
3. `git fetch origin main` and ensure handoff on `main` matches this START assignment (pull planner commit if needed); merge `origin/main` into `phase-4-statsig` only if required for a clean push.
4. Push `phase-4-statsig` to `origin` with upstream tracking. Do not force-push.
5. Open exactly one PR: base `main`, head `phase-4-statsig`, title/body per template below.
6. Append COMPLETE to PHASE_LOG.md with push result, PR URL, and head SHA; commit and push that log append on the feature branch.
7. Notify Planner with assignment_id, status, PR URL, and head SHA. Do not merge.

## Definition of done

- **P4-PUB-D1:** `origin/phase-4-statsig` contains commit `53abe42` (or descendant with the same Phase 4 Statsig deliverables).
- **P4-PUB-D2:** Exactly one open PR into `main` from `phase-4-statsig` with URL recorded in PHASE_LOG.

## Git permissions

Git permissions: Commit: Yes (PHASE_LOG on feature branch) | Push: Yes (`phase-4-statsig` → `origin`) | PR: Yes | Merge: No | Deployment: No

## PR template

**Title:** `feat(phase-4): Statsig client gates and experiments`

**Body summary:** P4-BUILD-001 — Statsig client SDK, identity mapping, forced demo overrides, local exposure inspector, treatments on paywall/subscribe/home/retention; preserves Phase 3 Amplitude instrumentation. P4-D1–D3 PASS at reviewed commit `53abe42`. Merge awaits Planner approval via Slack `Approve` naming this PR.

Do NOT proceed past this assignment without checking in.
