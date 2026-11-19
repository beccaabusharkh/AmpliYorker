# Statsig ↔ Amplitude identity mapping (legacy pointer)

**Canonical P5 doc:** `docs/evidence/statsig-audit/identity-mapping.md`

`buildStatsigUser()` uses `resolveAccountState()` for `custom.account_state` (not raw `subscription.status`). Logout clears exposures before `syncStatsigIdentity()`.