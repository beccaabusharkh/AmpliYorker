# Atlantic layout fidelity — evidence index

**Assignment:** `P2H-UX-ATLANTIC-FIDELITY-001`  
**Captured:** 2026-11-18 (UTC)  
**Reference (live):** https://www.theatlantic.com/ — **Cloudflare/WAF blocked** in Playwright (see limitation).  
**Reference (measured editorial DOM):** Internet Archive snapshot `20251031235859` → [Wayback capture](https://web.archive.org/web/20251031235859/https://www.theatlantic.com/)  
**Current:** https://beccaabusharkh.github.io/AmpliYorker/#/ (live `main` deployment)

## Screenshots (`/cursor/stores/self/media/atlantic-fidelity/`)

| File | Site | Viewport |
| --- | --- | --- |
| `atlantic-desktop-1440x1000.png` | theatlantic.com (live) | 1440×1000 — **WAF block interstitial only** |
| `atlantic-mobile-390x844.png` | theatlantic.com (live) | 390×844 — **WAF block interstitial only** |
| `atlantic-wayback-desktop-1440x1000.png` | Atlantic via Wayback | 1440×1000 — **editorial homepage** |
| `atlantic-wayback-mobile-390x844.png` | Atlantic via Wayback | 390×844 — **editorial homepage** |
| `ampliyorker-desktop-1440x1000.png` | AmpliYorker | 1440×1000 |
| `ampliyorker-mobile-390x844.png` | AmpliYorker | 390×844 |

## Machine-readable metrics

| File | Contents |
| --- | --- |
| `browser-audit.json` | Live Playwright captures + AmpliYorker DOM metrics; Atlantic `blocked: true` |
| `atlantic-wayback-audit.json` | **Measured px** from archived Atlantic homepage @ both viewports |
| `atlantic-wayback-masthead.json` | Supplemental probe (class hash drift on second pass — use `atlantic-wayback-audit.json` as primary) |

## Annotated comparison

See [annotated-comparison.md](./annotated-comparison.md) for masthead, grid, type, and rules with **measured** reference vs AmpliYorker deltas.

## UX spec (READY)

`/cursor/stores/self/docs/2/ATLANTIC-FIDELITY-SPEC.md`

## Skills check

No `frontend-design` skill directory in AmpliYorker repo or Project store (verified 2026-11-18).

## WAF limitation

Live `theatlantic.com` returned HTTP 403 / page title `Your access has been blocked – The Atlantic`; static CSS fetch returned 403. Editorial layout numbers in this package come **only** from the dated Wayback DOM audit or AmpliYorker live DOM — not from invented or third-party design-token pages.