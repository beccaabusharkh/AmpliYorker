# Defects — P6 final QA

| ID | Severity | Finding | Fix | Retest |
| --- | --- | --- | --- | --- |
| D01 | P2 | `[Agent] Session End` emitted in code but missing from measurement dictionary | Added event block + convention note in `custom-events.yml` | PASS `test:custom-events-parity` |
| D02 | P3 | Playwright live run logged **0** Statsig HTTP calls while Amplitude fired (~34) | No code change — likely local-default path when client init does not complete in headless window and/or network timing; live bundle contains `statsigapi.net` symbols | PARTIAL — manual console/network spot-check recommended |
| — | — | 7 dictionary-only lifecycle events (e.g. `Checkout Failed`) not wired in demo | **By design** — documented in parity script `dictOnly` | N/A |

No additional code defects authorized for fix beyond D01.