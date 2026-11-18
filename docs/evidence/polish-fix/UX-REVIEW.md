# P2G-VERIFY-POLISH-001 — UX review

**Assignment:** `P2G-VERIFY-POLISH-001`  
**Branch:** `polish-subscribe-account`  
**Preview:** `http://127.0.0.1:4174/AmpliYorker/` (`pnpm build` + `pnpm preview`)  
**Method:** Playwright Chromium — **fresh context per viewport/journey** (storage cleared); continuous resize on subscribe/account  
**Viewports:** 1440×1000, 1024×900, 768×1024, 390×844  
**Recorded:** 2026-11-18 UTC

## Summary

| Result | Count |
| --- | --- |
| **PASS** (P2G-POL-A01–A18) | **18** |
| **FAIL** | **0** |
| **Journeys** | **12/12 PASS** |
| **Reader copy grep** | **0 leaks** (`verify-copy-grep.json`) |

## Acceptance matrix (A01–A18)

| ID | Result | Notes | Evidence |
| --- | --- | --- | --- |
| P2G-POL-A01 | **PASS** | Wide surface ≥880px @1440; responsive min width @≤768 | `subscribe-signed-in-*.png` |
| P2G-POL-A02 | **PASS** | 3×≥240px @≥769; single column @≤768 | `verify-matrix.json` |
| P2G-POL-A03 | **PASS** | No simulated subscription / smoke persona | — |
| P2G-POL-A04 | **PASS** | One dashboard; ≤2 top-level non-details sections | `account-signed-in-*.png` |
| P2G-POL-A05 | **PASS** | No reader “simulated” except demo/persona | — |
| P2G-POL-A06 | **PASS** | Cancel + device `<details>` closed | — |
| P2G-POL-A07 | **PASS** | Sponsored offer card + thumb + CTA | `home-header-*.png` |
| P2G-POL-A08 | **PASS** | Promo “plans from $12/month”; no simulated plans | — |
| P2G-POL-A09 | **PASS** | Nav grid; centered links; search right @1440 | `home-header-1440.png` |
| P2G-POL-A10 | **PASS** | `.site-masthead-edition`; no utility left date | — |
| P2G-POL-A11 | **PASS** | Logged-out gate; Log in / Create account | `subscribe-signed-out-1440.png` |
| P2G-POL-A12 | **PASS** | Annual intro → checkout → account dashboard | `journey-subscribe-account.webm` |
| P2G-POL-A13 | **PASS** | Login title + `data-login-form` | `login-1440.png` |
| P2G-POL-A14 | **PASS** | `details.demo-controls` summary still simulated | `account-signed-in-1440.png` |
| P2G-POL-A15 | **PASS** | Footer + `Advertisement · Simulated` unchanged | — |
| P2G-POL-A16 | **PASS** | typecheck + build exit 0 | `verify-typecheck-build.log` |
| P2G-POL-A17 | **PASS** | Subscribe surface ~896px vs baseline ~448px | `subscribe-baseline-1440.png` |
| P2G-POL-A18 | **PASS** | User refs absent — live baseline documented | spec § Audit |

Per-viewport breakdown: `verify-matrix.json` → `viewportMatrix`

## Journeys (12)

| ID | Result | Action | Evidence |
| --- | --- | --- | --- |
| J01_home_polish | **PASS** | Header + promo + sponsored @1440 | `home-header-1440.png` |
| J02_subscribe_logged_out | **PASS** | `#/subscribe` gate | `subscribe-signed-out-1440.png` |
| J03_login_desim | **PASS** | `#/account/login` | `login-1440.png` |
| J04_subscribe_wide | **PASS** | 3-plan wide grid logged in | `subscribe-signed-in-1440.png` |
| J05_subscribe_checkout_account | **PASS** | Subscribe → checkout → account (video) | `journey-subscribe-account.webm` |
| J06_account_dashboard | **PASS** | Dashboard shell | `account-signed-in-1440.png` |
| J07_sponsored_offer | **PASS** | Partner briefing CTA → article | — |
| J08_header_search | **PASS** | Header search “retention” | — |
| J09_register | **PASS** | `#/account/register` | `register-1440.png` |
| J10_paywall_login | **PASS** | Paywall **Log in** copy | — |
| J11_topic | **PASS** | `#/topic/product-analytics` | — |
| J12_resize_spotcheck | **PASS** | 1440→1024→768→390→768→1440 | `verify-resize-spotcheck.json` |

`verify-journeys.json`

## Screenshots

| Viewport | Subscribe (in) | Subscribe (out) | Account | Header |
| --- | --- | --- | --- | --- |
| 1440 | `subscribe-signed-in-1440.png` | `subscribe-signed-out-1440.png` | `account-signed-in-1440.png` | `home-header-1440.png` |
| 1024 | `subscribe-signed-in-1024.png` | — | `account-signed-in-1024.png` | `home-header-1024.png` |
| 768 | `subscribe-signed-in-768.png` | `subscribe-signed-out-768.png` | `account-signed-in-768.png` | `home-header-768.png` |
| 390 | `subscribe-signed-in-390.png` | `subscribe-signed-out-390.png` | `account-signed-in-390.png` | `home-header-390.png` |

## Verdict

**P2G-VERIFY-POLISH-001: COMPLETE** — **18/18** acceptance **PASS**; **12/12** journeys **PASS**; copy grep **PASS**.

Repro: `node scripts/verify-polish-a01-a18.mjs` (preview on port **4174**).