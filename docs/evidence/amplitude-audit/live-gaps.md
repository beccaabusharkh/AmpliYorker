# Live site gaps (post-audit, pre-push)

| Gap | Status |
| --- | --- |
| https://beccaabusharkh.github.io/AmpliYorker/ bundle | **Pre-audit** until next authorized deploy |
| `[Amplitude] Page Viewed` on hash routes | Expected after deploy + key present |
| `[Agent] *` events | Expected after deploy |
| Autocapture on precision controls | Prevented by `data-precision-event` (verify post-deploy) |
| G&S surveys | **BLOCKED** — no content / entitlements |
| Amplitude Web Experiment | **BLOCKED** — deployment key not in repo |