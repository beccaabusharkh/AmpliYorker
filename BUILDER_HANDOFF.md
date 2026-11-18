# BUILDER_HANDOFF

**Status:** START
**Phase:** 2 editorial redesign
**phase_id:** 2
**assignment_id:** P2-BUILD-EDITORIAL-001
**phase_type:** BUILD
**Builder agent ID:** bc-08e3bbe4-9fe1-557c-a303-74c7a8cfe114
**Branch:** `editorial-redesign`

## Objective

Implement **`docs/2/SPEC.md`** (`READY`, assignment `P2-UX-EDITORIAL-001`) on branch `editorial-redesign` from current `origin/main`. Premium NYT-style home + New Yorker-style articles, 18+ stories, fictional ad campaigns, Ask the Daily assistant, collapsible demo controls. **Preserve** all UC-1…UC-10 journeys, hash routes, Pages base path, Amplitude `initAll`, Statsig catalog, and simulation labels.

## Prerequisites

1. Read `BUILDER.md`, `docs/2/SPEC.md`, `PROJECT_PLAN.md` (P2E-D1–D4), `custom-events.yml`, `DECISIONS.md` 2026-11-18 editorial entry.
2. `git fetch origin main && git checkout -B editorial-redesign origin/main`
3. Secrets in `.env.local` on VM: `VITE_AMPLITUDE_API_KEY`, `VITE_STATSIG_CLIENT_KEY` (team environment).

## Definition of done

| Check | Requirement |
| --- | --- |
| **P2E-D1** | `pnpm typecheck` exits 0 |
| **P2E-D2** | `pnpm build` exits 0 |
| **P2E-D3** | Production preview smoke: home at 390px + 1440px no horizontal overflow; flagship long article scroll past 50% updates sticky progress; Ask the Daily — one discovery + one subscription-help prompt with working links |
| **P2E-D4** | Registered persona save → saved list; premium paywall signed-out; unlock after P2-D3 checkout path |

Implement spec acceptance **P2E-A01–A10** where they extend D3/D4. Document `Read Article` milestone change (drop 10%, add active reading seconds) in `PHASE_LOG.md` and update `custom-events.yml` descriptions if required — **keep event name `Read Article`**.

## Analytics (spec F-09)

- Milestones: **25, 50, 75, 90, 100** once per article view; distinguish preview vs full completion for paywalled content.
- Accumulate `active_reading_seconds` per spec; no raw chat/form PII in payloads.
- Ad viewability/clicks per spec; simulated revenue labels unchanged.

## Allowed files

- `src/**`, `public/**` (especially `public/images/editorial/`), `docs/2/SPEC.md` (typo fixes only if needed), `custom-events.yml` (milestone enum/docs only), append `PHASE_LOG.md`
- Do **not** edit Planner-owned files except `PHASE_LOG.md`

## Commands

`pnpm install`, `pnpm typecheck`, `pnpm build`, `pnpm preview --host 127.0.0.1 --port 4173 --strictPort`

## Git permissions

Git permissions: Commit: Yes | Merge: No | Push: No | PR: No | Deployment: No

Branch `editorial-redesign` only. Report COMPLETE or BLOCKED in `PHASE_LOG.md` to Planner.

## Evidence (BUILD)

Log smoke steps and exit codes; optional screenshots under `docs/evidence/p2-editorial/` (not required for BUILD acceptance).

Do NOT proceed without checking in when BLOCKED on scope conflicts — escalate via PHASE_LOG.