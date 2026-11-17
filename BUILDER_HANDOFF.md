# BUILDER_HANDOFF

**Status:** START
**Phase:** 2 : Accounts, subscriptions, and retention
**phase_id:** 2
**assignment_id:** P2-BUILD-001
**phase_type:** BUILD
**Builder agent ID:** bc-3219cf40-a75c-507c-a345-62219ac5994e
**Branch:** phase-2-accounts

Objective: add simulated accounts, subscription, paywall, retention journeys, and account-management flows with browser-persisted state while keeping real auth/payments out of scope and deferring Amplitude/Statsig to later phases.

## Prerequisites

1. Read BUILDER.md, AGENTS.md, PROJECT_PLAN.md, DECISIONS.md, and PHASE_LOG.md; stop if **P2-BUILD-001** already has COMPLETE or BLOCKED.
2. Confirm `main` is deployed at `https://beccaabusharkh.github.io/AmpliYorker/` with Phase 1 discovery features live.
3. Read `docs/2/SPEC.md` when status is READY; if missing, follow PROJECT_PLAN Phase 2 deliverables and label all simulations explicitly.
4. Create or switch to `phase-2-accounts` from `main` without disturbing unrelated work.

## Steps (summary)

Implement PROJECT_PLAN Phase 2 deliverables: persona storage, registration/login/logout, saved articles and followed writers, device-switch simulation, paywall + plans/trials/offers, simulated checkout and subscription lifecycle (active/trial/expired/canceled), billing edits, cancellation reasons, account-support chat, demo reset and time controls, and retention reminders/offers for seeded declining-engagement profiles.

## Definition of done

- P2-D1: `pnpm typecheck` exits 0.
- P2-D2: `pnpm build` exits 0.
- P2-D3: smoke — seeded registered-reader persona selects an introductory offer, completes simulated checkout, refresh on confirmation shows active access.

## Git permissions

Git permissions: Commit: Yes (`phase-2-accounts` only) | Push: No | PR: No | Merge: No | Deployment: No

Do NOT proceed past this assignment without checking in.