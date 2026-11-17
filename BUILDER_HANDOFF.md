# BUILDER_HANDOFF

**Status:** START
**Phase:** 2 : Accounts, subscriptions, and retention
**phase_id:** 2
**assignment_id:** P2-BUILD-001
**phase_type:** BUILD
**Builder agent ID:** bc-3219cf40-a75c-507c-a345-62219ac5994e
**Branch:** `phase-2-accounts`

Objective: add simulated account, subscription, retention, and account-management journeys with persistent browser state on top of Phase 1 discovery; no Amplitude or Statsig yet.

## Prerequisites

1. Read BUILDER.md, AGENTS.md, PROJECT_PLAN.md, DECISIONS.md, and PHASE_LOG.md; stop if **P2-BUILD-001** already has COMPLETE or BLOCKED.
2. Branch from current `main` (Phase 1 merged); production site `https://beccaabusharkh.github.io/AmpliYorker/`.
3. Read `docs/2/SPEC.md` when status is READY; if missing, follow PROJECT_PLAN Phase 2 deliverables and DECISIONS.md interim UX waiver (label every simulated flow: registration, payment, billing, device switch, account chat).
4. Create or switch to `phase-2-accounts` from `main`.

## Steps

1. **Personas & session state:** define at least two preset personas in repo data (e.g. anonymous visitor, **registered reader** with id suitable for smoke); persist active persona, subscription, saved/followed sets, and engagement counters in `localStorage` with a versioned schema and simulation labels in UI.
2. **Registration / login / logout:** hash routes (e.g. `#/account/register`, `#/account/login`) with forms using preset/demo values only—no real passwords collected; successful login switches persona; logout clears session to anonymous defaults without wiping unrelated keys unless reset says so.
3. **Saved articles & followed writers:** toggle save/follow on article and author surfaces; reflect state after refresh on same browser.
4. **Paywall & plans:** mark at least one premium article or section behind paywall for non-subscribers; `#/subscribe` or equivalent shows plan cards (monthly/annual) and **introductory offer** copy for the registered-reader smoke persona.
5. **Checkout (simulated):** offer selection leads to `#/checkout` with simulated payment fields (preset values, disclose “Simulated payment”); submit stores active subscription locally and navigates to `#/checkout/confirmation` with success state.
6. **Activation & account hub:** `#/account` shows subscription status, plan name, renewal date (derived from local clock + seeded subscription), links to billing and cancellation; subscriber can open paywalled content.
7. **Billing & plan changes:** forms to edit simulated billing profile and switch plan (local state only); show confirmation toasts or inline success.
8. **Cancellation:** capture at least one cancellation reason enum; end state shows canceled/expired access with clear simulation label.
9. **Retention:** for a seeded **declining-engagement** profile, surface renewal offer or reminder module on home or account (deterministic copy from repo data).
10. **Device switch (simulated):** account action that copies/export persona snapshot instructions or applies a second device label in UI—local only, labeled simulation.
11. **Demo reset & time controls:** developer-facing or account menu controls to reset demo data and advance “subscription time” for trial/expiry demos; must stay consistent across paywall, renewal date, and retention modules.
12. **Account-support chat:** scripted panel (like discovery chat) with “Simulated account support” header and FAQ from repo JSON.
13. Update shell navigation for implemented account/subscribe routes only; keep Phase 1 journeys working.
14. Run `pnpm typecheck`, `pnpm build`, smoke on production preview (`pnpm preview --host 127.0.0.1 --port 4173 --strictPort`).
15. Commit Phase 2 files on `phase-2-accounts`; log COMPLETE or BLOCKED in PHASE_LOG.md.

## Definition of done

- P2-D1: `pnpm typecheck` exits 0.
- P2-D2: `pnpm build` exits 0.
- P2-D3: one smoke check on production preview: load or select the **seeded registered-reader persona**, choose the **introductory offer**, submit simulated checkout, land on confirmation, **refresh** confirmation URL, and observe active subscriber access (paywall lifted or account status shows active). Record persona id, route URLs, and observed strings in PHASE_LOG.md.

## Allowed files and commands

- Edit/create: `package.json`, `pnpm-lock.yaml` (only if required—no analytics SDKs), `index.html`, `tsconfig*.json`, `vite.config.ts`, `src/**`, `public/**`; append `PHASE_LOG.md`.
- Do not edit Planner-owned files or `.github/workflows/*` except incidental route fixes.
- Commands: `pnpm install` (if lock changes), `pnpm typecheck`, `pnpm build`, `pnpm preview` for smoke only.

## Git permissions

Git permissions: Commit: Yes | Merge: No | Push: No | PR: No | Deployment: No

- Local branch `phase-2-accounts` only.
- No push until a separate Planner publish assignment.

## Scope limits

- No `@amplitude/unified`, Statsig, real auth, payments, email, or cross-device sync.
- Paywall/offer **defaults stay local** (no live experiment SDK) until Phase 4.
- Defer exhaustive account-state matrices to Phase 5.

Do NOT proceed past this phase without checking in.