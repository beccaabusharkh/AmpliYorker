# BUILDER_HANDOFF

**Status:** IDLE
**Phase:** 2 photography-led visual fix
**phase_id:** 2
**assignment_id:** P2E-BUILD-PHOTO-001
**phase_type:** BUILD
**Builder agent ID:** bc-e05e21fe-01c2-5e95-981a-bb0d5f5193b2
**Branch:** `photo-editorial-v2`

## Objective

Implement **`docs/2/PHOTO-SPEC.md`** (READY). Replace SVG placeholders with stable raster assets; photo-forward ads (Northline, Sunday House, Margin Coffee); 60/40 hero; ≥8 homepage photos per HP-P01–P09; article heroes/inline per spec. Create `public/images/ASSET-MANIFEST.md` (+ optional JSON).

## Allowed files

`src/**`, `public/images/**`, `src/data/articles.json`, `src/data/ads.json`, `docs/evidence/photo-v2/**` (after verify), append `PHASE_LOG.md`. Do not change SDK init, Statsig catalog IDs, or route paths unless spec documents selector updates.

## Asset sourcing

Use appropriately licensed stock (document license in manifest) and/or generate photorealistic assets; **no** hotlinks, emoji, or CSS-as-image for required placements.

## Definition of done (BUILD)

| Check | Requirement |
| --- | --- |
| P2E-PHOTO-D1 | `pnpm typecheck` exit 0 |
| P2E-PHOTO-D2 | `pnpm build` exit 0 |
| P2E-PHOTO-D3 | Production preview: lead hero loads raster (not `hero-placeholder.svg`); ≥3 distinct photo URLs on home; 3 ad units render images |
| P2E-PHOTO-D4 | Paywall/checkout smoke path unchanged (registered-reader intro offer) |

Then run **P2E-VERIFY-PHOTO-001** same assignment if time: browser evidence per spec A01–A15 at 1440/768/390 into `docs/evidence/photo-v2/`.

## Git permissions

Git permissions: Commit: Yes on `photo-editorial-v2` | Merge: No | Push: No | PR: No | Deployment: No

Report COMPLETE/BLOCKED in PHASE_LOG to Planner.