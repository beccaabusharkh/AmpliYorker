# BUILDER_HANDOFF

**Status:** IDLE
**Phase:** 1 : Discovery, reading, and engagement (publish)
**phase_id:** 1
**assignment_id:** P1-PUBLISH-001
**phase_type:** BUILD
**Builder agent ID:** bc-3219cf40-a75c-507c-a345-62219ac5994e
**Branch:** phase-1-discovery

Objective: publish accepted Phase 1 work from **P1-BUILD-001** (`a99f1a5`) by pushing `phase-1-discovery` and opening one PR into `main`.

## Steps

1. Read BUILDER.md and PHASE_LOG.md; stop if **P1-PUBLISH-001** is already COMPLETE or BLOCKED.
2. Confirm assignment **P1-BUILD-001** is COMPLETE with P1-D1–D3 PASS at commit `a99f1a5`.
3. Push `phase-1-discovery` to `origin` with upstream tracking.
4. Open or update a single PR: base `main`, head `phase-1-discovery`, title/body per Planner template below.
5. Append COMPLETE to PHASE_LOG.md with PR URL and head SHA; notify Planner only. Do not merge.

## Definition of done

- P1-PUB-D1: `origin/phase-1-discovery` contains commit `a99f1a5` (or descendant with same Phase 1 deliverables).
- P1-PUB-D2: exactly one open PR into `main` from `phase-1-discovery` with URL recorded.

## Git permissions

Git permissions: Commit: Yes (PHASE_LOG only) | Push: Yes (`phase-1-discovery` → `origin`) | PR: Yes | Merge: No | Deployment: No

## PR template

**Title:** `feat(phase-1): discovery, search, and engagement`

**Body summary:** P1-BUILD-001 — search/topic/author routes, expanded corpus, recommendations, reading progress, media, simulated newsletter/ads/sponsored labels, discovery chat. P1-D1–D3 PASS at `a99f1a5`. Merge awaits Planner approval.

Do NOT proceed past this assignment without checking in.
