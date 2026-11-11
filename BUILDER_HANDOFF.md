# BUILDER_HANDOFF

**Status:** START
**Phase:** 1 : Discovery, reading, and engagement
**phase_id:** 1
**assignment_id:** P1-BUILD-001
**phase_type:** BUILD
**Builder agent ID:** <RESUME_EXISTING_BUILDER — same Builder thread as Phase 0; do not spawn a replacement>
**Branch:** phase-1-discovery

Objective: extend the live AmpliYorker site with reader discovery and engagement journeys (search, expanded content, recommendations, media, newsletter simulation, labeled ads/sponsored stories, and scripted discovery chat) while keeping accounts, Amplitude, and Statsig out of scope.

## Prerequisites

1. Read BUILDER.md, AGENTS.md, PROJECT_PLAN.md, DECISIONS.md, and PHASE_LOG.md; stop if **P1-BUILD-001** already has COMPLETE or BLOCKED.
2. Confirm origin default branch is `main` and Phase 0 is deployed at `https://beccaabusharkh.github.io/AmpliYorker/`.
3. Read `docs/1/SPEC.md` when status is READY; if missing, follow PROJECT_PLAN Phase 1 deliverables and DECISIONS.md interim UX waiver (use simulation/sponsored labels exactly as specified below).
4. Create or switch to `phase-1-discovery` from `main` without disturbing unrelated work.

## Steps

1. Expand repo content: at least **6** articles in `src/data/articles.json` with ids, headlines, decks, bodies, `publishedAt`, **topic** slug, and **author** slug; include the existing `daily-decisions` article.
2. Add hash routes and pages for **home** (hero + lists), **article** (existing pattern), **search** (`#/search` with query in hash or input state), **topic** (`#/topic/<slug>`), **author** (`#/author/<slug>`), and keep **not-found** fallback.
3. **Search:** header search field; submitting a query navigates to search results ranking headline/deck/body substring matches (case-insensitive); empty query shows guidance copy; no matches show empty state copy.
4. **Recommendations:** on article pages show “More for you” with 3 deterministic related articles (same topic first, then recency).
5. **Reading progress:** per-article percent stored in `localStorage`; show a slim progress bar on article pages while scrolling.
6. **Media:** one **narrated article** block (HTML5 audio with repo-hosted or placeholder audio URL under `public/`) and one **podcast** card on home linking to a static show notes article or section.
7. **Newsletter:** footer or home module with email field; submit shows inline success (“Simulated signup — no email sent”) without network calls.
8. **Ads / sponsored:** home includes one clearly labeled **“Sponsored story”** card (distinct visual treatment) and one **“Advertisement (simulated)”** rail unit; neither navigates to unimplemented checkout.
9. **Discovery chat:** floating panel or footer entry opens scripted Q&A (keyboard focusable); answers drawn from seeded FAQ strings in repo; disclose “Simulated assistant” in the panel header.
10. Extend `src/ui/shell.ts` navigation only for implemented routes; no login/subscription links.
11. Run `pnpm typecheck`, `pnpm build`, and the smoke check below on production preview (`pnpm preview --host 127.0.0.1 --port 4173 --strictPort`).
12. Commit only Phase 1 files on `phase-1-discovery`; log COMPLETE or BLOCKED in PHASE_LOG.md; notify the Planner only.

## Definition of done

- P1-D1: `pnpm typecheck` exits 0.
- P1-D2: `pnpm build` exits 0.
- P1-D3: one smoke check on production preview searches for a seeded headline distinct from the Phase 0 feature (e.g. any new article title), opens the first result, and shows matching title and body text. Record URLs and observed strings in PHASE_LOG.md.

## Allowed files and commands

- Edit/create: `package.json`, `pnpm-lock.yaml` (only if new deps required—prefer no new runtime deps), `index.html`, `tsconfig*.json`, `vite.config.ts`, `src/**`, `public/**`; append `PHASE_LOG.md`.
- Do not edit Planner-owned files, `.github/workflows/*`, or Phase 0-only decisions except as needed for routes/content.
- Commands: `pnpm install` (if lock changes), `pnpm typecheck`, `pnpm build`, `pnpm preview` for smoke only.

## Git permissions

Git permissions: Commit: Yes | Merge: No | Push: No | PR: No | Deployment: No

- Local branch `phase-1-discovery`, stage allowed files, commit on that branch only.
- No push until a separate Planner publish assignment.

## Scope limits

- No `@amplitude/unified`, Statsig, accounts, paywalls, or real newsletter/email services.
- Defer full viewport matrix, accessibility audit, and live deploy verification to Phase 5.

Do NOT proceed past this phase without checking in.
