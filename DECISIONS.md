# Decisions and approvals

## 2026-11-11 — Planner dispatch Phase 0

- **Decision:** Dispatch assignment `P0-BUILD-001` to Builder `bc-3219cf40-a75c-507c-a345-62219ac5994e` with `BUILDER_HANDOFF.md` Status START, Git **Commit yes / Merge no**.
- **Merge policy:** No merge to `main` without a top-level Slack `Approve` from `<@U045L8FS5BN>` naming exactly one PR (per PLANNER.md).
- **Blocker (resolved):** `docs/0/SPEC.md` waived — see waiver below.
- **Blocker (resolved):** Slack `#bas-cursor` → `C0CGUUSJ4TG`.

## 2026-11-11 — Phase 0 UX spec waiver

- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **Channel:** `#bas-cursor` (`C0CGUUSJ4TG`)
- **Slack ts (processed):** `1794431421.518979`
- **Request:** `@PLANNER waive Phase 0 UX spec; use BUILDER_HANDOFF / PROJECT_PLAN Phase 0 defaults for copy and layout.`
- **Decision:** Waive requirement for `docs/0/SPEC.md` (READY) for Phase 0 scaffold only. Builder assignment **`P0-BUILD-002`** may implement home shell using PROJECT_PLAN Phase 0 deliverables: Amplitude Daily branding, header/footer, typography/color tokens, one seeded headline and linked article body, hash routing, `/AmpliYorker/` base path, Pages workflow. No expansion beyond Phase 0 handoff scope.
- **Does not authorize:** merge, push, PR, deploy, or waiver of later-phase UX specs.

## 2026-11-11 — Phase 0 builder acceptance (`P0-BUILD-002`)

- **Planner review:** Builder COMPLETE entry `2026-11-11T21:13:30Z` on assignment `P0-BUILD-002`.
- **Reviewed commit:** `54a3232` on branch `phase-0-static-scaffold` (Builder VM only; not on `origin` until push is authorized).
- **Acceptance:** P0-D1 PASS, P0-D2 PASS, P0-D3 PASS (production preview smoke per PHASE_LOG; `deploy-pages.yml` uploads `dist/`, `main` push only).
- **Scope:** Permitted Phase 0 scaffold/workflow files only; no Amplitude/Statsig SDK; no edits to agent instruction files beyond `PHASE_LOG.md` append on feature branch.
- **UX:** Per waiver (Slack ts `1794431421.518979`).
- **Does not authorize:** push, PR, merge, or deploy — separate handoff permissions required.

## Approval records

_(none yet — `Approve` reserved for PR merge actions)_

## Processed Slack timestamps

- `1794431421.518979` — Phase 0 UX spec waiver (not a merge Approve)
