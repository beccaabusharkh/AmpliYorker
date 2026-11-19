# Statsig ↔ Amplitude identity mapping

| Field | Amplitude | Statsig | Sync point |
| --- | --- | --- | --- |
| Anonymous continuity | `localStorage` `ampli-daily-anonymous-id` → `device_id` | `customIDs.amplitude_device_id` | `buildStatsigUser()` |
| Logged-in reader | `setUserId(reader_id)` | `userID` | same id or fallback anonymous |
| Account segment | `account_state` common property | `custom.account_state` | `resolveAccountState()` |
| Login flag | `reader_id` null vs set | `custom.is_logged_in` | `loadSession()` |

```typescript
// src/lib/statsig/init.ts — buildStatsigUser()
userID: identity.reader_id ?? identity.anonymous_id
customIDs: { amplitude_device_id: identity.anonymous_id }
custom: { account_state: resolveAccountState(), is_logged_in: isLoggedIn() }
```

**Logout order:** `Sign Out` Amplitude event → `logout()` → `resetAmplitudeIdentity()` → `clearExposures()` → `syncStatsigIdentity()`.

**Forced demo:** `?force_statsig=experiment:variant` or exposure inspector — label `isForced` / Amplitude `is_forced_variant` when applicable.