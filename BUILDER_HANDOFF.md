# BUILDER_HANDOFF

**Status:** START
**Phase:** 5 : Final verification and corrections
**phase_id:** 5
**assignment_id:** P5-VERIFY-001
**phase_type:** FINAL_VERIFY
**Builder agent ID:** bc-08e3bbe4-9fe1-557c-a303-74c7a8cfe114
**Branch:** `phase-5-final-verify`

**Planner dispatch (2026-11-18):** Phase 4 merged on `main` (`df237c8`); live https://beccaabusharkh.github.io/AmpliYorker/ (Pages run 44359843731 success). Execute full deferred QA from Phases 0–4; fix in-scope failures on this branch and record PASS/FAIL/BLOCKED evidence in `PHASE_LOG.md` and `docs/evidence/**`.

Objective: verify all ten use cases, Amplitude + Statsig integrations, and deployed behavior; correct scoped bugs; deliver screenshot + short video evidence for the reviewed revision.

## Prerequisites

1. Read BUILDER.md, AGENTS.md, PROJECT_PLAN.md, DECISIONS.md, `custom-events.yml`, `src/lib/statsig/catalog.ts`, and PHASE_LOG.md; stop if **P5-VERIFY-001** already has COMPLETE or BLOCKED.
2. `git fetch origin main`; branch `phase-5-final-verify` from `origin/main` (`df237c8` or later).
3. Credentials (no values in logs): team environment secrets `VITE_AMPLITUDE_API_KEY`, `VITE_STATSIG_CLIENT_KEY` in gitignored `.env.local` (same as Phases 3–4). Missing key → mark affected vendor checks BLOCKED with exact missing secret name.
4. **Viewports:** desktop `1280×720`, mobile `390×844`. **Browser:** Chromium via Playwright (preferred) or headless Chrome; record tool version in PHASE_LOG.
5. **URLs:** production preview `http://127.0.0.1:4173/AmpliYorker/` after `pnpm build && pnpm preview --host 127.0.0.1 --port 4173 --strictPort`; published `https://beccaabusharkh.github.io/AmpliYorker/`.

## Definition of done (record each in PHASE_LOG)

| Check | Requirement |
| --- | --- |
| **P5-D1** | At reviewed commit: `pnpm typecheck` and `pnpm build` exit 0; every **required** matrix row below has PASS or documented BLOCKED; no required row FAIL without a follow-up correction commit on this branch. |
| **P5-D2** | Browser evidence for **UC-1…UC-10** (use cases), responsive + keyboard spot-checks, account lifecycle + demo reset/time, simulation/sponsorship labels; store screenshots under `docs/evidence/p5-d2/` (paths in log). |
| **P5-D3** | Amplitude: live or inspector evidence for identity, `Read Article` milestones, paywall/checkout funnel events, replay mask selectors (no password/payment/chat body in payload snapshots), `is_simulated` / `is_forced_variant` / `data_origin`; note BLOCKED if org access missing. |
| **P5-D4** | Statsig: assignments/exposures for all catalog ids in `src/lib/statsig/catalog.ts`, forced-demo exclusion, defaults when SDK key absent; exposure timing matches render; map outcomes to Amplitude events per `custom-events.yml`. |
| **P5-D5** | GitHub Actions Pages workflow success for tested revision; published home + deep-link refresh (e.g. `#/article/daily-decisions`, `#/account/login`); one short screen recording (`docs/evidence/p5-d5/demo-walkthrough.webm` or `.mp4`, ≤90s) + hero screenshot without secrets. |

## Ten use cases → matrix rows (required unless BLOCKED)

Each row: **steps → expected → evidence path**. Status PASS/FAIL/BLOCKED per row in PHASE_LOG summary table.

### UC-1 Discovery (VC-101–108)

- **VC-101** Home `#/` — brand “Amplitude Daily”, featured article link works (signed-out).
- **VC-102** Search — query `retention myths` → open `retention-myths`; title + body visible.
- **VC-103** Topic filter — `experimentation` topic lists seeded articles.
- **VC-104** Author page — author from article loads bio + article list.
- **VC-105** Recommendations — home “More for you” renders ≥3 cards; order matches `home_recommendation_strategy` variant when Statsig available (else deterministic default).
- **VC-106** Reading progress — scroll article; progress persists after refresh (localStorage).
- **VC-107** Media — narrated block + podcast card present; audio element loads repo asset.
- **VC-108** Discovery chat — FAQ panel opens; “Simulated” disclosure visible; empty query shows fallback copy.

### UC-2 Registration / login (VC-201–205)

