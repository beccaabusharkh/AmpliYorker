# Live site gaps

| Gap | Status (post-deploy @ `f435fef`) |
| --- | --- |
| https://beccaabusharkh.github.io/AmpliYorker/ bundle | **PASS** — `index-D1R1Mq5p.js` (audit code present) |
| Read Article milestones | **PASS** — see `live-smoke-post-deploy.json` |
| `[Amplitude] Page Viewed` on hash routes | **PARTIAL** — autocapture configured; payload grep inconclusive (encoding) |
| `[Agent] *` events | **PARTIAL** — instrumented; live wire capture not confirmed in smoke script |
| Autocapture on precision controls | **PASS** — `data-precision-event` in live bundle |
| G&S surveys | **LIVE (plugin)** — survey **112204** still **draft** in Amplitude (publish in UI). Live bundle `index-C02-sAEF.js`: engagement `skip` **off** (2026-11-19 PR #15). |
| Amplitude Web Experiment | **PASS (build-time)** — `VITE_AMPLITUDE_WEB_EXPERIMENT_DEPLOYMENT_KEY` in `init.ts`; **standalone CDN** `*.experiment.js` injected in `index.html` at build from `VITE_AMPLITUDE_API_KEY` (see `web-experiment-cdn-script.md`). Feature Experiment still excluded. |
| `Recommendation Set Presented` | **OUT OF SCOPE** — dropped from `custom-events.yml` |