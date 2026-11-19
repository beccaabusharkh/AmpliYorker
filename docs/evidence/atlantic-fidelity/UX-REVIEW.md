# UX review — Atlantic fidelity verify (`P2H-VERIFY-FIDELITY-001`)

**Branch:** `atlantic-fidelity`  
**Verified build:** see `verify-matrix.json` → `buildSha`  
**Spec:** [`docs/2/ATLANTIC-FIDELITY-SPEC.md`](../../2/ATLANTIC-FIDELITY-SPEC.md)  
**Playwright:** `scripts/verify-fidelity-a01-a20.mjs` @ 1440 / 1024 / 768 / 390

## Summary

| Gate | Result |
| --- | --- |
| **Acceptance (`P2H-FID-A01`–`A20`)** | **20 / 20 PASS** |
| **Smoke journeys** | **9 / 9 PASS** |
| **Typecheck + production build** | PASS (`verify-typecheck-build.log`) |

## Acceptance matrix

| ID | Title | 1440 | 1024 | 768 | 390 | Overall |
| --- | --- | --- | --- | --- | --- | --- |
| A01 | Page gutter | PASS | PASS | PASS | PASS | PASS |
| A02 | Container max 1280 | PASS | PASS | PASS | PASS | PASS |
| A03 | Desktop chrome stack | PASS | PASS | PASS | PASS | PASS |
| A04 | Mobile/tablet chrome stack | PASS | PASS | PASS | PASS | PASS |
| A05 | Utility actions in chrome | PASS | PASS | PASS | PASS | PASS |
| A06 | Opening 3-column mosaic | PASS | PASS | PASS | PASS | PASS |
| A07 | Lead column 624px | PASS | PASS | — | — | PASS |
| A08 | Side rails 296px | PASS | PASS | — | — | PASS |
| A09 | Lead image 3:2 cap | PASS | PASS | — | — | PASS |
| A10 | Mobile lead image box | — | — | — | PASS | PASS |
| A11 | Image before headline | PASS | PASS | PASS | PASS | PASS |
| A12 | Lead headline sizes | PASS | PASS | PASS | PASS | PASS |
| A13 | Rail headline 18px | PASS | PASS | PASS | PASS | PASS |
| A14 | Hairline rules | PASS | PASS | PASS | PASS | PASS |
| A15 | White canvas | PASS | PASS | PASS | PASS | PASS |
| A16 | DOM hooks / router IDs | PASS (smoke) | — | — | — | PASS |
| A17 | Secondary thumb policy | PASS | PASS | PASS | PASS | PASS |
| A18 | Sidebar width cap | PASS | PASS | PASS | PASS | PASS |
| A19 | Evidence folder | PASS | PASS | PASS | PASS | PASS |
| A20 | Wayback side-by-side pairs | PASS | PASS | PASS | PASS | PASS |

Detail per viewport: `verify-matrix.json` → `viewportMatrix`.

## Journeys exercised

| ID | Journey | Result |
| --- | --- | --- |
| J01 | Home opening mosaic @ 1440 | PASS |
| J02 | Mobile image-first + compact chrome @ 390 | PASS |
| J03 | Fidelity chrome hooks (`data-*` selectors) | PASS |
| J04 | Home tabs → experimentation feed | PASS |
| J05 | Header search → article results | PASS |
| J06 | Topic route (`product-analytics`) | PASS |
| J07 | Article body surface | PASS |
| J08 | Subscribe / account regression | PASS |
| J09 | Home scroll (video) | PASS |

Recording: `journey-home-fidelity.webm`

## Visual evidence (before / after)

| Artifact | Description |
| --- | --- |
| `annotated-before-after-1440.png` | Pre-fidelity desktop baseline vs verify capture |
| `annotated-before-after-390.png` | Pre-fidelity mobile baseline vs verify capture |
| `verify-home-1440.png` / `verify-home-390.png` | Post-fidelity verify screenshots |
| `side-by-side-p1-1440.png` / `side-by-side-p1-390.png` | Wayback reference vs after P1 |
| `reference-wayback-1440.png` / `reference-wayback-390.png` | Archived Atlantic reference crops |

## UX sign-off

Opening mosaic, gutters, type, and below-fold rhythm meet automated acceptance for this slice. Residual Atlantic-vs-product differences are listed in [`remaining-differences.md`](./remaining-differences.md) (partial FID-M07/M08/M11 and historical Wayback deltas).