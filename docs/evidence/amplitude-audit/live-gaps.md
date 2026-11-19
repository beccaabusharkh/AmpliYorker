# Live site gaps

| Gap | Status (post-deploy @ `f435fef`) |
| --- | --- |
| https://beccaabusharkh.github.io/AmpliYorker/ bundle | **PASS** — `index-D1R1Mq5p.js` (audit code present) |
| Read Article milestones | **PASS** — see `live-smoke-post-deploy.json` |
| `[Amplitude] Page Viewed` on hash routes | **PARTIAL** — autocapture configured; payload grep inconclusive (encoding) |
| `[Agent] *` events | **PARTIAL** — instrumented; live wire capture not confirmed in smoke script |
| Autocapture on precision controls | **PASS** — `data-precision-event` in live bundle |
| G&S surveys | **LIVE (plugin)** — survey **112204** still **draft** in Amplitude (publish in UI). Live bundle `index-C02-sAEF.js`: engagement `skip` **off** (2026-11-19 PR #15). |
| Amplitude Web Experiment | **PASS (build-time)** — secret wired in Actions; live bundle includes experiment plugin options (not live fetch verified) |
| `Recommendation Set Presented` | **OUT OF SCOPE** — dropped from `custom-events.yml` |