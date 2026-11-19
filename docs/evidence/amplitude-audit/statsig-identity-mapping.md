# Statsig ↔ Amplitude identity mapping (evidence snippet)

AmpliYorker keeps **one Amplitude user/device namespace** and maps it into Statsig on every init and identity sync.

```typescript
// src/lib/statsig/init.ts (conceptual)
const identity = readerIdentityLabel();
await client.updateUserAsync({
  userID: identity.reader_id ?? identity.anonymous_id,
  customIDs: {
    amplitude_device_id: identity.anonymous_id,
  },
  custom: {
    account_state: session.subscription.status,
    is_logged_in: isLoggedIn(),
  },
});
```

```typescript
// src/lib/amplitude/init.ts (post-audit)
const anonId = getOrCreateAnonymousId();
setDeviceId(anonId);
if (isLoggedIn() && session.loggedInUserId) {
  setUserId(session.loggedInUserId);
} else {
  setUserId(undefined);
}
```

| Field | Source | Notes |
| --- | --- | --- |
| Amplitude `device_id` | `localStorage` `ampli-daily-anonymous-id` | Refreshed on `reset()` after sign-out |
| Amplitude `user_id` | `session.loggedInUserId` when logged in | Cleared for anonymous |
| Statsig `userID` | `reader_id` or fallback `anonymous_id` | Stable for gates/experiments |
| Statsig `customIDs.amplitude_device_id` | same as anonymous id | Join key for exposure ↔ analytics |
| Statsig environment | `development` tier | Production promotion manual in console |

Product copy and experiment **values** remain Statsig parameter stores (Phase 3); this mapping changes only identity wiring, not UI params.