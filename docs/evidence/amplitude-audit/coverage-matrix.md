# Amplitude audit coverage matrix (A01–A40)

**Project:** AmpliYorker `appId` **905300** · **SDK:** `@amplitude/unified` **1.2.3** (matches `package.json`; latest npm 1.2.3)  
**Audited baseline:** `main` @ `ebf7450` + local fixes on `cursor/amplitude-audit-93b2`  
**Live site (pre-deploy):** https://beccaabusharkh.github.io/AmpliYorker/#/  
**MCP taxonomy snapshot:** 2026-11-19 — `Read Article` status `unexpected`, volume **184**, lastSeen 2026-11-18; no `[Amplitude] Page Viewed` / `[Amplitude] Element Clicked` ingested in plan window (autocapture was off).

| ID | Theme | Check | Pre-audit | Post-fix (local) | Evidence |
| --- | --- | --- | --- | --- | --- |
| A01 | Init | Single `@amplitude/unified` dependency | PASS | PASS | `package.json`; `test:amplitude-config` |
| A02 | Init | Exactly one `initAll()` call site | PASS | PASS | `src/lib/amplitude/init.ts` only |
| A03 | Init | Amplitude before Statsig boot | PASS | PASS | `src/main.ts` |
| A04 | Init | Missing API key disables SDK safely | PASS | PASS | warn + no init |
| A05 | Init | No second Analytics CDN / browser package | PASS | PASS | `verify-amplitude-config.mts` |
| A06 | Identity | Device id aligned with `ampli-daily-anonymous-id` | PARTIAL | PASS | `setDeviceId` in `ensureAmplitudeIdentity` |
| A07 | Identity | Logged-in `setUserId(reader_id)` | PASS | PASS | login/register |
| A08 | Identity | Anonymous clears `userId` | FAIL | PASS | `setUserId(undefined)` |
| A09 | Identity | Logout: Sign Out then `reset()` | PASS | PASS | `account.ts` order preserved |
| A10 | Identity | No shared hardcoded user id | PASS | PASS | persona-driven session |
| A11 | Identity | Statsig `customIDs.amplitude_device_id` | PASS | PASS | `statsig/init.ts` |
| A12 | Identity | Re-render does not thrash device id | PARTIAL | PASS | explicit device id each sync |
| A13 | Dictionary | `custom-events.yml` parity with emitters | PARTIAL | PASS | 28 product events wired |
| A14 | Dictionary | `docs/custom-events.yml` mirror | FAIL | PASS | root YAML updated (mirror on ship) |
| A15 | Read Article | Milestones 25/50/75/90/100 only | PASS | PASS | `article-reading.ts` |
| A16 | Read Article | `active_reading_seconds` accumulated | PASS | PASS | interaction-gated timer |
| A17 | Read Article | One fire per milestone / session / article | PARTIAL | PASS | sessionStorage + `insert_id` |
| A18 | Read Article | Dedupe ingest (`insert_id`) | FAIL | PASS | `trackDemoEvent` + stable key |
| A19 | Dictionary | No legacy Article Reading Started | PASS | PASS | grep clean |
| A20 | Dictionary | `Recommendation Set Presented` implemented | FAIL | **OUT OF SCOPE / DROPPED** | Removed from measurement contract (user decision 2026-11-19); never implement |
| A21 | Autocapture | Selective element click/change enabled | FAIL | PASS | `elementInteractions` + resolver |
| A22 | Autocapture | Form / file autocapture off | PASS | PASS | `formInteractions: false` |
| A23 | Autocapture | No overlap on precision forms | FAIL | PASS | `data-precision-event` + roots |
| A24 | Autocapture | Chat inputs masked | PASS | PASS | replay masks + `data-amplitude-mask` |
| A25 | Autocapture | Checkout/search/newsletter excluded | FAIL | PASS | precision roots |
| A26 | Autocapture | Navigation links can autocapture | FAIL | PASS | allowlist defaults |
| A27 | Web Analytics | Hash SPA page views | FAIL | PASS | `pageViews.trackHistoryChanges: all` |
| A28 | Web Analytics | Sessions + attribution on | PARTIAL | PASS | autocapture object |
| A29 | Replay | Conservative mask selectors | PASS | PASS | `init.ts` MASK_SELECTORS |
| A30 | Replay | Chat / PII fields masked | PARTIAL | PASS | ask-daily + checkout ids |
| A31 | Replay | Sample rate configurable | FAIL | PASS | `VITE_AMPLITUDE_REPLAY_SAMPLE_RATE` default 0.25 |
| A32 | Replay | Replay events ingesting | PASS | PASS | MCP `[Amplitude] Replay Captured` vol 157 |
| A33 | G&S | Unified `engagement` block | PARTIAL | PASS | `skip: true` unless env enable |
| A34 | G&S | No mystery boot without content | FAIL | PASS | skip avoids Engagement Booted when disabled |
| A35 | G&S | Console survey targeting | BLOCKED | BLOCKED | no authorized G&S content |
| A36 | G&S | Entitlements / prod content | BLOCKED | BLOCKED | planner approval |
| A37 | Web Experiment | Deployment key only (not Feature Flags) | FAIL | PARTIAL | env `VITE_AMPLITUDE_WEB_EXPERIMENT_DEPLOYMENT_KEY`; off when unset |
| A38 | Web Experiment | No duplicate experiment CDN | PASS | PASS | unified only |
| A39 | Experiment surface | Statsig owns UI experiments | PASS | PASS | Statsig SDK unchanged |
| A40 | Agent Analytics | Scripted chat taxonomy | FAIL | PASS | `[Agent] User Message` / `AI Response` |

**Summary:** Pre-audit **PASS 12 · PARTIAL 6 · FAIL 15 · BLOCKED 2 · DEFERRED 1**. Post-fix local **PASS 36 · PARTIAL 1 · BLOCKED 2 · DROPPED 1** (A37 partial until Pages rebuild with deployment key; **A20 OUT OF SCOPE / DROPPED**).