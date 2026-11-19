# Amplitude Web Experiment standalone CDN script

| Check | Status |
| --- | --- |
| `VITE_AMPLITUDE_API_KEY` injected at build into `index.html` | **PASS** (Vite `transformIndexHtml`) |
| Script URL pattern | `https://cdn.amplitude.com/script/<API_KEY>.experiment.js` (US) |
| Full Unified `API_KEY.js` | **EXCLUDED** — not added |
| npm `@amplitude/unified` `initAll` | **UNCHANGED** — single analytics SDK |
| `init.ts` `experiment.deploymentKey` | **UNCHANGED** — complements CDN script per Web Experiment + unified pattern |
| Amplitude Feature Experiment (server-side) | **EXCLUDED** |

Built output check: run `VITE_AMPLITUDE_API_KEY=<key> pnpm build` then `pnpm test:amplitude-config` (reads `dist/index.html` when present).

## Live verify (post PR #18)

| Field | Value |
| --- | --- |
| Merge SHA | `8647ca92b0c0cd01a494580457db614ce213b618` |
| Deploy | https://github.com/beccaabusharkh/AmpliYorker/actions/runs/44460822452 — **success** |
| Check | **PASS** — live `index.html` includes `cdn.amplitude.com/script/…experiment.js`; no `API_KEY.js` |
| Verified | 2026-11-19T04:50:00Z |