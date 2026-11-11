# BUILDER_HANDOFF

**Status:** IDLE
**Phase:** 0 : Static scaffold and deployment
**phase_id:** 0
**assignment_id:** P0-BUILD-002
**phase_type:** BUILD
**Builder agent ID:** bc-3219cf40-a75c-507c-a345-62219ac5994e
**Branch:** phase-0-static-scaffold

Objective: prepare a static Amplitude Daily home page and GitHub Actions Pages workflow for publication after an approved merge.

## Steps

1. Read BUILDER.md, AGENTS.md, PROJECT_PLAN.md, DECISIONS.md if present, and PHASE_LOG.md if present; stop if **this assignment_id** (`P0-BUILD-002`) already has a COMPLETE or BLOCKED entry (prior `P0-BUILD-001` entries do not block).
2. Confirm the Planner has replaced the agent ID placeholder with this existing Builder's runtime ID; do not create another Builder. Confirm an existing git repository, an origin remote identifying the GitHub owner/repository, and its default branch. If any required value is missing, append BLOCKED to PHASE_LOG.md, notify only the Planner, and stop before editing product files.
3. **Waiver:** Per DECISIONS.md (2026-11-11), `docs/0/SPEC.md` is not required. Implement scaffold copy/layout from PROJECT_PLAN Phase 0 deliverables and this handoff’s definition of done (Amplitude Daily header/footer, tokens, one home headline, one linked article body). Do not invent later-phase navigation.
4. Inspect the working tree without changing it. Create or switch to `phase-0-static-scaffold` from the confirmed default branch only if unrelated changes will not be moved or overwritten; otherwise log BLOCKED. Do not fetch, pull, initialize a repository, or change remotes.
5. Create the TypeScript static-app scaffold and pnpm package/lock files. Define `pnpm typecheck`, `pnpm build`, and `pnpm preview`; configure production output as `dist/` and preview on port 4173. Use pnpm for dependencies and stop if registry access or required tooling is unavailable.
6. Set the Pages base path from the confirmed repository name, using `/` for an owner.github.io repository and `/<repository>/` otherwise. Add hash routing for home, one seeded article, and an unknown-route fallback; resolve local assets under the same base path.
7. Implement the waived Phase 0 scope: Amplitude Daily header/footer, typography/color tokens, one home headline, and its linked minimal article body. Store article data in the repo; render no links to unimplemented features.
8. Add `.github/workflows/deploy-pages.yml` to install locked dependencies, run typecheck and build, upload `dist/` with the Pages artifact action, and deploy with GitHub's Pages deployment action. Trigger deployment on pushes to the confirmed default branch only; do not deploy from feature branches or pull requests. Set only the workflow permissions required by those jobs.
9. Run `pnpm typecheck` and `pnpm build`. Start `pnpm preview --host 127.0.0.1 --port 4173 --strictPort` and perform the single smoke check below. Fix only in-scope failures; do not run full suites, browser walkthroughs, screenshots, or video.
10. Stage and commit only the permitted Phase 0 files and this assignment's PHASE_LOG.md evidence. Record the commands/results, smoke result, commit ID, Pages base path, local preview URL, and expected published URL. Label the published URL as unverified; do not claim deployment occurred.
11. Append COMPLETE only if every definition-of-done item passes; otherwise append BLOCKED with the exact missing decision or permission. Send the Planner the assignment ID, status, and log reference, then stop. Leave acceptance, merge approval, and deployment authorization to the Planner.

## Definition of done

- P0-D1: `pnpm typecheck` exits 0.
- P0-D2: `pnpm build` exits 0 and generates `dist/`; the Pages workflow uploads that same directory and contains no feature-branch or PR deployment trigger.
- P0-D3: one smoke check opens the production-preview home URL, shows “Amplitude Daily” and the seeded headline, follows its article link, and shows the matching article title/body without missing assets. Record the URL and observed result in PHASE_LOG.md.

## Allowed files and commands

- Edit/create: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` if required for dependency policy, `index.html`, `tsconfig*.json`, `vite.config.ts`, `.gitignore`, `.npmrc`, `src/**`, `public/**`, and `.github/workflows/deploy-pages.yml`; append PHASE_LOG.md. Keep each change limited to Phase 0.
- Read without editing: instruction files, project/decision/handoff files, `docs/**`, existing source/configuration, and git/workflow metadata. Do not commit generated `dist/` or `node_modules/`.
- Allow local file inspection, scaffold edits, pnpm dependency installation, the named typecheck/build/preview commands, and the single smoke check. Do not create paid services, request secret values, change GitHub settings, or run deployment commands.

## Git permissions

Git permissions: Commit: Yes | Merge: No

- Grant only local read-only git inspection, creation/switch to the named branch under Step 4, staging of the allowed changes, and commits on that branch for this assignment.
- Push: No. PR creation/update: No. Deployment: No. Remote/settings changes: No. Force push, reset, rebase, history rewrite, branch deletion, and unrelated-file staging: No.
- Do not treat Commit permission as permission to publish. The Planner must obtain a PR-specific approval and issue a separate reserved-action assignment before any merge or resulting deployment.

## Scope limits and blockers

- Do not install Amplitude, Statsig, or any analytics/experiment SDK in Phase 0. Do not implement search, accounts, subscriptions, media, advertising, or chat beyond the scaffold's seeded article.
- Log BLOCKED for missing credentials/access, new cost, unapproved irreversible actions, git permission gaps, unavailable required tools, or unclear scope; notify only the Planner.
- Treat GitHub Pages settings and post-merge deployment confirmation as later authorized actions; preparing the workflow does not authorize running it.
- Defer the viewport/deep-link matrix, full keyboard/accessibility audit, full workflow/security review, screenshots, and video to FINAL_VERIFY.

Do NOT proceed past this phase without checking in.