- **VC-201** Register — preset demo values; success switches to registered persona (simulation label).
- **VC-202** Login — persona `registered-reader` via `#/account/login`.
- **VC-203** Logout — returns anonymous; Phase 1 search still works.
- **VC-204** Saved / followed — toggle save + follow; state survives refresh.
- **VC-205** Validation — empty required field shows inline error (no crash).

### UC-3 Paywalls (VC-301–304)

- **VC-301** Premium article `retention-myths` — paywall for anonymous/non-subscriber.
- **VC-302** Gate `premium_paywall_after_scroll` — scroll threshold behavior documented PASS/FAIL.
- **VC-303** `subscription_message_copy` — control vs `urgency` copy when forced override; exposure in local inspector.
- **VC-304** Subscriber — paywall lifted after active subscription.

### UC-4 Trials / offers (VC-401–403)

- **VC-401** `#/subscribe` — plans + introductory offer visible for registered reader.
- **VC-402** `subscription_offer_framing` / intro emphasis variant on subscribe render.
- **VC-403** Offer selection persists into checkout draft.

### UC-5 Engagement (VC-501–503)

- **VC-501** `Read Article` Amplitude milestones 10/50/100 on `daily-decisions` (inspector or dev stream).
- **VC-502** Newsletter signup simulation — success state + simulation label.
- **VC-503** Article completion does not fire skipped milestones on restore (per `custom-events.yml`).

### UC-6 Ads (VC-601)

- **VC-601** Ad rail labeled simulated; `Ad Revenue Recorded` only when specified in UI flow (or BLOCKED with reason).

### UC-7 Sponsored content (VC-701)

- **VC-701** Sponsored story card labeled; `content_type: sponsored` on related event if fired.

### UC-8 Retention (VC-801–803)

- **VC-801** Declining-engagement persona sees retention module.
- **VC-802** `retention_renewal_treatment` copy variants (`control` vs `win_back`).
- **VC-803** Demo time advance changes renewal/expiry display consistently.

### UC-9 Subscription management (VC-901–906)

- **VC-901** Checkout simulated payment → confirmation → refresh keeps active status.
- **VC-902** Account hub billing/plan change (local).
- **VC-903** Cancellation reason captured; canceled state UI.
- **VC-904** Demo reset clears subscription + returns predictable baseline.
- **VC-905** Device-switch simulation label present.
- **VC-906** Account-support chat — simulated header + FAQ.

### UC-10 Chat outcomes (VC-1001)

- **VC-1001** Discovery + account chats return scripted answers; no live AI claims.

## Cross-cutting (required)

- **VC-X01** Deep links — refresh `/#/article/daily-decisions`, `/#/account/login` on **published** URL (200, no blank shell).
- **VC-X02** Responsive — home + article at mobile width; no horizontal scroll overflow on header.
- **VC-X03** Keyboard — Tab reaches search input + primary nav link; Enter activates search submit.
- **VC-X04** Statsig defaults — rename `.env.local` temporarily; site usable with control defaults (no infinite spinner).
- **VC-X05** Amplitude masks — inspect replay config / payload snapshot: password, card, email fields not in event props (selectors per `src/lib/amplitude` masks).

## Workflow

1. Run P5-D1 commands; log commit SHA under test.
2. Execute matrix; capture screenshots per failing/passing UC on both preview and published where marked.
3. Vendor checks P5-D3/P5-D4 — export inspector JSON snippets into `docs/evidence/p5-vendor/` (redact keys).
4. If FAIL: fix **in-scope** product bug on `phase-5-final-verify`, re-run affected VC rows only; do not expand scope.
5. Append COMPLETE only when P5-D1–D5 satisfied or required rows BLOCKED with Planner escalation note (missing credentials, vendor access).
6. Report to Planner via PHASE_LOG only (no Slack).

## Allowed files and commands

- Edit/create: `src/**`, `public/**`, `docs/evidence/**`, `package.json` / lock only if required for verify tooling; append `PHASE_LOG.md`.
- Do not edit Planner-owned files except `PHASE_LOG.md`.
- Commands: `pnpm install`, `pnpm typecheck`, `pnpm build`, `pnpm preview`, Playwright or `npx playwright` if added as devDependency for this phase only.

## Git permissions

Git permissions: Commit: Yes | Merge: No | Push: No | PR: No | Deployment: No

- Branch `phase-5-final-verify` only. Push awaits **P5-PUBLISH-001** (separate handoff).

## Scope limits

- No backend, real payments, or live chat AI.
- Vendor BLOCKED ≠ FAIL when credentials/entitlements documented.
- Do not delete working journeys; correction PRs stay minimal.

Do NOT proceed past this phase without checking in.
