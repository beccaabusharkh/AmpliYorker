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