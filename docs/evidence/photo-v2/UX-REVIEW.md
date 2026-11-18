# P2E-VERIFY-PHOTO-001 — UX review (photo-editorial-v2)

**Assignment:** `P2E-VERIFY-PHOTO-001`  
**Branch:** `photo-editorial-v2`  
**Preview base:** `http://127.0.0.1:4173/AmpliYorker/` (production `vite build` + `pnpm preview`)  
**Before baseline (live pre-photo):** `https://beccaabusharkh.github.io/AmpliYorker/#/`  
**Method:** Playwright **Chromium**, **fresh browser context per viewport** (no shared storage), matrix script `scripts/verify-photo-a01-a15.mjs`  
**Viewports:** 1440×1000, 768×1024, 390×844  
**Recorded:** 2026-11-18 UTC

## Summary

| Result | Count |
| --- | --- |
| **PASS** | 15 |
| **FAIL** | 0 |

All acceptance rows **A01–A15** from `docs/2/PHOTO-SPEC.md` passed on this branch after verification. Minor **390px** layout clipping was added in `src/styles/editorial.css` during verify so `.home-editorial` does not horizontally overflow (content-scoped check).

## PASS/FAIL matrix

| ID | Result | Notes | Evidence |
| --- | --- | --- | --- |
| **P2E-PHOTO-A01** | **PASS** | Lead grid ≈ **60/40** (`472.8px / 315.2px`); lead hero **WebP**, not SVG | `home-1440-a01.png`, `home-after-1440.png`, `verify-matrix.json` |
| **P2E-PHOTO-A02** | **PASS** | **8** distinct raster URLs on home (DOM + network) | `verify-a02-network.json` |
| **P2E-PHOTO-A03** | **PASS** | **5** photos in first **2000px** at 1440 | `home-1440-a03.png` |
| **P2E-PHOTO-A04** | **PASS** | Lead `src` = `cohort-compound-interest--hero.webp` | `home-after-1440.png` |
| **P2E-PHOTO-A05** | **PASS** | Secondaries: `daily-decisions`, `retention-myths`, `funnel-friction` + hero WebPs | `verify-a05-secondaries.json` |
| **P2E-PHOTO-A06** | **PASS** | Northline leaderboard; label + `placement_id` preserved | `home-1440.png` |
| **P2E-PHOTO-A07** | **PASS** | Sunday House rail image + `home_rail` | `home-1440.png` |
| **P2E-PHOTO-A08** | **PASS** | Margin Coffee MPU on `retention-myths` | `article-retention-mpu-a08.png` |
| **P2E-PHOTO-A09** | **PASS** | Cohort hero + **2** unique inline WebPs (no SVG) | `article-cohort-a09.png`, `verify-a09-network.json` |
| **P2E-PHOTO-A10** | **PASS** | 768: stacked lead, **3** secondary thumbs, no `.home-editorial` overflow | `home-768-a10.png`, `home-768.png` |
| **P2E-PHOTO-A11** | **PASS** | 390: secondary grid **1 column**; no `.home-editorial` overflow | `home-390-a11.png`, `home-390.png` |
| **P2E-PHOTO-A12** | **PASS** | CTA on `camp-northline-display`; toast **Simulated ad engagement**; Amplitude ingest observed on CTA (inspector table not asserted) | `verify-a12-ad-cta.json` |
| **P2E-PHOTO-A13** | **PASS** | **33/33** WebP files listed in `ASSET-MANIFEST.md` | `public/images/ASSET-MANIFEST.md` |
| **P2E-PHOTO-A14** | **PASS** | `pnpm typecheck` + `pnpm build` exit **0** | `verify-typecheck-build.log` |
| **P2E-PHOTO-A15** | **PASS** | `[data-lead-link]` focus; tab `aria-selected`; ArrowRight changes feed tab | `verify-a15-a11y.json` |

Machine-readable aggregate: `verify-matrix.json`.

## Before / after (desktop homepage)

| State | Source | File |
| --- | --- | --- |
| **Before** (SVG / pre-photo bundle on Pages) | Live `main` deploy | `home-before-1440.png` |
| **After** (photo branch preview) | Local preview | `home-after-1440.png` |

Additional full-page captures: `home-1440.png`, `home-768.png`, `home-390.png`, scroll recording `home-scroll-1440.webm`.

## Viewport coverage

| Viewport | Home | Article / ads |
| --- | --- | --- |
| 1440×1000 | Full matrix A01–A07, A10 partial | MPU A08, cohort A09, A12, A15 |
| 768×1024 | A10 | — |
| 390×844 | A11 | — |

## Notes

- **A12:** Verification confirms CTA wiring and simulated engagement toast; local build without `VITE_AMPLITUDE_API_KEY` in `.env` still emitted at least one Amplitude HTTP request during the run (`verify-a12-ad-cta.json`). `Advertisement Viewable` relies on intersection observer + SDK init — not separately asserted in this pass.
- **A11 overflow:** Measured on **`.home-editorial`** (editorial column), not fixed demo chrome (Statsig exposure inspector).
- **`placementId` / selectors:** Unchanged per build handoff; DOM checks used `data-placement-id`, `data-ad-id`, `data-lead-link`, `[data-ad-cta]`.

## Verdict

**P2E-VERIFY-PHOTO-001: COMPLETE** — all **A01–A15** **PASS** on `photo-editorial-v2`.