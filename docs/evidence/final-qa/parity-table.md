# Cross-platform parity (Amplitude ↔ Statsig)

| Concern | Amplitude | Statsig | Parity |
| --- | --- | --- | --- |
| Primary user key | `user_id` / `device_id` | `userID` + `customIDs.amplitude_device_id` | PASS |
| Account segment | `account_state` common prop | `custom.account_state` (`resolveAccountState`) | PASS |
| Page views (hash SPA) | `[Amplitude] Page Viewed` autocapture | **Not used** (no Statsig WA) | PASS — intentional split |
| Session replay | Amplitude `sessionReplay` | **Excluded** | PASS |
| Feature experiments | **Excluded** (Web Experiment only) | Statsig gates/experiments/layers | PASS — separate products |
| Treatment exposures | Web Exp: manual off; G&S gated | Manual inspector + `disableExposureLog` reads | PASS |
| Outcome events | `custom-events.yml` → `trackDemoEvent` | No parallel Statsig custom mirror | PASS — see event-map |
| Forced demo traffic | `is_forced_variant` | `?force_statsig=` + inspector `isForced` | PASS |
| Shared journey outcomes | Paywall Presented, Checkout, Read Article, … | Mapped in `statsig-audit/event-map.md` | PASS |
| Live network (QA run) | 32–34 requests/session | 0 `statsigapi` observed | **PARTIAL** (D02) |
| Console ingestion 24h | Not queried (MCP) | Not queried (MCP list empty) | **BLOCKED** |

**Classification:** Implementation parity **PASS**; live Statsig network **PARTIAL**; console ingestion **BLOCKED** (tooling / S21–S22).