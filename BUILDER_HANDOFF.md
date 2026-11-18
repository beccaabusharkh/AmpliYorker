# BUILDER_HANDOFF

**Status:** START
**Phase:** 3 : Amplitude instrumentation and product connections (publish)
**phase_id:** 3
**assignment_id:** P3-PUBLISH-001
**phase_type:** BUILD
**Builder agent ID:** bc-08e3bbe4-9fe1-557c-a303-74c7a8cfe114
**Branch:** `phase-3-instrumentation`

Objective: publish accepted Phase 3 work from **P3-BUILD-002** (`4fd7687`) by pushing `phase-3-instrumentation` and opening one PR into `main`. No product changes unless required to resolve a push/PR blocker.

## Steps

1. Read BUILDER.md and PHASE_LOG.md; stop if **P3-PUBLISH-001** is already COMPLETE or BLOCKED.
2. Confirm assignment **P3-BUILD-002** is COMPLETE with P3-D1–D3 PASS at commit `4fd7687` (local branch on this Builder VM). If your VM head differs, publish the COMPLETE tree that contains the accepted instrumentation deliverables; record the published head SHA in PHASE_LOG.
3. `git fetch origin main` and ensure handoff on `main` matches this START assignment (pull planner commit if needed); merge `origin/main` into `phase-3-instrumentation` only if required for a clean push.
4. Push `phase-3-instrumentation` to `origin` with upstream tracking. Do not force-push.
5. Open exactly one PR: base `main`, head `phase-3-instrumentation`, title/body per template below.
6. Append COMPLETE to PHASE_LOG.md with push result, PR URL, and head SHA; commit and push that log append on the feature branch.
7. Notify Planner with assignment_id, status, PR URL, and head SHA. Do not merge.

## Definition of done

- **P3-PUB-D1:** `origin/phase-3-instrumentation` contains commit `4fd7687` (or descendant with the same Phase 3 instrumentation deliverables).
- **P3-PUB-D2:** Exactly one open PR into `main` from `phase-3-instrumentation` with URL recorded in PHASE_LOG.

## Git permissions

Git permissions: Commit: Yes (PHASE_LOG on feature branch) | Push: Yes (`phase-3-instrumentation` → `origin`) | PR: Yes | Merge: No | Deployment: No

## PR template

**Title:** `feat(phase-3): Amplitude Unified instrumentation`

**Body summary:** P3-BUILD-002 — `@amplitude/unified` with single `initAll()`, custom events from `custom-events.yml`, Session Replay masking, identity rules, no Statsig/experiments. P3-D1–D3 PASS at reviewed commit. Merge awaits Planner approval via Slack `Approve` naming this PR.

Do NOT proceed past this assignment without checking in.
