# BUILDER_HANDOFF

**Status:** START
**Phase:** 3 : Amplitude instrumentation and product connections
**phase_id:** 3
**assignment_id:** P3-BUILD-001
**phase_type:** BUILD
**Builder agent ID:** bc-08e3bbe4-9fe1-557c-a303-74c7a8cfe114
**Branch:** `phase-3-instrumentation`

**Planner resume (2026-11-17):** Slack ts `1794959766.742059` — rerun **P3-D3 smoke only**. Prior report at VM commit `573af6d`: **P3-D1** PASS, **P3-D2** PASS, **P3-D3** BLOCKED (missing API key). Credential setup completed per approver; do **not** repeat full implementation unless branch/working tree is missing.

**Resume steps (smoke only):**
1. Confirm local branch `phase-3-instrumentation` at `573af6d` or descendant; if missing, log BLOCKED in PHASE_LOG and stop.
2. Write `VITE_AMPLITUDE_API_KEY` into gitignored `.env.local` from the AmpliYorker environment secret (same name) — never commit or log the value.
3. Run P3-D3 smoke per Definition of done below (`pnpm preview` + inspector evidence).
4. Append COMPLETE or BLOCKED to PHASE_LOG.md; commit on branch if log or `.env.local` staging would leak — commit **only** `PHASE_LOG.md` (never `.env.local`).

If P3-D3 PASS, assignment may be COMPLETE without re-running P3-D1/P3-D2 unless you changed product code.

---

Objective: install `@amplitude/unified`, initialize Analytics + Session Replay (+ Guides & Surveys interfaces where supported) once via `initAll()`, wire custom events from `custom-events.yml`, and preserve existing reader journeys without behavior regressions. No Statsig. No Amplitude Experiment/flags.

## Prerequisites

1. Read BUILDER.md, AGENTS.md, PROJECT_PLAN.md, DECISIONS.md, `custom-events.yml`, and PHASE_LOG.md; stop if **P3-BUILD-001** already has COMPLETE or BLOCKED.
2. Branch from current `main` (`efadb5e` or later; Phase 2 live at `https://beccaabusharkh.github.io/AmpliYorker/`).
3. Read `docs/3/SPEC.md` when status is READY; if missing, follow PROJECT_PLAN Phase 3 + DECISIONS.md interim UX/instrumentation waiver and `custom-events.yml` (exact Title Case event names).
4. Create or switch to `phase-3-instrumentation` from `main`.

## Amplitude product scope (locked for this assignment)

| Product | Status | BUILD requirement |
| --- | --- | --- |
| Analytics (custom events) | INCLUDED | Manual events per `custom-events.yml`; no autocapture for excluded types |
| Session Replay | INCLUDED | `sessionReplay: { sampleRate: 1 }` with masking below |
| Guides & Surveys | INCLUDED | Enable through Unified supported init options if documented; no blocking guide required for BUILD |
| Amplitude Experiment / Feature Flags | EXCLUDED | Do not enable; Statsig is Phase 4 |
| Warehouse, CDP, Activation, other products | EXCLUDED | Record in PHASE_LOG if requested later |

## Replay masking & prohibited fields (apply before Replay samples)

Mask in Session Replay (CSS selectors / SDK privacy config as supported):

- All `input`, `textarea`, `select`
- `#search-input`, checkout payment fields (card/name on checkout page)
- `.discovery-chat` and `.account-support-chat` message areas (add `data-amplitude-mask` on inputs and rendered transcript if needed)

Never send event properties containing: passwords, payment PAN/CVV, full email addresses, raw search query strings, or free-text chat/survey content. Use lengths/ids/enums only (see `custom-events.yml` → `conventions.privacy`).

## Credentials

- API key via `VITE_AMPLITUDE_API_KEY` in **gitignored** `.env.local` (`.gitignore` already excludes `*.local`).
- Add committed `.env.example` with `VITE_AMPLITUDE_API_KEY=` (empty). Do not commit real keys.
- If key missing at smoke time: P3-D1/P3-D2 may still PASS; P3-D3 is BLOCKED with exact note—do not invent a key.

## Architecture

