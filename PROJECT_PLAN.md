# Amplitude Daily project plan

- Status: IDLE — **P2-PUBLISH-001** complete; PR https://github.com/beccaabusharkh/AmpliYorker/pull/3 open (`5409c48`). Await merge approval. **Planner note:** build review was at `0a002c0`; reconcile PR diff before `Approve`.
- Audience: PMs, engineers, analysts, and other buyers evaluating Amplitude and Statsig.
- Goal: demonstrate reader discovery, engagement, monetization, and retention through a fictional, Amplitude-branded news site.
- Phase order: 0 → 1 → 2 → 3 → 4 → 5. Each phase depends on acceptance of the preceding phase.

## Shared implementation and review rules

- Use a static TypeScript app, repo-based mock content, browser storage, hash routing, and GitHub Pages deployed through GitHub Actions; add no backend.
- In Phase 0 define `pnpm typecheck`, `pnpm build`, and `pnpm preview`; make preview serve the production build on port 4173 under the configured Pages base path.
- Use the actual repository name to configure the Pages base path; record the local preview URL and published URL in PHASE_LOG.md.
- Render only implemented navigation links. Keep completed journeys usable after each merge; ship later features with local defaults until their SDK phase arrives.
- For every BUILD phase run typecheck, production build, and exactly one narrow smoke check below. Record command exit codes and the smoke result; do not run full suites, browser walkthroughs, screenshots, or video.
- Run each build smoke check against production preview. A short interaction check is permitted; testing multiple journeys or viewport/state matrices belongs to Phase 5.
- Request merge approval only after the current phase's checks pass. Require a fresh approval naming the exact PR and reviewed commit; set Merge yes only in the matching reserved-action handoff.
- Commit yes below permits phase changes on the assigned feature branch only after a START handoff grants that action. Push, PR creation, and deployment require separate explicit handoff permissions; omitted permissions are none.
- Do not merge a PR that removes the last working version of a journey. Require scoped corrections and repeat affected checks when a review identifies a regression.
- After each authorized merge, check the deployment workflow result and fetch the published home URL once; log BLOCKED and pause the next dispatch if deployment fails. Treat this as deployment confirmation, not full browser QA.
- Keep real authentication, payments, billing, email delivery, live ads/revenue, shared cross-device state, and live AI out of scope. Label simulated services and sponsored content.
- Do not start UX or Builder work from this plan alone. Assign UX specs through UX_HANDOFF.md and pass READY specs to the same Builder in BUILDER_HANDOFF.md.
- Phase 0 UI copy/layout may follow PROJECT_PLAN defaults when `docs/0/SPEC.md` is waived in DECISIONS.md.

## Phase 2 : Accounts, subscriptions, and retention

- **Publish (2026-11-17):** P2-PUBLISH-001 COMPLETE — PR #3 open; head `5409c48` (reconcile with acceptance at `0a002c0` before merge).
