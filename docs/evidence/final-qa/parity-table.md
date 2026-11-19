# Cross-platform parity (Amplitude ↔ Statsig)

| Concern | Amplitude | Statsig | Parity |
| --- | --- | --- | --- |
| Primary user key | `user_id` / `device_id` | `userID` + `customIDs.amplitude_device_id` | PASS |
| Account segment | `account_state` common prop | `custom.account_state` (`resolveAccountState`) | PASS |
| Page views (hash SPA) | `[Amplitude] Page Viewed` autocapture | `StatsigAutoCapturePlugin` (`auto_capture::page_view*`) | PASS (P7) |
| Session replay | Amplitude `sessionReplay` | **Excluded** | PASS |
| Feature experiments | **Excluded** (Web Experiment only) | Statsig gates/experiments/layers | PASS — separate products |
| Web Experiment CDN | `index.html` `*.experiment.js` (API key) + unified `deploymentKey` | N/A | PASS — see `amplitude-audit/web-experiment-cdn-script.md` |
| Treatment exposures | Web Exp: manual off; G&S gated | SDK exposure logs + local inspector mirror | PASS (P7) |
| Outcome events | `custom-events.yml` → `trackDemoEvent` | snake_case mirror via `logEvent` | PASS (P7) |
| Forced demo traffic | `is_forced_variant` | `?force_statsig=` + inspector `isForced` | PASS |
| Shared journey outcomes | Paywall Presented, Checkout, Read Article, … | Mapped in `statsig-audit/event-map.md` | PASS |
| Live network (QA run) | 32–34 requests/session | P7: WA + events — use `pnpm test:statsig-network-smoke` | **PASS** after P7 (was PARTIAL D02) |
| Console ingestion 24h | Not queried (MCP) | Not queried (MCP list empty) | **BLOCKED** |

**Classification:** Implementation parity **PASS**; live Statsig network **PASS** via `test:statsig-network-smoke` after P7; console ingestion **BLOCKED** (S21–S22).