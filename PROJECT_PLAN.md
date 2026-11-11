# Amplitude Daily project plan

- Status: START. Active assignment P0-BUILD-001 (Phase 0 BUILD) is dispatched; merge to `main` stays denied until a qualifying Slack `Approve` from the configured approver.
- Audience: PMs, engineers, analysts, and other buyers evaluating Amplitude and Statsig.
- Goal: demonstrate reader discovery, engagement, monetization, and retention through a fictional, Amplitude-branded news site.
- Phase order: 0 → 1 → 2 → 3 → 4 → 5. Each phase depends on acceptance of the preceding phase.

## Active dispatch

| Field | Value |
| --- | --- |
| phase_id | 0 |
| assignment_id | P0-BUILD-001 |
| phase_type | BUILD |
| Builder agent | https://cursor.com/agents/bc-3219cf40-a75c-507c-a345-62219ac5994e |
| Branch | `phase-0-static-scaffold` |
| Handoff | `BUILDER_HANDOFF.md` (Status START; Git Commit yes, Merge no) |
| Open blocker | `docs/0/SPEC.md` missing; Builder must BLOCKED until UX delivers READY `docs/0/SPEC.md` or Planner waives in DECISIONS.md |

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
- Phase 0 UI work requires `docs/0/SPEC.md` with status READY; Pages workflow and toolchain setup still follow BUILDER_HANDOFF.md step order.

## Phase 0 : Static scaffold and deployment

- Type: BUILD.
- Objective: publish a static Amplitude Daily home page through GitHub Actions so subsequent phases extend an accessible site.
- Deliverables: `docs/0/SPEC.md` (UX, status READY), home shell, typography and color tokens, responsive header/footer, repo content structure, hash-route fallback, package scripts, and `.github/workflows/deploy-pages.yml` deploying `dist/` on push to `main` only.
- Definition of done:
  1. P0-D1: `pnpm typecheck` exits 0.
  2. P0-D2: `pnpm build` exits 0 and produces the artifact directory used by the GitHub Actions Pages workflow.
  3. P0-D3: one smoke check loads the production-preview home URL and shows “Amplitude Daily,” a news headline, and a working article link without missing assets.
- Risks: the wrong Pages base path causes missing assets; Pages repository settings or Actions permissions may block deployment. Record exact setup blockers and request them through the Planner.
- Needs human approval to merge? Yes, including the automatic Pages deployment triggered by that merge.
- Git permissions for the Builder: Commit yes; Merge no until the Planner grants the exact approved merge action.
- Deferred to Phase 5: refresh/deep-link matrix, responsive layouts, keyboard navigation, and workflow/security review.

## Phase 1 : Discovery, reading, and engagement

- Type: BUILD.
- Objective: let readers discover and consume articles, media, sponsored content, and recommendations before adding accounts or tracking.
- Deliverables: topic/author pages, search, article pages, deterministic recommendations, reading progress, narrated articles, podcasts, newsletter signup simulation, labeled ads/sponsored stories, and scripted discovery chat.
- Definition of done:
  1. P1-D1: `pnpm typecheck` exits 0.
  2. P1-D2: `pnpm build` exits 0.
  3. P1-D3: one smoke check searches for a seeded headline, opens that result, and displays its matching article title and body.
- Risks: media licensing or unavailable assets can block playback; use repo-owned or licensed sample audio. Empty search results and scripted chat can imply unsupported behavior; specify fallback copy in the UX spec.
- Needs human approval to merge? Yes.
- Git permissions for the Builder: Commit yes; Merge no until the Planner grants the exact approved merge action.
- Deferred to Phase 5: author/topic filters, recommendation logic, audio playback, newsletter states, chat fallbacks, ad placement, sponsored labels, and reading progress.

## Phase 2 : Accounts, subscriptions, and retention

- Type: BUILD.
- Objective: let readers complete simulated registration, engagement, subscription, retention, and account-management journeys with persistent browser state.
- Deliverables: account personas, registration/login/logout, saved articles, followed writers, simulated device switch, paywall, plans, trials/offers, checkout, activation, billing edits, plan changes, renewals, cancellation reasons, and scripted account-support chat.
- Deliverables: demo reset and time controls, seeded declining-engagement profiles, retention reminders/recommendations, renewal offers, and trial-to-paid/expired/canceled states; keep paywall and offer defaults local until Phase 4.
- Definition of done:
  1. P2-D1: `pnpm typecheck` exits 0.
  2. P2-D2: `pnpm build` exits 0.
  3. P2-D3: one smoke check uses the seeded registered-reader persona to select an introductory offer, submit simulated checkout, and show active access after refreshing the confirmation page.
- Risks: browser storage cannot provide actual authentication or cross-device accounts; show simulation labels. Real payment/password data must not be requested or stored; use preset demo values. Time controls must update subscription and engagement state consistently.
- Needs human approval to merge? Yes.
- Git permissions for the Builder: Commit yes; Merge no until the Planner grants the exact approved merge action.
- Deferred to Phase 5: every account state, saved/followed persistence, validation failures, trial progression, billing/plan changes, renewal/cancellation, retention treatments, reset, and device-switch simulation.

## Phase 3 : Amplitude instrumentation and product connections

