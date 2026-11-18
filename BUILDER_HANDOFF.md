# BUILDER_HANDOFF

**Status:** START
**Phase:** 4 : Statsig gates and experiments
**phase_id:** 4
**assignment_id:** P4-BUILD-001
**phase_type:** BUILD
**Builder agent ID:** bc-08e3bbe4-9fe1-557c-a303-74c7a8cfe114
**Branch:** `phase-4-statsig`

**Planner dispatch (2026-11-17):** Slack ts `1794964759.482949` — Phase 3 merged to `main` (`5bb6f9eb`); Pages deploy run https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44214637874 success.

Objective: integrate the Statsig **client** SDK with stable identity aligned to Amplitude, apply treatments to existing journeys with safe defaults on SDK failure/timeout, and log exposures locally when treatments render. Do not regress Phase 3 Amplitude instrumentation.

## Prerequisites

1. Read BUILDER.md, AGENTS.md, PROJECT_PLAN.md, DECISIONS.md, `custom-events.yml`, and PHASE_LOG.md; stop if **P4-BUILD-001** already has COMPLETE or BLOCKED.
2. `git fetch origin main` and create branch `phase-4-statsig` from `origin/main` (`5bb6f9eb` or later).
3. Read `docs/4/SPEC.md` when status is READY; if missing, follow PROJECT_PLAN Phase 4 + DECISIONS.md interim waiver (same pattern as Phases 1–3).
4. Keep a single Amplitude `initAll()` path from Phase 3; add Statsig as a separate client init (no duplicate Amplitude packages, no Amplitude Experiment).

## Credentials

- Statsig client key via `VITE_STATSIG_CLIENT_KEY` in **gitignored** `.env.local` (AmpliYorker team environment — same pattern as `VITE_AMPLITUDE_API_KEY`).
- Extend committed `.env.example` with `VITE_STATSIG_CLIENT_KEY=` (empty). Never commit or log real keys.
- If key missing at smoke time: P4-D1/P4-D2 may still PASS; P4-D3 is BLOCKED with exact note in PHASE_LOG — do not invent a key.

## Identity & failure defaults

1. Initialize Statsig after session/anonymous identity is known; map **Statsig user** to the same stable id Amplitude uses (`reader_id` when logged in, otherwise `anonymous_id` from existing session helpers).
2. On SDK init timeout/error: use **control/local defaults** — site must remain usable (existing paywall copy, offer labels, recommendations, retention modules).
3. Set `is_forced_variant` on Amplitude common properties via `buildCommonProperties` when a demo override is active (see below).

## Experiment / gate catalog (BUILD minimum)

Record each id in `PHASE_LOG.md` and a short table in code (e.g. `src/lib/statsig/config.ts`).

| Id | Type | Surfaces | Control default | Treatment(s) | Exposure trigger |
| --- | --- | --- | --- | --- | --- |
| `paywall_subscription_message` | experiment | Premium article paywall (logged-in, no active sub) | Existing `paywallMessage()` copy (`message_id: default_paywall`) | `value_first`: **"Unlock insights growth teams rely on — subscribe to read this premium brief."** (`message_id: value_first_paywall`) | When paywall body is rendered |
| `paywall_article_threshold` | gate | Paywall trigger for registered non-subscribers | `false` (current behavior) | `true`: require **3** articles read in window before paywall (vs implicit 2) | When evaluating whether to show paywall |
| `subscribe_intro_highlight` | experiment | `#/subscribe` plan cards | Both CTAs equal weight | `intro_emphasis`: visual emphasis on introductory-offer button only | Subscribe page render |
| `home_recommendation_strategy` | gate | Home "More for you" ordering | Current deterministic order | `on`: alternate ordering rule (document in code) | Recommendation list render |
| `retention_treatment_copy` | experiment | Account retention module | Current copy | `renewal_focus`: alternate headline + CTA on retention treatment card | Retention module visible |

- Emit **Statsig exposure** only when the treatment affects rendered UI (not on init alone).
- Log exposure to a **local inspector** (e.g. `window.__AMPLI_DAILY_STATSIG__` ring buffer or `sessionStorage` key `ampli-daily-statsig-exposures`) with: `experiment_id`, `variant`, `is_forced_variant`, `occurred_at`.
- Connect outcomes through existing Amplitude events (`Paywall Presented` must include `message_id` matching the rendered variant).

## Demo forced variants (required)

1. Add a small **Account → Demo experiment overrides** panel (simulation-labeled) or hash query hook:
   - Force `paywall_subscription_message` → `value_first` for smoke (e.g. toggle persisted in `localStorage` key `ampli-daily-statsig-force` JSON).
2. Forced traffic must set `is_forced_variant: true` on Amplitude `trackDemoEvent` common props and on Statsig local exposure records.
3. Label UI: "Forced demo variant — excluded from live experiment conclusions" (per `custom-events.yml` conventions).

## P4-D3 smoke (subscription-message variant)

With both API keys in `.env.local`, production preview (`pnpm preview --host 127.0.0.1 --port 4173 --strictPort`):

1. Enable forced override for `paywall_subscription_message` = `value_first`.
2. Log in as persona `registered-reader` (`#/account/login`).
3. Open `http://127.0.0.1:4173/AmpliYorker/#/article/retention-myths` (premium).
4. **PASS** when:
   - Paywall shows the **value_first** copy string exactly.
   - Local Statsig inspector shows **one** exposure for `paywall_subscription_message` / `value_first` with `is_forced_variant: true`.
   - `Paywall Presented` Amplitude event (if fired) includes `message_id: value_first_paywall`.

Record command output and inspector JSON snippet in PHASE_LOG.md.

## Definition of done

- **P4-D1:** `pnpm typecheck` exits 0.
- **P4-D2:** `pnpm build` exits 0.
- **P4-D3:** Smoke above PASS with evidence in PHASE_LOG.md.

## Allowed files and commands

- Edit/create: `package.json`, `pnpm-lock.yaml`, `.env.example`, `src/**`; append `PHASE_LOG.md`.
- Do not edit Planner-owned planning files on this branch except `PHASE_LOG.md`.
- Do not edit `.github/workflows/*` unless required for build (unlikely).

- Commands: `pnpm install`, `pnpm typecheck`, `pnpm build`, `pnpm preview` for smoke only.

## Git permissions

Git permissions: Commit: Yes | Merge: No | Push: No | PR: No | Deployment: No

- Local branch `phase-4-statsig` only.
- No push until a separate Planner publish assignment.

## Scope limits

- Client SDK only; no Statsig Console mutations from BUILD.
- No new journeys; wire treatments into existing paywall, subscribe, home, retention surfaces.
- No Amplitude Experiment / flags; no second `initAll()`.
- Live assignment ingestion, all five surfaces in vendor UI, guardrails → Phase 5 FINAL_VERIFY.

Do NOT proceed past this phase without checking in.