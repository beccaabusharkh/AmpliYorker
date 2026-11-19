# Statsig events + Web Analytics (P7)

## Approach
- **Package:** `@statsig/web-analytics` only (no `@statsig/session-replay`).
- **Init:** `StatsigAutoCapturePlugin` on the existing `StatsigClient` (`src/lib/statsig/init.ts`).
- **Autocapture:** OOTB `auto_capture::page_view`, `auto_capture::page_view_end`, clicks (hash SPA via history proxy) — **only** from the plugin.
- **Custom mirror:** `trackDemoEvent` → `client.logEvent` with **snake_case** names only (e.g. `read_article`), no `auto_capture::` prefix.
- **Exposures:** SDK logs **all** gate, experiment, and parameter-store evaluations to Statsig (no `disableExposureLog`). Inspector = deduped local mirror; server is source of truth.
- **Environment tier (P8):** `VITE_STATSIG_ENV_TIER` → `environment.tier` (`development` | `staging` | `production`). Pages CI: set secret **`VITE_STATSIG_ENV_TIER=production`**. See `prod-cutover.md`.
- **Amplitude:** unchanged; no manual duplicate page_view to Statsig beyond AutoCapture.

## Verify
```bash
pnpm typecheck && pnpm build
pnpm test:statsig-events
pnpm test:statsig-audit
pnpm test:statsig-network-smoke   # after deploy + VITE_STATSIG_CLIENT_KEY; expects statsigapi requests

Pre-merge live may report 0 until P7 ships. CI/Pages build with secret should PASS.

## Post-merge (PR #19 @ `80f5ef2`)

- Deploy: https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44463680404 — success
- Live bundle `index-rTLCs32k.js` includes WA plugin
- `test:statsig-network-smoke`: **FAIL** (0 statsigapi requests) — verify `VITE_STATSIG_CLIENT_KEY` GitHub Actions secret for Pages build
- Evidence: `p7-live-merge-smoke.json`
```

## Mapping
Full table: `docs/evidence/statsig-audit/event-map.md` (Amplitude name → Statsig mirror).