- Type: BUILD.
- Objective: instrument the existing journeys with Amplitude and connect the configured product experiences without changing their baseline behavior.
- Deliverables: install only `@amplitude/unified` and initialize it through exactly one `initAll()` call in a shared module; never install `@amplitude/analytics-browser` or other Amplitude packages separately.
- Deliverables: configure Analytics, Session Replay, and Guides & Surveys through the Unified SDK's supported interfaces; leave Amplitude flags/experimentation disabled and do not add a second SDK to resolve a capability gap.
- Deliverables: event/property dictionary, identity and logout/reset rules, synthetic-data labels, replay masks, and telemetry exclusions for form/chat content; distinguish actual interactions from seeded history and simulated revenue.
- Deliverables: track discovery, registration, reading completion, media, newsletter signup, paywalls, checkout, activation, paid conversion, ads, sponsored stories, retention, billing changes, cancellation reasons, and chat outcomes.
- Deliverables: list additional requested Amplitude products and supported connections; record INCLUDED acceptance checks or an approved EXCLUDED decision before dispatch. SDK installation alone must not be reported as product configuration or verified ingestion.
- Definition of done:
  1. P3-D1: `pnpm typecheck` exits 0.
  2. P3-D2: `pnpm build` exits 0.
  3. P3-D3: one smoke check opens an article in production preview and observes exactly one article-view tracking call in the development event inspector with the assigned article ID, identity, and synthetic-data properties.
- Risks: SDK interfaces or product entitlements may differ from assumptions; check official documentation before implementation and escalate missing support. Missing project access blocks vendor verification. Replay or events may collect sensitive content unless masking/exclusions precede capture.
- Needs human approval to merge? Yes.
- Git permissions for the Builder: Commit yes; Merge no until the Planner grants the exact approved merge action.
- Deferred to Phase 5: live ingestion, complete event/identity coverage, funnels/cohorts/journeys/retention, replay masking, guide/survey targeting, configured additional products, and missing-key behavior. The inspector check proves local tracking only.

## Phase 4 : Statsig gates and experiments

- Type: BUILD.
- Objective: apply Statsig treatments to existing journeys and connect valid exposures to their measured outcomes.
- Deliverables: one Statsig client integration, stable identity mapping, timeout/error defaults preserving the existing site, and gates/experiments for paywall timing, subscription copy, offers, recommendations, and retention treatments.
- Deliverables: record gate/experiment identifiers, allocation, treatments, exposure triggers, primary outcome events, and guardrails; emit exposure only when the treatment is used and connect it to the Amplitude identity/event mapping.
- Deliverables: isolated deterministic demo overrides labeled as forced variants; exclude forced traffic from live experiment conclusions and do not claim seeded outcomes establish a winning treatment.
- Definition of done:
  1. P4-D1: `pnpm typecheck` exits 0.
  2. P4-D2: `pnpm build` exits 0.
  3. P4-D3: one smoke check forces the assigned subscription-message variant, opens its paywall, and observes the specified copy plus one matching exposure in the local inspector marked as forced demo traffic.
- Risks: identity mismatch, automatic exposure logging, or duplicate initialization can misattribute outcomes. Forced variants may contaminate live results. Missing Statsig access must not disable the default reader journey.
- Needs human approval to merge? Yes.
- Git permissions for the Builder: Commit yes; Merge no until the Planner grants the exact approved merge action.
- Deferred to Phase 5: actual assignments/exposures and outcome ingestion, all five experiment surfaces, assignment stability, defaults on SDK failure, forced-traffic exclusion, and reading/subscription guardrails.

## Phase 5 : Final verification and corrections

- Type: FINAL_VERIFY.
- Objective: verify all ten use cases, vendor integrations, and deployed behavior, then correct failures before declaring the demo verified.
- Before dispatch: expand every deferred check above into a numbered case with route, persona/data state, steps, expected result, and evidence location; set exact viewport sizes, browser targets, vendor projects, and tool permissions in the handoff.
- Definition of done:
  1. P5-D1: `pnpm typecheck` and `pnpm build` exit 0 at the reviewed revision; every deferred case has PASS evidence and no required case remains FAIL or BLOCKED.
  2. P5-D2: browser cases verify all ten use cases, normal/error/empty/loading states, account lifecycle and reset, device simulation, keyboard access, responsive layouts, media, and simulation/sponsorship labels.
  3. P5-D3: vendor evidence verifies Amplitude ingestion and identity, funnels/cohorts/retention, replay masking, guide/survey targeting, and approved additional product checks; synthetic history and simulated revenue remain identifiable.
  4. P5-D4: vendor evidence verifies Statsig assignments, exposure timing, identity/outcome mapping, all planned treatments, forced-traffic handling, and usable defaults when either SDK is unavailable.
  5. P5-D5: GitHub Actions reports successful Pages deployment; the published revision passes home/deep-link refresh and asset checks, and screenshots plus a short video identify the tested revision without exposing secrets.
- Risks: vendor credentials, entitlements, or insufficient observed data can block verification; report BLOCKED rather than substituting local mocks. New corrections require the same Builder, a new assignment ID, and reruns of affected cases.
- Needs human approval to merge? Yes for any correction PR; an evidence-only review with no repository change has no merge action.
- Git permissions for the Builder: Commit yes for assigned corrections/evidence; Merge no until the Planner grants the exact approved merge action.
- Completion: the Planner records final verification only after all five items pass against the final revision and its deployment; any later correction invalidates affected evidence until rerun.
