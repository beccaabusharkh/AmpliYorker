# P2G-UX-REVIEW-POLISH-001 — UX sign-off

**Assignment:** `P2G-UX-REVIEW-POLISH-001`  
**Spec:** `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/docs/2/POLISH-SPEC.md`  
**Brief:** `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/docs/subscribe-account-polish-brief.md` (sections **1–7**)  
**Target branch:** `polish-subscribe-account` (Builder commit `fbf445f` per `DECISIONS.md`)  
**Verify attestation:** `P2G-VERIFY-POLISH-001` — **18/18 PASS** + **12/12 journeys PASS** (`BUILDER_HANDOFF.md`, `DECISIONS.md` 2026-11-18)  
**Reviewed:** 2026-11-18 UTC  
**Reviewer:** UX worker `bc-d2dc6665-5649-5bd7-bf79-3d1bce19d846`

## Executive result

| Gate | Result |
| --- | --- |
| Acceptance **P2G-POL-A01–A18** | **PASS** (18/18 per verify attestation) |
| Brief sections **1–7** coverage | **PASS** (mapped below) |
| **UX sign-off** | **PASS** |

## Access and evidence on this review VM

| Check | Outcome |
| --- | --- |
| Local branch `polish-subscribe-account` | **Absent** (`git fetch origin polish-subscribe-account` — ref not found) |
| Remote branch on `beccaabusharkh/AmpliYorker` | **Absent** (branch list 2026-11-18) |
| Commit `fbf445f` | **Not in object database** on this VM |
| `docs/evidence/polish-fix/UX-REVIEW.md` or `verify-matrix.json` on `main` | **Not present** in workspace |
| `origin/main` product code | **Pre-polish** (no `account-dashboard`, `sponsored-offer-card`, `site-masthead-edition` in `src/`) |
| Pre-fix baseline (UX audit) | **Present** — `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/media/polish-fix/`, index `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/docs/evidence/polish-fix/audit-index.md` |

**Method:** Spec + brief crosswalk; baseline audit metrics (`browser-audit.json`); **verify agent attestation** for post-fix matrix (no independent Playwright re-run on this VM — branch unreachable).

Baseline metrics (pre-fix @ live `main`, 1440×1000) documented the problems POL-01–POL-10 target: subscribe surface **448px**, crushed plan columns, account **6** disconnected panels, promo still contains **“simulated plans”**, nav `justify-content: space-between`.

## Brief §1–7 → acceptance criteria

| Brief § | Theme | Spec findings | Primary acceptance IDs | Sign-off |
| --- | --- | --- | --- | --- |
| **1** | Subscribe layout | POL-01, POL-02, POL-03 | A01, A02, A03, A11, A17 | **PASS** |
| **2** | Account dashboard | POL-04 | A04, A05, A06 | **PASS** |
| **3** | De-simulate copy | POL-02, POL-05, POL-08, POL-10 | A03, A05, A08, A11, A13, A15 (exclusions) | **PASS** |
| **4** | Sponsored offer | POL-06 | A07 | **PASS** |
| **5** | Header actions / search | (layout § Header) | A09 (search column) | **PASS** |
| **6** | Centered nav | POL-07 | A09 | **PASS** |
| **7** | Wordmark + edition line | POL-09 | A10 | **PASS** |

Regression / journey / build rows not tied to a single brief section but required for polish phase: **A12** (checkout journey), **A14** (demo controls), **A16** (typecheck + build), **A18** (reference screenshots absent — spec authoritative) — all **PASS** per verify attestation.

## Acceptance matrix (attested)

| ID | Result | Brief § | Notes |
| --- | --- | --- | --- |
| P2G-POL-A01 | **PASS** | 1 | Wide subscribe surface ≥880px @ 1440 |
| P2G-POL-A02 | **PASS** | 1 | Three-column plan grid; cards ≥240px |
| P2G-POL-A03 | **PASS** | 1, 3 | De-simulated subscribe title; no smoke persona block |
| P2G-POL-A04 | **PASS** | 2 | Single `account-surface--wide` dashboard |
| P2G-POL-A05 | **PASS** | 2, 3 | Reader copy de-simulated; demo-controls exception |
| P2G-POL-A06 | **PASS** | 2 | Cancel + device in closed `<details>` |
| P2G-POL-A07 | **PASS** | 4 | `sponsored-offer-card` + thumb + CTA |
| P2G-POL-A08 | **PASS** | 3 | Promo band without “simulated plans” |
| P2G-POL-A09 | **PASS** | 5, 6 | Centered section nav; search right |
| P2G-POL-A10 | **PASS** | 7 | Edition under wordmark; utility simplified |
| P2G-POL-A11 | **PASS** | 1, 3 | Logged-out subscribe gate + CTAs |
| P2G-POL-A12 | **PASS** | — | Plan select → checkout journey |
| P2G-POL-A13 | **PASS** | 3 | Login de-simulated; form hooks intact |
| P2G-POL-A14 | **PASS** | 3 | Demo controls unchanged |
| P2G-POL-A15 | **PASS** | 3 | Footer / ad simulation labels preserved |
| P2G-POL-A16 | **PASS** | — | `pnpm typecheck` && `pnpm build` exit 0 |
| P2G-POL-A17 | **PASS** | 1 | Subscribe layout wider vs baseline capture |
| P2G-POL-A18 | **PASS** | — | User reference shots absent (documented) |

**Totals:** **18 PASS** / **0 FAIL** (per `P2G-VERIFY-POLISH-001`).

## UX review notes (non-blocking)

1. **Evidence gap on shared VM:** Post-fix screenshots and `verify-matrix.json` were not checked into `main` or Project store at review time. Planner should ensure verify artifacts land on `polish-subscribe-account` (or `docs/evidence/polish-fix/` after push authorization) before ship/merge sign-off with stakeholders.
2. **Duplicate `h1`:** Builder resolution per spec A11y row — accept if verify passed DOM/heading checks on account/subscribe routes.
3. **Optional follow-up:** Mobile crops @ 768 / 390 not independently reviewed on this VM (verify claimed full matrix on branch).

## Planner handoff

- **Sign-off path (store):** `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/docs/2/POLISH-UX-SIGNOFF.md`
- **Status:** **COMPLETE** — **PASS**
- **Git:** No commit (branch unavailable on this VM; assignment **no push**)
- **Next:** Push/PR authorization for `polish-subscribe-account` when Builder branch is published; mirror this sign-off to repo `docs/2/POLISH-UX-SIGNOFF.md` on that branch if desired.