# P6 Final QA Report

**Assignment:** `P6-FINAL-QA-PARITY-001`  
**Test run ID:** `p6-20261119-0405`  
**Live:** https://beccaabusharkh.github.io/AmpliYorker/#/  
**Repo baseline:** `main` @ `5220638` (post PR #16 smoke docs)  
**Published bundle:** `index-Bc4EeyRc.js` · deploy run [44455139773](https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44455139773)

## Executive summary
The demo is **production-ready for Amplitude-led analytics, replay, and Web Experiment wiring**, with **Statsig treatments on code paths verified** through prior P5 audit plus this regression pass. **Full “all required PASS” is not claimed** because G&S content, Statsig console ingestion parity, and automated Statsig network capture remain **BLOCKED/PARTIAL**.

## What we ran
- Toolchain: typecheck, build, `test:amplitude-config`, `test:statsig-audit`, `test:statsig-params`, new `test:custom-events-parity`
- Live Playwright journeys: home, article scroll, search, topic, login, responsive shots, subscription path video
- Dictionary reconcile: wired vs `custom-events.yml` (fixed D01)

## Fixes shipped (branch `cursor/final-qa-parity-93b2`)
1. **`[Agent] Session End`** added to `custom-events.yml` (D01)
2. QA automation: `scripts/verify-custom-events-parity.mts`, `scripts/run-final-qa-browser.mts`, `playwright` devDep

## Media (verified paths)
- Screenshots: `/cursor/stores/self/media/final-qa/p6-20261119-0405_*.png`
- Subscription video: `/cursor/stores/self/media/final-qa/subscription-journey.webm`
- Browser log: `docs/evidence/final-qa/browser-journey.json`

## Blockers requiring human / console action
| ID | Item |
| --- | --- |
| B01 | Amplitude G&S survey **112204** still **draft** |
| B02 | Statsig **S21** production param promotion (`reviewRequired`) |
| B03 | Statsig **S22** MCP entity list empty |
| B04 | Amplitude 24h ingestion MCP not run in this session |
| B05 | Automated live Statsig network capture (D02) |

## Demo walkthrough (Statsig + Amplitude)
1. Anonymous home → hash page view (Amplitude)  
2. Premium article scroll → paywall + `Paywall Presented`  
3. `?force_statsig=subscription_message_copy:urgency` → copy variant + inspector exposure  
4. Register → subscribe → checkout video journey  
5. Account sign-out → exposure cache cleared (P5 fix)

## Verdict
| Area | Status |
| --- | --- |
| Code / unit gates | **PASS** |
| Browser UX core journeys | **PASS** |
| Measurement dictionary | **PASS** (after D01) |
| Cross-vendor design parity | **PASS** |
| Live Statsig network evidence | **PARTIAL** |
| Console-only surfaces | **BLOCKED** |
| **Overall demo certification** | **PARTIAL** — acceptable ship with documented blockers |