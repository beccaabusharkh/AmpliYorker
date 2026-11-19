# UX diff — Phase 1 fidelity

## P1b — FID-M06 mobile chrome (P2H-BUILD-FIDELITY-P1b-001)

| Metric | Before P1b | After P1b | Target |
| --- | --- | --- | --- |
| `chromeHeight` @ 390 | 187px | **101px** | ~102px |
| Promo @ 390 | visible | **hidden** (`display: none`) | hide or slim |
| Section search @ 390 | visible | hidden | collapse chrome |

Changes: horizontal brand/actions row, compact nav, hide promo band on ≤390, sr-only Newsletter on 390.

Evidence: `p2h-p1-geometry.json`, `ampliyorker-after-p1-390.png`, `side-by-side-p1-390.png`.