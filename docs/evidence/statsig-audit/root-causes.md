# Statsig audit — root causes

## RC-S01 — Init timeout marked client ready

**Symptom:** Slow network could bind `ready=true` even when `initializeAsync` did not finish.  
**Fix:** Race returns `timeout` | `ready`; only `ready` binds client.

## RC-S02 — Double exposure logging

**Symptom:** SDK `checkGate` / `getExperiment` auto-log plus manual `recordExposure`.  
**Fix:** `disableExposureLog: true` on gate/experiment reads; inspector retains manual exposure on treatment eval.

## RC-S03 — `account_state` mismatch

**Symptom:** Statsig `custom.account_state` used `subscription.status` (`active`) vs Amplitude `paid`/`registered` enum.  
**Fix:** `buildStatsigUser()` uses `resolveAccountState()`.

## RC-S04 — Logout exposure bleed

**Symptom:** Prior session exposures visible after persona switch.  
**Fix:** `clearExposures()` on sign-out before `syncStatsigIdentity`.

## RC-S05 — Console inventory API gap

**Symptom:** Statsig MCP `get_list_of_gates` / experiments returned **0** items while code references entities in `docs/statsig-entities-step2.md`.  
**Status:** Treat step2 doc + catalog as code truth; confirm entities in console UI before prod promotion (**BLOCKED** S21/S22).

## RC-S06 — Statsig Web Analytics / Session Replay

**Status:** **EXCLUDED** by spec — Amplitude owns replay and primary web analytics; no Statsig WA plugin in bundle.