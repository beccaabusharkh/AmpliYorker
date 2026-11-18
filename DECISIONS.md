# Decision log

## 2026-11-11 — Phase 0 merge approval (PR #1)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1794432290.929269`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/1
- **Reviewed commit (pre-merge head):** `b0ca49a8e76fe4e6f1ad10f1f4e2671380ba81a3`
- **Merge commit on `main`:** `db8cc8bc3434d679b8ed3cbaf1ffaf3758ff084a`
- **Action:** Approve and squash-merge PR #1; trigger GitHub Pages deploy on `main`
- **Assignment:** Phase 0 publish (consumes pending merge authorization after P0-PUBLISH-001)
- **Approval state:** CONSUMED
- **Deployment evidence:** Actions run https://github.com/beccaabusharkh/AmpliYorker/actions/runs/43102935560 (success); live signed-out check `https://beccaabusharkh.github.io/AmpliYorker/` HTTP 200 with "Amplitude Daily", seeded headline, and article id in bundle

## 2026-11-11 — Phase 0 UX spec waiver

- **Decision:** Proceed with Phase 0 scaffold using PROJECT_PLAN defaults when `docs/0/SPEC.md` is absent
- **Recorded by:** Builder assignment P0-BUILD-002 (referenced in PHASE_LOG)

## 2026-11-17 — Phase 2 UX spec waiver (interim)

- **Decision:** Dispatch Phase 2 BUILD assignment **P2-BUILD-001** using PROJECT_PLAN Phase 2 deliverables and acceptance copy until `docs/2/SPEC.md` is READY from UX; label all simulated account, payment, billing, device, and support flows explicitly ("Simulated …").
- **Rationale:** Unblock accounts/subscriptions build per Slack `@PLANNER dispatch Phase 2`.

## 2026-11-11 — Phase 1 UX spec waiver (interim)

- **Decision:** Dispatch Phase 1 BUILD assignment **P1-BUILD-001** using PROJECT_PLAN Phase 1 deliverables and acceptance copy until `docs/1/SPEC.md` is READY from UX; Builder must not invent competing copy for labeled simulations or sponsored content—use explicit simulation labels from the plan ("Simulated", "Sponsored story" variants as listed in handoff)
- **Rationale:** Unblock discovery/engagement build while UX audit can land in parallel

## 2026-11-11 — Phase 1 builder acceptance (`P1-BUILD-001`)

