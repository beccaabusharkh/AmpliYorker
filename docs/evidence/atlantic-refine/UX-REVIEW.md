# P2F-VERIFY-ATLANTIC-001 — UX review

**Assignment:** `P2F-VERIFY-ATLANTIC-001`  
**Branch:** `atlantic-refinement` (build `a7b38be`+)  
**Preview:** `http://127.0.0.1:4174/AmpliYorker/` (`pnpm build` + `pnpm preview`)  
**Method:** Playwright Chromium — **fresh context per viewport/journey**  
**Viewports:** 1440×1000, 768×1024, 390×844  
**Recorded:** 2026-11-18 UTC

## Summary

| Result | Count |
| --- | --- |
| **PASS** (A01–A20) | **20** |
| **FAIL** | **0** |
| **Journeys (11)** | **11/11 PASS** |

## Acceptance matrix (A01–A20)

| ID | Result | Notes | Evidence |
| --- | --- | --- | --- |
| P2F-ATL-A01 | **PASS** | `rgb(255,255,255)` body | `home-1440.png` |
| P2F-ATL-A02 | **PASS** | Flex lead; copy before image; no 3fr 2fr | `home-1440.png`, `verify-matrix.json` |
| P2F-ATL-A03 | **PASS** | Lead height **280px** @ 1440 | `home-1440.png` |
| P2F-ATL-A04 | **PASS** | Promo verbatim copy; masthead **71px** | `home-1440.png` |
| P2F-ATL-A05 | **PASS** | Secondary 16:9 thumb ≤140px | `home-1440.png` |
| P2F-ATL-A06 | **PASS** | 390: no editorial overflow; lead 200px; promo stacks | `home-390.png` |
| P2F-ATL-A07 | **PASS** | Leaderboard image **90px**; `home_leaderboard` | `home-1440.png` |
| P2F-ATL-A08 | **PASS** | Article hero ≤420px; reading progress after scroll | `article-cohort-1440.png` |
| P2F-ATL-A09 | **PASS** | Paywall preview + `paywall-subscribe-btn` | `article-paywall-1440.png` |
| P2F-ATL-A10 | **PASS** | `account-surface` + `data-login-form` | `login-1440.png` |
| P2F-ATL-A11 | **PASS** | 3 plans; Recommended on annual; 6 `data-select-plan` CTAs | `subscribe-1440.png` |
| P2F-ATL-A12 | **PASS** | Premium intro → checkout | `checkout-premium-1440.png` |
| P2F-ATL-A13 | **PASS** | Panel ≥24rem; chips; close + **Alt+D** toggle | `ask-daily-1440.png` |
| P2F-ATL-A14 | **PASS** | Tab keyboard → experimentation | `verify-a14-tabs.json` |
| P2F-ATL-A15 | **PASS** | Ad CTA toast | `verify-a15-ad-cta.json` |
| P2F-ATL-A16 | **PASS** | typecheck + build exit 0 | `verify-typecheck-build.log` |
| P2F-ATL-A17 | **PASS** | Lead smaller vs `ampliyorker-baseline-1440.png` | baseline + `home-1440.png` |
| P2F-ATL-A18 | **PASS** | Exposure inspector mounted | `verify-a18-statsig.json` |
| P2F-ATL-A19 | **PASS** | ≥8 home rasters (photo regression) | `verify-a19-network.json` |
| P2F-ATL-A20 | **PASS** | Reference screenshots absent — spec authoritative | `docs/2/ATLANTIC-SPEC.md` |

Machine-readable: `verify-matrix.json`

## Eleven journeys

| ID | Result | Route / action | Evidence |
| --- | --- | --- | --- |
| J01 | **PASS** | `#/` Atlantic home | `home-1440.png` |
| J02 | **PASS** | `#/article/cohort-compound-interest` | `article-cohort-1440.png` |
| J03 | **PASS** | Premium paywall logged out | `article-paywall-1440.png` |
| J04 | **PASS** | Post-checkout unlock `retention-myths` | (journey in `verify-journeys.json`) |
| J05 | **PASS** | `#/search/retention` | — |
| J06 | **PASS** | `#/topic/product-analytics` | — |
| J06_login | **PASS** | `#/account/login` | `login-1440.png` |
| J06b_register | **PASS** | `#/account/register` | `register-1440.png` |
| J07 | **PASS** | Premium intro checkout | `checkout-premium-1440.png` |
| J08 | **PASS** | 3-plan subscribe | `subscribe-1440.png` |
| J11 | **PASS** | Ask the Daily @ 390 — panel open, **Tab** from chat input | `ask-daily-mobile-390.png`, `verify-mobile-chat-keyboard.json` |

`verify-journeys.json`

## Screenshots @ 1440 / 768 / 390

| Viewport | Home | Article / account |
| --- | --- | --- |
| 1440 | `home-1440.png` | cohort, paywall, login, subscribe, checkout, ask-daily |
| 768 | `home-768.png` | — |
| 390 | `home-390.png` | `ask-daily-mobile-390.png` |

## Mobile chat keyboard

`verify-mobile-chat-keyboard.json` — FAB opens panel @ 390×844; focus in `#chat-input`; **Tab** moves focus to submit **BUTTON**.

## Verdict

**P2F-VERIFY-ATLANTIC-001: COMPLETE** — **20/20** acceptance criteria **PASS**; **11/11** journeys **PASS**.

Repro: `node scripts/verify-atlantic-a01-a20.mjs` (requires preview on port **4174**).