1. **Single init module** — e.g. `src/lib/amplitude/init.ts`: import `{ initAll, track, setUserId, reset }` from `@amplitude/unified`; call **`initAll(apiKey, { ... })`** exactly once with apiKey as **first positional argument** (never `initAll({ apiKey })`).
2. **Init options (baseline):** `serverZone: 'US'`; `analytics: { autocapture: false }` or equivalent so excluded autocapture types in `custom-events.yml` (`Page Views`, `Element Clicks`, `Raw Form Interactions`, `Raw Scroll Events`) are not relied upon; `sessionReplay: { sampleRate: 1 }` plus masks above.
3. **Common properties helper** — e.g. `src/lib/analytics/common.ts`: attach `schema_version: 1`, `occurred_at` (ISO), `anonymous_id`, `reader_id`, `session_id`, `account_state`, `data_origin` (`interactive_demo` \| `seeded_history`), `is_simulated: true`, `is_forced_variant: false`, `demo_run_id`, unique `event_id` per fire (UUID).
4. **Identity rules:** on app boot call `ensureAnonymousIdentity()`; on register/login `setUserId` with stable reader id; on logout fire `Sign Out Completed` then `reset()` and restore anonymous id. Map `account_state` enum to session (anonymous / registered / trial / paid / canceled / expired).
5. Import init from `src/main.ts` **before** first `renderApp` (side-effect init only once).

## Event wiring (minimum for BUILD + full journey coverage)

Implement `track()` for events in `custom-events.yml` at the specified business outcomes (not click-only). Priority order:

1. **Read Article** — article page scroll milestones 10/25/50/75/90/100 on body only; smoke article **`daily-decisions`**.
2. **Search Completed** — after search results computed (`query_length`, not raw query).
3. **Registration Completed** / **Sign In Completed** / **Sign Out Completed** — account flows.
4. **Article Saved** / **Article Unsaved** / **Author Followed** / **Author Unfollowed**.
5. **Newsletter Subscription Completed**; **Media Playback Started/Completed** where players exist.
6. **Paywall Presented**; **Subscription Added To Cart**; **Checkout Started** / **Failed** / **Completed**; **Subscription Activated**; **Trial Started** where applicable; **Subscription Payment Completed** with `revenue_usd` only on successful simulated charges (no duplicate revenue).
7. **Advertisement Viewable** + **Ad Revenue Recorded** (simulated); sponsored **Read Article** with `content_type: sponsored`.
8. **Retention Treatment Presented**; renewal/cancel/billing/plan events on account hub.
9. **Chat Request Submitted** / **Chat Response Delivered** (no message body; intent + lengths only).

Use Title Case event names exactly as in `custom-events.yml`. Defer proving every event in vendor UI to Phase 5; implement hooks in code paths that exist today.

## Steps

1. `pnpm add @amplitude/unified` (pin reasonable `^1`); update lockfile.
2. Add `.env.example`, extend `src/vite-env.d.ts` for `VITE_AMPLITUDE_API_KEY`.
3. Implement init + track helpers + identity synchronization with `src/lib/session.ts` (subscribe or call from existing session mutators).
4. Instrument pages/components without changing visible UX defaults (no new paywall timing; no experiment copy).
5. Run `pnpm typecheck`, `pnpm build`, smoke below on production preview (`pnpm preview --host 127.0.0.1 --port 4173 --strictPort`).
6. Commit on `phase-3-instrumentation`; append COMPLETE or BLOCKED to PHASE_LOG.md.

## Definition of done

- **P3-D1:** `pnpm typecheck` exits 0.
- **P3-D2:** `pnpm build` exits 0.
- **P3-D3:** With `VITE_AMPLITUDE_API_KEY` set in `.env.local`, production preview smoke: open `http://127.0.0.1:4173/AmpliYorker/#/article/daily-decisions`, scroll until **10%** body milestone; observe **exactly one** `Read Article` event in the browser Amplitude development event inspector (or unified debug channel documented in PHASE_LOG) containing `article_id: daily-decisions`, `content_progress_percent: 10`, `data_origin: interactive_demo`, `is_simulated: true`, and current `reader_id`/`anonymous_id`. Record inspector evidence in PHASE_LOG.md.

## Allowed files and commands

- Edit/create: `package.json`, `pnpm-lock.yaml`, `.env.example`, `index.html`, `tsconfig*.json`, `vite.config.ts`, `src/**`; append `PHASE_LOG.md`.
- Do not edit Planner-owned files or `.github/workflows/*` except if required for build (unlikely).

- Commands: `pnpm install`, `pnpm typecheck`, `pnpm build`, `pnpm preview` for smoke only.

## Git permissions

Git permissions: Commit: Yes | Merge: No | Push: No | PR: No | Deployment: No

- Local branch `phase-3-instrumentation` only.
- No push until a separate Planner publish assignment.

## Scope limits

- No Statsig, no `@amplitude/analytics-browser`, no second Amplitude package, no Amplitude experiments/flags.
- Do not change journey outcomes (paywall defaults, offers, seeded personas) beyond instrumentation side effects.
- Live ingestion verification, full funnel coverage, replay QA, and guide targeting → Phase 5.

Do NOT proceed past this phase without checking in.
