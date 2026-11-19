# Live site gaps

| Gap | Status (post-deploy @ `f435fef`) |
| --- | --- |
| https://beccaabusharkh.github.io/AmpliYorker/ bundle | **PASS** — `index-D1R1Mq5p.js` (audit code present) |
| Read Article milestones | **PASS** — see `live-smoke-post-deploy.json` |
| `[Amplitude] Page Viewed` on hash routes | **PARTIAL** — autocapture configured; payload grep inconclusive (encoding) |
| `[Agent] *` events | **PARTIAL** — instrumented; live wire capture not confirmed in smoke script |
| Autocapture on precision controls | **PASS** — `data-precision-event` in live bundle |
| G&S surveys | **BLOCKED** — no content / entitlements; skip default |
| Amplitude Web Experiment | **BLOCKED** — deployment key not verified |