- **Planner review:** PHASE_LOG `2026-11-11T22:05:00Z` (assignment `P1-BUILD-001` COMPLETE).
- **Reviewed commit:** `4b282fa` on `phase-1-discovery` (PR #2 head; includes publish log entry).
- **Acceptance:** P1-D1 PASS, P1-D2 PASS, P1-D3 PASS (production-preview search smoke per PHASE_LOG).
- **Scope:** Phase 1 product files only (`src/**`, `public/audio/*`, `PHASE_LOG.md`); no Amplitude/Statsig SDK; no account/paywall scope.
- **UX:** Interim waiver per above; handoff deliverables (search, routes, media, newsletter/ad/chat labels) covered.
- **Publish note:** Branch/PR #2 opened (see PHASE_LOG `P1-PUBLISH-001`); merged 2026-11-17.

## 2026-11-17 — Phase 1 merge approval (PR #2)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1794950761.134219`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/2
- **Reviewed commit (pre-merge head):** `4b282fa77d6c35ef5670740e8b9f55b14033cd6f`
- **Merge commit on `main`:** `002b35e25c05ed7a094069f1202986414e6600c6`
- **Action:** Approve and squash-merge PR #2; trigger GitHub Pages deploy on `main`
- **Note:** GitHub review APPROVE not submitted — same account owns PR (self-approval blocked).
- **Assignment:** Phase 1 publish (consumes merge authorization after P1-PUBLISH-001)
- **Approval state:** CONSUMED
- **Deployment evidence:** Actions run https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44179907875 (success); live signed-out check `https://beccaabusharkh.github.io/AmpliYorker/` HTTP 200 with "Amplitude Daily" and `retention-myths` / "retention myths" in deployed bundle (deploy smoke only)

## 2026-11-17 — Phase 2 builder acceptance (`P2-BUILD-001`)

- **Planner review:** PHASE_LOG `2026-11-17T21:35:00Z` (assignment `P2-BUILD-001` COMPLETE).
- **Reviewed commit:** `0a002c09e6710a4ae592995411195b7815ed1cd1` on `phase-2-accounts` (Builder VM only; not on GitHub yet).
- **Acceptance:** P2-D1 PASS, P2-D2 PASS, P2-D3 PASS (production-preview smoke per PHASE_LOG: `registered-reader` → introductory offer → simulated checkout → confirmation refresh → premium article unlocked).
- **Scope:** Phase 2 product files (`src/**`, `src/data/*.json`, `PHASE_LOG.md`); no Amplitude/Statsig SDK; no push in build assignment.

## 2026-11-17 — Phase 2 publish authorization (push + PR only)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1794951381.434309`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **Reviewed commit:** `0a002c09e6710a4ae592995411195b7815ed1cd1` on `phase-2-accounts` (Builder VM; pre-push)
- **Action:** Authorize push of `phase-2-accounts` to `origin` and open one PR into `main`; **not** merge or deployment
- **Assignment:** `P2-PUBLISH-001`
- **Approval state:** CONSUMED (push/PR executed; merge authorized separately — see below)

## 2026-11-17 — Phase 2 merge approval (PR #3)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1794952413.118799`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/3
- **Reviewed commit (pre-merge head):** `5409c4893f2e455b58a7424e0c67fe5915400234`
- **Merge commit on `main`:** `a70cd9c177b2599e4d43f02e02dbfbee8fcc7093`
- **Action:** Approve and squash-merge PR #3; trigger GitHub Pages deploy on `main`
- **Assignment:** Phase 2 publish (consumes merge authorization after P2-PUBLISH-001)
- **Approval state:** CONSUMED
- **Deployment evidence:** Actions run https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44184633700 (success); live deploy-smoke `https://beccaabusharkh.github.io/AmpliYorker/` HTTP 200 with `account/login` and `registered-reader` in deployed bundle

## 2026-11-17 — Phase 3 UX / instrumentation spec waiver (interim)

- **Decision:** Dispatch Phase 3 BUILD assignment **P3-BUILD-001** using PROJECT_PLAN Phase 3 deliverables, `custom-events.yml`, and BUILDER_HANDOFF replay-mask rules until `docs/3/SPEC.md` is READY from UX.
- **Rationale:** Slack `@PLANNER dispatch Phase 3` (ts `1794961026.139839`).

## 2026-11-17 — Phase 3 Amplitude product scope

- **INCLUDED (BUILD must configure):** Analytics custom events (`custom-events.yml`); Session Replay (`sampleRate: 1` with assigned masks); Guides & Surveys via Unified init when supported by SDK docs.
- **EXCLUDED (recorded):** Amplitude Experiment / Feature Flags (Statsig Phase 4); Warehouse, CDP, Activation, and other products not listed above.
- **Verification deferred:** Live ingestion, full event matrix, replay masking QA, guide targeting → Phase 5 FINAL_VERIFY.

## 2026-11-17 — Phase 3 builder smoke blocker (`P3-BUILD-001`)

- **Planner review:** Builder report 2026-11-17 (VM commit `573af6d`, assignment BLOCKED in Builder `PHASE_LOG` — not yet on `origin`).
- **Acceptance:** P3-D1 PASS (typecheck); P3-D2 PASS (build); **P3-D3 BLOCKED** — missing `VITE_AMPLITUDE_API_KEY` in gitignored `.env.local` on AmpliYorker Builder environment.
- **Scope note:** Instrumentation implementation claimed complete on VM (`@amplitude/unified`, `initAll`, custom events, masks); **Planner has not reviewed diff** until branch is pushed or evidence exported.
- **Required (no secret in Slack):** Add `VITE_AMPLITUDE_API_KEY` to the **AmpliYorker** Cursor Cloud environment (team env `09ed1dd9-ddfa-11f1-ba91-f63b1661ac50`) or equivalent secret injection for Builder VMs; use a demo/dev project API key only.
- **Resume:** After secret is set, top-level `@PLANNER resume P3-BUILD-001 smoke` to rerun P3-D3 only on existing VM branch (same assignment id until COMPLETE).

## 2026-11-17 — Phase 3 rebuild dispatch (supersedes P3-BUILD-001)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1794961026.139839`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **Decision:** Supersede **P3-BUILD-001** (VM-only `573af6d`, never on `origin`; smoke resume abandoned). Dispatch **P3-BUILD-002** — full Phase 3 instrumentation rebuild from current `main` on branch `phase-3-instrumentation`.
- **Credentials:** Use team environment `09ed1dd9-ddfa-11f1-ba91-f63b1661ac50` secret `VITE_AMPLITUDE_API_KEY` on Builder VM (no secret in repo or Slack).
- **Assignment:** `P3-BUILD-002` · Builder `bc-08e3bbe4-9fe1-557c-a303-74c7a8cfe114` · Commit yes · Push/PR/Merge no.

## 2026-11-17 — Phase 3 builder acceptance (`P3-BUILD-002`)

- **Planner review:** Builder report 2026-11-17 (assignment `P3-BUILD-002` COMPLETE; PHASE_LOG on VM branch).
- **Reviewed commit:** `4fd7687` on `phase-3-instrumentation` (Builder VM only; not on `origin` yet).
- **Acceptance:** P3-D1 PASS, P3-D2 PASS, P3-D3 PASS (production-preview smoke: `Read Article` at 10% on `daily-decisions` per PHASE_LOG).
- **Scope:** `@amplitude/unified`, `initAll`, custom events per `custom-events.yml`, Session Replay masks, identity rules; no Statsig; no Amplitude experiments/flags.
- **Note:** Full diff review pending until branch is on GitHub.

## 2026-11-17 — Phase 3 publish authorization (push + PR only)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1794961873.636899`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **Reviewed commit:** `4fd7687` on `phase-3-instrumentation` (Builder VM; pre-push)
- **Action:** Authorize push of `phase-3-instrumentation` to `origin` and open one PR into `main`; **not** merge or deployment
- **Assignment:** `P3-PUBLISH-001`
- **Approval state:** CONSUMED

## 2026-11-17 — Phase 3 publish complete (P3-PUBLISH-001)

- **Assignment:** `P3-PUBLISH-001` (consumes publish authorization above)
- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/4
- **Published head:** `3fe4299` on `phase-3-instrumentation`
- **Acceptance:** P3-PUB-D1 PASS, P3-PUB-D2 PASS
- **Note:** Published head differs from planner-reviewed VM commit `4fd7687` authorized pre-push; GitHub head is a descendant including branch `PHASE_LOG` / publish evidence.

## 2026-11-17 — Phase 3 merge approval (PR #4)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1794964389.941119`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/4
- **Reviewed commit (pre-merge head):** `3fe4299a6e4d49c53064f128cde26bbbeb60ce3c`
- **Merge commit on `main`:** `5bb6f9eb12d25d4858cb70fae4a73c8d851d718c`
- **Action:** Approve and merge PR #4; trigger GitHub Pages deploy on `main`
- **Assignment:** Phase 3 publish (consumes merge authorization after P3-PUBLISH-001)
- **Approval state:** CONSUMED
- **Deployment evidence:** Actions run https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44214637874 (success); live signed-out check `https://beccaabusharkh.github.io/AmpliYorker/` HTTP 200; deployed JS bundle includes Amplitude instrumentation strings (deploy smoke only)

## 2026-11-17 — Phase 4 UX / Statsig spec waiver (interim)

- **Decision:** Dispatch Phase 4 BUILD assignment **P4-BUILD-001** using PROJECT_PLAN Phase 4 deliverables and BUILDER_HANDOFF experiment catalog until `docs/4/SPEC.md` is READY from UX.
- **Rationale:** Slack `@PLANNER dispatch Phase 4` (ts `1794964759.482949`).

## 2026-11-17 — Phase 4 dispatch (P4-BUILD-001)

- **Assignment:** `P4-BUILD-001` · Builder `bc-08e3bbe4-9fe1-557c-a303-74c7a8cfe114` · branch `phase-4-statsig` · Commit yes · Push/PR/Merge no.
- **Credentials:** Use team environment `09ed1dd9-ddfa-11f1-ba91-f63b1661ac50` secrets `VITE_AMPLITUDE_API_KEY` (existing) and `VITE_STATSIG_CLIENT_KEY` when present on Builder VM (no secrets in repo or Slack).

## 2026-11-17 — Phase 4 builder acceptance (`P4-BUILD-001`)

- **Planner review:** Builder report 2026-11-18 (assignment `P4-BUILD-001` COMPLETE; PHASE_LOG on VM branch `phase-4-statsig`).
- **Reviewed commit:** `53abe422ea485ae7ebcf0892081ca45d3a72e9bb` on `phase-4-statsig` (Builder VM only; not on `origin` yet).
- **Acceptance:** P4-D1 PASS, P4-D2 PASS, P4-D3 PASS (forced subscription-message variant + local Statsig inspector exposure on production preview per PHASE_LOG).
- **Scope:** `@statsig/js-client`, identity mapping, forced demo overrides, local exposure inspector, paywall/subscribe/home/retention treatments; single Amplitude `initAll()` preserved; no push in build assignment.
- **Deviations:** Experiment catalog uses `subscription_message_experiment` / `value_focused` naming (handoff table used `paywall_subscription_message` / `value_first`); tree produced by parallel Builder worker while official Builder VM had not yet resumed — same recovery pattern as Phase 3 publish.
- **Note:** Full diff review pending until branch is on GitHub.

## 2026-11-17 — Phase 4 publish authorization (push + PR only)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1795022360.226239`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **Reviewed commit:** `53abe422ea485ae7ebcf0892081ca45d3a72e9bb` on `phase-4-statsig` (Builder VM; pre-push)
- **Action:** Authorize push of `phase-4-statsig` to `origin` and open one PR into `main`; **not** merge or deployment
- **Assignment:** `P4-PUBLISH-001`
- **Approval state:** CONSUMED

## 2026-11-18 — Phase 4 publish complete (P4-PUBLISH-001)

- **Assignment:** `P4-PUBLISH-001` (consumes publish authorization above)
- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/5
- **Published head:** `8c9034190cd57f8013992bbe71c0109aaea496e6` on `phase-4-statsig`
- **Acceptance:** P4-PUB-D1 PASS, P4-PUB-D2 PASS
- **Note:** Published head differs from planner-reviewed VM commit `53abe42` authorized pre-push; GitHub head is a descendant including `PHASE_LOG` / publish evidence.

## 2026-11-18 — Phase 4 merge approval (PR #5)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1795023096.564969`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/5
- **Reviewed commit (pre-merge head):** `8c9034190cd57f8013992bbe71c0109aaea496e6`
- **Merge commit on `main`:** `df237c8dae3c6e05b1d0a705c37a5cf8f15c4533`
- **Action:** Approve and squash-merge PR #5; trigger GitHub Pages deploy on `main`
- **Assignment:** Phase 4 publish (consumes merge authorization after P4-PUBLISH-001)
- **Approval state:** CONSUMED
- **Deployment evidence:** Actions run https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44359843731 (success); live signed-out check `https://beccaabusharkh.github.io/AmpliYorker/` HTTP 200; deployed JS bundle includes Statsig strings (deploy smoke only)

## 2026-11-18 — Phase 5 dispatch (P5-VERIFY-001)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1795024500.000000` (Cursor Planner turn; human message `@PLANNER dispatch Phase 5`)
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **Decision:** Dispatch Phase 5 FINAL_VERIFY assignment **P5-VERIFY-001** — full deferred matrix for UC-1…UC-10, Amplitude + Statsig vendor evidence, published deep-link checks, screenshots + short video; corrections on branch `phase-5-final-verify` only.
- **Baseline:** `main` @ `df237c8` (post PR #5); live `https://beccaabusharkh.github.io/AmpliYorker/`.
- **Credentials:** Same team environment as Phases 3–4 (`VITE_AMPLITUDE_API_KEY`, `VITE_STATSIG_CLIENT_KEY`); vendor checks may BLOCK without org UI access — record BLOCKED, not silent PASS.
- **Assignment:** `P5-VERIFY-001` · Builder `bc-08e3bbe4-9fe1-557c-a303-74c7a8cfe114` · Commit yes · Push/PR/Merge no until **P5-PUBLISH-001** if corrections ship.
- **UX:** No `docs/5/SPEC.md`; verification matrix lives in BUILDER_HANDOFF.md per PROJECT_PLAN Phase 5 pre-dispatch rule.

## 2026-11-18 — Phase 5 Amplitude credentials (P5-CRED-001)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** follow-up after `1795025013.027169` (human: API key added)
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **Action:** `VITE_AMPLITUDE_API_KEY` present on team Cursor environment; Builder/preview live ingestion re-verified (see `docs/evidence/p5-vendor/amplitude-live-ingestion-smoke.json`).
- **Note:** `deploy-pages.yml` passes `secrets.VITE_AMPLITUDE_API_KEY` and `secrets.VITE_STATSIG_CLIENT_KEY` into `pnpm build`. Approver added repository secrets (2026-11-18); Pages run 44370358367 verified published Amplitude ingestion (see `docs/evidence/p5-vendor/published-vendor-smoke.json`).

## 2026-11-18 — Phase 5 merge approval (PR #6)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1795025013.027169`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/6
- **Reviewed commit (pre-merge head):** `aedc8e430c28f0157bd7607439c50947d46250e8`
- **Merge commit on `main`:** `b077491f7410c1b75839a5e13847a43889786c31`
- **Action:** Approve and squash-merge PR #6; trigger GitHub Pages deploy on `main`
- **Assignment:** Phase 5 publish (consumes merge authorization after P5-PUBLISH-001)
- **Approval state:** CONSUMED
- **Deployment evidence:** Actions run https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44365703026 (success); live signed-out check `https://beccaabusharkh.github.io/AmpliYorker/` HTTP 200 (deploy smoke only)

## 2026-11-18 — Editorial redesign builder acceptance (`P2-BUILD-EDITORIAL-001`)

- **Planner review:** Builder report 2026-11-18; assignment COMPLETE on VM branch `editorial-redesign`.
- **Reviewed commit:** `54ef27d` (amended; log references `f969957`) — local only until push authorized.
- **Acceptance:** P2E-D1 PASS, P2E-D2 PASS, P2E-D3 PASS, P2E-D4 PASS; P2E-A01–A10 PASS per PHASE_LOG on VM.
- **Scope:** Editorial UI/content (`src/**`, `public/images/editorial/**`, `custom-events.yml` milestone docs/enum, `PHASE_LOG.md`); journeys + Amplitude/Statsig preserved.
- **Publish:** Awaits **P2E-PUBLISH-001** (push + PR, merge separate).

## 2026-11-18 — Editorial redesign publish authorization (push + PR only)

- **Channel:** Cursor Project (Becca Abu Sharkh)
- **Message:** `@PLANNER authorize push and PR for editorial redesign`
- **Approver:** Becca Abu Sharkh
- **Reviewed commit:** `54ef27d` on `editorial-redesign` (Builder VM; pre-push)
- **Action:** Authorize push of `editorial-redesign` to `origin` and open one PR into `main`; **not** merge or deployment
- **Assignment:** `P2E-PUBLISH-001`
- **Approval state:** CONSUMED


## 2026-11-18 — Editorial redesign merge approval (PR #7)

- **Channel:** Cursor Project (Becca Abu Sharkh)
- **Approver:** Becca Abu Sharkh
- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/7
- **Reviewed commit (pre-merge head):** `1ae070c0d6c62f57ac241971eae4fdba14789097`
- **Action:** Approve and squash-merge PR #7; trigger GitHub Pages deploy on `main`
- **Assignment:** `P2E-MERGE-001`
- **Approval state:** CONSUMED (dispatch)

## 2026-11-18 — Editorial redesign scope authorization

- **Channel:** Cursor Project (Becca Abu Sharkh)
- **Decision:** Authorize planning and implementation of a substantial editorial visual/content redesign on the **current `main` baseline** (post Phase 5, `b077491`+). UX spec first, then Builder `bc-08e3bbe4-9fe1-557c-a303-74c7a8cfe114` on new branch `editorial-redesign`. Preserve all demo journeys, Amplitude/Statsig instrumentation, and merge/deploy approval workflow. No backend, live AI, or live ads.
- **References:** New Yorker long-form character + NYT homepage hierarchy; structural reference article URL only (original copy/assets).
- **Assignments:** `P2-UX-EDITORIAL-001` (UX), then `P2-BUILD-EDITORIAL-001` (Builder) after `docs/2/SPEC.md` is `READY`.
- **Reading measurement:** Align milestones to 25/50/75/90/completion + active time per user brief; document changes to `custom-events.yml` if needed.

## 2026-11-18 — Editorial redesign merge complete (PR #7)

- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/7
- **Merge commit on `main`:** `81522f9c4211e97d771a39f6a0b16ddddfbf3c1e`
- **Assignment:** `P2E-MERGE-001` COMPLETE
- **Deployment evidence:** Actions run https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44380450346 (success); deploy-smoke `https://beccaabusharkh.github.io/AmpliYorker/` HTTP 200; published JS bundle contains `Ask the Daily` and editorial corpus

## 2026-11-18 — Photography-led visual fix authorization

- **Channel:** Cursor Project (Becca Abu Sharkh)
- **Decision:** Fix mode — substantial photography/asset pass on `main` without SDK/backend changes. UX then same Builder; local branch; no push/merge in this authorization.
- **Assignments:** P2E-UX-PHOTO-001, P2E-BUILD-PHOTO-001, P2E-VERIFY-PHOTO-001
## 2026-11-18 — Photography build acceptance (`P2E-BUILD-PHOTO-001`)

- **Reviewed commit:** `b3dbfaa` on `photo-editorial-v2` (VM only; no push)
- **Acceptance:** P2E-PHOTO-D1–D4 PASS per Builder; 33 WebP assets + `ASSET-MANIFEST.md`; Northline/Sunday House/Margin Coffee ads; 60/40 lead; 8 unique home photo URLs
- **Verify:** P2E-VERIFY-PHOTO-001 COMPLETE — A01–A15 15/15 PASS (`docs/evidence/photo-v2/UX-REVIEW.md`)
## 2026-11-18 — Photography push/PR authorization

- **Channel:** Cursor Project (Becca Abu Sharkh)
- **Decision:** Authorize push + open PR for `photo-editorial-v2`; **no merge** without separate Approve.
- **Assignment:** P2E-SHIP-PHOTO-001 → Builder `bc-e05e21fe-01c2-5e95-981a-bb0d5f5193b2`
## 2026-11-18 — Photography merge authorization

- **Channel:** Cursor Project (Becca Abu Sharkh)
- **Decision:** Approve and merge PR #8 → `main` (squash merge preferred if repo default)
- **Assignment:** P2E-MERGE-PHOTO-001 → Builder
## 2026-11-18 — Photography merge landed

- **PR:** #8 merged → `main` @ `5a7dcbafa2496f70801432a2aea230335efc55e6`
- **Deploy:** GitHub Actions run https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44387614882
- **Live:** https://beccaabusharkh.github.io/AmpliYorker/

## 2026-11-18 — Atlantic refinement authorized (fix mode)

- **Decision:** Atlantic-inspired layout; white canvas, smaller photos, masthead, accounts/chat/subscribe polish.
- **Git:** no push/merge in this authorization.
- **Assignments:** P2F-UX-ATLANTIC-001 → Builder → verify → UX review.
## 2026-11-18 — Atlantic build acceptance (P2F-BUILD-ATLANTIC-001)

- Commit `a7b38be` on `atlantic-refinement` (no push); D1–D3 PASS per Builder.
- Verify: P2F-VERIFY-ATLANTIC-001 in progress.

## 2026-11-18 — Atlantic verify (P2F-VERIFY-ATLANTIC-001)

- **A01–A20:** 20/20 PASS; 11/11 journeys PASS on `atlantic-refinement` (VM; no push).
- UX screenshot sign-off: P2F-UX-REVIEW-ATLANTIC-001 **PASS** (minor gaps: journey video, optional mobile crops).
## 2026-11-18 — Atlantic push/PR authorization

- Authorize push + PR for `atlantic-refinement`; no merge without Approve.
- Assignment: P2F-SHIP-ATLANTIC-001
## 2026-11-18 — Atlantic merge authorization

- Approve merge PR #9 → main.
- Assignment: P2F-MERGE-ATLANTIC-001

## 2026-11-18 — Subscribe/account polish (fix)
- Sections 1–7; no push in authorization.

## 2026-11-18 — Polish build accepted
- P2G-BUILD-POLISH-001 @ `fbf445f`; P2G-VERIFY 18/18 + 12 journeys PASS; UX review in flight.

## 2026-11-18 — Subscribe polish push/PR authorization
- Push + PR `polish-subscribe-account`; no merge without Approve.

## 2026-11-18 — Polish merge authorization
- Approve merge PR #10.
- Landed `0fbc836c` PR #10.

## 2026-11-18 — Atlantic fidelity fix (2H)
- Reference-driven rebuild; no push/merge auth.
