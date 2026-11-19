# Statsig audit coverage matrix (S01–S40)

**Audited:** `main` + branch fixes · **Live:** https://beccaabusharkh.github.io/AmpliYorker/#/  
**Console:** AmpliYorker [BAS] · SDK tier `development`

| ID | Theme | Check | Pre-audit | Post-fix (branch) | Evidence |
| --- | --- | --- | --- | --- | --- |
| S01 | Init | Single `@statsig/js-client` | PASS | PASS | `package.json` |
| S02 | Init | One `StatsigClient` in `init.ts` | PASS | PASS | grep |
| S03 | Init | After Amplitude `initAmplitude` | PASS | PASS | `main.ts` |
| S04 | Init | `VITE_STATSIG_CLIENT_KEY` in Pages CI | PASS | PASS | `deploy-pages.yml` |
| S05 | Init | Missing key → defaults | PASS | PASS | `init.ts` warn |
| S06 | Init | Init timeout fallback | **FAIL** | PASS | timeout no longer marks ready |
| S07 | Init | No server/console secret in repo | PASS | PASS | client key env only |
| S08 | Init | No Statsig Session Replay | PASS | PASS | no replay plugin |
| S09 | Identity | `userID` reader or anonymous | PASS | PASS | `buildStatsigUser` |
| S10 | Identity | `amplitude_device_id` custom ID | PASS | PASS | `init.ts` |
| S11 | Identity | `account_state` matches Amplitude enum | **FAIL** | PASS | `resolveAccountState()` |
| S12 | Identity | Login/register `syncStatsigIdentity` | PASS | PASS | login/register |
| S13 | Identity | Logout reset + sync | PARTIAL | PASS | + `clearExposures` |
| S14 | Identity | Stable assignments per session | PASS | PASS | deduped exposures |
| S15 | Identity | Forced `?force_statsig=` + inspector | PASS | PASS | `overrides.ts` |
| S16 | Identity | Doc consolidated | PARTIAL | PASS | `identity-mapping.md` |
| S17 | Params | 14 stores + layers | PASS | PASS | `docs/statsig-entities-step2.md` |
| S18 | Params | `getParameterStore` disableExposureLog | PASS | PASS | `page-params.ts` |
| S19 | Params | No direct store reads in pages | PASS | PASS | `getPageParams` only |
| S20 | Params | YAML/registry parity test | PASS | PASS | `pnpm test:statsig-params` |
| S21 | Params | Production promotion review gate | BLOCKED | BLOCKED | console `reviewRequired` prod |
| S22 | Params | MCP param store list | PARTIAL | PARTIAL | API list empty; step2 doc authoritative |
| S23 | Gates | `premium_paywall_after_scroll` wired | PASS | PASS | catalog + article params |
| S24 | Experiments | Four experiment surfaces | PASS | PASS | `catalog.ts` |
| S25 | Exposure | Manual inspector records | PASS | PASS | `exposures.ts` |
| S26 | Exposure | SDK auto-exposure suppressed on eval | **FAIL** | PASS | `disableExposureLog` eval |
| S27 | Exposure | One record per surface/session | PASS | PASS | sessionStorage dedupe |
| S28 | Exposure | Forced flag in inspector | PASS | PASS | `isForced` |
| S29 | Paywall | Scroll gate affects premium article | PASS | PASS | `article.ts` |
| S30 | Paywall | Message experiment copy | PASS | PASS | `paywall.ts` |
| S31 | Subscribe | Offer framing variant | PASS | PASS | `subscribe.ts` params |
| S32 | Retention | Home/account treatment copy | PASS | PASS | `RETENTION_COPY` |
| S33 | Outcomes | Amplitude events for journeys | PASS | PASS | `event-map.md` |
| S34 | Outcomes | `is_forced_variant` on Amplitude | PASS | PASS | `context.ts` |
| S35 | Outcomes | No Statsig custom event mirror | PASS | PASS | design choice |
| S36 | Web analytics | Hash routes via Amplitude | PASS | PASS | amplitude audit |
| S37 | Web analytics | Statsig WA not enabled | PASS | PASS | no WA plugin |
| S38 | Web analytics | No duplicate page events | PASS | PASS | boundary doc |
| S39 | Verify | typecheck/build/tests | — | PASS | CI scripts |
| S40 | Verify | Live bundle includes Statsig | PASS | PASS | `preview-smoke.json` |

**Summary:** Pre-audit **FAIL 2 · PARTIAL 3 · BLOCKED 1**. Post-fix **PASS 38 · PARTIAL 1 · BLOCKED 1** (S22 console list API; S21 prod promotion).