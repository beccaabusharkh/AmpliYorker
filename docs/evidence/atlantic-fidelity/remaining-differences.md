# Remaining differences — Atlantic fidelity

**Context:** `P2H-VERIFY-FIDELITY-001` — all `P2H-FID-A01`–`A20` PASS; see [`UX-REVIEW.md`](./UX-REVIEW.md).  
**Reference:** Wayback `20251031235859` homepage (live Atlantic blocked in automation).

## Partial FID metrics (product vs Wayback monolith)

| ID | Status | What remains |
| --- | --- | --- |
| **FID-M07** | partial | Desktop **slim subscribe promo** (`data-subscribe-promo`) still sits below fused chrome @ ≥769px. Hidden @ ≤768px (tablet) and @ ≤390px (phone) for chrome-height acceptance. |
| **FID-M08** | partial | **Edition line** stays centered in chrome (`Today’s edition · …`); Atlantic hides this inside a single nav block. |
| **FID-M11** | partial | Fused chrome **~155px @ 1440** — shorter than Atlantic’s measured **~294px** nav-to-main offset (Wayback); intentional product promo + section row. |

Source notes: `p2h-p2-geometry.json` → `fidStatus`.

## Historical baseline gaps (pre-P1 — largely addressed in code)

From [`annotated-comparison.md`](./annotated-comparison.md); P1/P2 addressed items marked **done** in geometry JSON:

| Gap | Pre-fidelity | Post verify |
| --- | --- | --- |
| Page inset @ 1440 | 144px margin / 1200px grid | **80px** gutter, **1280px** mosaic (**addressed**) |
| Opening topology | 820+300 two-column | **296/624/296** mosaic (**addressed**) |
| Lead image | 820×280 banner | **624×416 @ 3:2** desktop; **358×239** mobile (**addressed**) |
| Mobile lead order | Copy-first | **Image-first** (**addressed**) |
| Mobile chrome | ~308px with promo stack | **~101px** chrome @ 390 (**addressed**) |
| Secondary type | 16px | **18px** rail/feed (**addressed**) |

## Not chasing in this slice

- **Leaderboard / ad slot** above opening grid (AmpliYorker product surface).
- **Persona banner** when simulated session is active.
- **Wordmark as SVG** vs text masthead.
- **Live theatlantic.com** capture (WAF); Wayback remains reference.

## Evidence for ongoing UX diff

- Geometry: `p2h-p1-geometry.json`, `p2h-p2-geometry.json`
- Annotated pairs: `annotated-before-after-1440.png`, `annotated-before-after-390.png`, `side-by-side-p1-*.png`