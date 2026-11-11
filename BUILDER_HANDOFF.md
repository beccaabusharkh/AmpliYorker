# BUILDER_HANDOFF

**Status:** IDLE
**Phase:** 0 : Static scaffold and deployment
**phase_id:** 0
**assignment_id:** P0-PUBLISH-001
**phase_type:** BUILD
**Builder agent ID:** bc-3219cf40-a75c-507c-a345-62219ac5994e
**Branch:** phase-0-static-scaffold
**Base branch:** main

Objective: publish the Planner-accepted Phase 0 scaffold (`P0-BUILD-002`, reviewed commit `54a3232`) by pushing `phase-0-static-scaffold` and opening one PR to `main`. No product changes unless required to resolve a push/PR blocker.

## Steps

1. Read BUILDER.md, DECISIONS.md, and PHASE_LOG.md. Stop if this assignment_id already has COMPLETE or BLOCKED.
2. Confirm you are on `phase-0-static-scaffold` with the accepted scaffold work (commit `54a3232` or a descendant containing the same Phase 0 file set). Do not rebuild or re-run acceptance checks unless the branch was corrupted.
3. `git fetch origin main` (read only). If `main` moved, merge `origin/main` into `phase-0-static-scaffold` only if needed for a clean push; do not edit product scope beyond conflict resolution in permitted Phase 0 files.
4. Push `phase-0-static-scaffold` to `origin` (set upstream). Do not force-push.
5. Create one pull request: **base `main`**, **head `phase-0-static-scaffold`**. Title: `feat(phase-0): static Amplitude Daily scaffold and Pages workflow`. Body: note assignment `P0-BUILD-002` accepted (P0-D1–D3 PASS), reviewed commit, and that merge awaits Planner + Slack `Approve` per DECISIONS.md. Do not request human review in the PR body beyond factual summary.
6. Append PHASE_LOG.md COMPLETE for `P0-PUBLISH-001` with push result, PR URL, and PR head SHA. Commit and push that log append if the handoff grants Commit for log-only follow-up; otherwise include log text in the Planner report and note BLOCKED if log cannot be pushed.
7. Report to the Planner: assignment_id, status, PR URL, and head commit SHA. Stop. Do not merge.

## Definition of done

- P0-PUB-D1: `origin/phase-0-static-scaffold` exists and points at the scaffold commit containing the accepted Phase 0 deliverables.
- P0-PUB-D2: One open PR into `main` from `phase-0-static-scaffold`; PR URL recorded in PHASE_LOG or Planner report.

## Allowed files and commands

- Git: fetch, push branch `phase-0-static-scaffold`, merge `origin/main` into that branch when required for push/PR, log-only commits on that branch.
- `gh pr create` / equivalent authorized PR creation for this repo only.
- Read-only inspection elsewhere. No edits to planner-owned repo-root instruction files on this branch unless a merge conflict forces resolution in a file this assignment already changed.

## Git permissions

Git permissions: Commit: Yes (log append on feature branch only) | Merge: No

- Push: **Yes** — branch `phase-0-static-scaffold` to `origin` only.
- PR creation/update: **Yes** — one new PR to `main` for this branch.
- Merge: **No**. Deployment: **No**. Force push, reset, rebase, history rewrite, branch deletion: **No**.

## Scope limits

- Publish the existing accepted build only; do not implement Phase 1+ work or change scaffold behavior.
- Merge and GitHub Pages deploy remain blocked until a separate handoff with RESERVED Slack `Approve`.

Do NOT proceed past this phase without checking in.
