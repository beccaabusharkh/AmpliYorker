# UX_HANDOFF

**Status:** START
**Phase:** 2 editorial redesign
**phase_id:** 2
**assignment_id:** P2-UX-EDITORIAL-001
**phase_type:** UX_AUDIT
**UX agent ID:** bc-30eaabed-cb54-5de3-844c-8423f61f33f4
**Audited baseline:** `main` post Phase 5 (`b077491`+, live https://beccaabusharkh.github.io/AmpliYorker/); implementation branch `editorial-redesign`

## Objective

Produce `docs/2/SPEC.md` (`READY`) for a premium fictional newspaper/magazine redesign: New Yorker long-form reading character + NYT homepage hierarchy/density. Original copy and art direction; keep publication name **Amplitude Daily**. Structural reference only: https://www.newyorker.com/magazine/2026/11/23/would-you-dissect-a-human-body

Full requirement list: `/cursor/stores/self/docs/editorial-redesign-brief.md` (read via Project store). Preserve Phases 2–5 journeys (accounts, paywall, checkout, retention, Amplitude, Statsig, demo controls).

## Routes and surfaces (minimum)

- Home (utility row, masthead, section nav, tabs Top Stories / Latest / For You, lead grid, feature art block, modules listed in brief)
- Section fronts: Technology, Business, Culture, Science, Opinion
- Article (long-form template + shorter formats)
- Author, Search (+ empty), Saved, Newsletter states, 404
- Simulated ad units (banner, sidebar, mobile) + three campaign landings/modals
- Sponsored editorial module (distinct label)
- “Ask the Daily” assistant (welcome, prompts, history, minimize/close/restart, mobile full-screen)
- Demo Controls (collapsible, does not cover reader chrome)

## Spec requirements

Follow `UX.md`. Include exact tokens (ivory background, near-black text, serif headline/body pairing, sans meta/nav), component IDs, copy verbatim, spacing at 1440 / 768 / 390, focus/hover/reduced-motion, simulation labels, ad/sponsored labels (“Advertisement · Fictional brand”), content inventory table (≥18 stories with section, type, word target, premium flag, module placements), six long-form features outlined, assistant scripted intents, and acceptance IDs mapped to PROJECT_PLAN P2E-D* and deferred Phase 5 matrix.

## Permissions

- **Write:** `docs/2/SPEC.md` only
- **Git:** none
- **Commands:** read-only repo inspection; optional `pnpm preview` if environment provides built `phase-2-accounts` artifacts (else audit from `main` + handoff narrative)

## Stop

Mark `BLOCKED` with `Blocked decisions` if scope conflicts with preserved journeys. Report to Planner only via spec.