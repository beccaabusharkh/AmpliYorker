# Phase 2H — Atlantic layout fidelity — UX specification

## Status and phase

| Field | Value |
| --- | --- |
| **Status** | **READY** |
| **Phase ID** | `2H` (layout fidelity; assignment **`P2H-UX-ATLANTIC-FIDELITY-001`**) |
| **UX agent** | `bc-7bd1c1e6-0e09-5541-834e-3073de26a009` |
| **Audited revision** | Live https://beccaabusharkh.github.io/AmpliYorker/#/ (2026-11-18); repo `main` static read |
| **Implementation** | Builder after UX READY; branch e.g. `atlantic-fidelity`; incremental **masthead + opening grid first** |
| **Objective** | Close **measured** layout gaps vs The Atlantic homepage geometry (masthead/nav, container width, opening grid columns, image aspects, headline scale, rules/whitespace) while preserving routes, IDs, analytics, SDK, persistence, subscribe/account/chat behavior. |
| **Viewports** | `1440×1000`, `390×844` (verification); optional `768×1024` in build verify |
| **Supersedes for fidelity** | Presentation targets in `docs/2/ATLANTIC-SPEC.md` where they conflict with **measured** reference geometry below (especially opening grid topology and horizontal inset). |
| **Brief** | `/cursor/stores/self/docs/atlantic-fidelity-brief.md` |

---

## Reference audit (mandatory evidence)

| Source | Method | Result |
| --- | --- | --- |
| https://www.theatlantic.com/ | Playwright live | **BLOCKED** — title `Your access has been blocked – The Atlantic`; HTTP 403; static CSS 403. Screenshots: `media/atlantic-fidelity/atlantic-*-1440x1000.png`, `atlantic-mobile-390x844.png`. |
| Atlantic editorial DOM | [Wayback 2025-10-31](https://web.archive.org/web/20251031235859/https://www.theatlantic.com/) Playwright | **Primary reference measurements** — `media/atlantic-fidelity/atlantic-wayback-audit.json`, screenshots `atlantic-wayback-*`. |
| AmpliYorker | Playwright live | `media/atlantic-fidelity/browser-audit.json`, `ampliyorker-*` screenshots. |
| Annotated comparison | UX analysis | `/cursor/stores/self/docs/evidence/atlantic-fidelity/annotated-comparison.md` |
| **Skills** | Glob repo + store | **No `frontend-design` skill** present (do not claim). |

**Rule:** Builder must not ship reference dimensions absent from Wayback JSON, live AmpliYorker JSON, or this spec’s token table.

---

## Measured reference geometry (Atlantic — Wayback @ 1440)

| Token | Measured value | Selector / notes |
| --- | --- | --- |
| `--fid-page-gutter-1440` | **80px** | `HomepageLayout_container__d1PzS` left offset on 1440 canvas |
| `--fid-container-max` | **1280px** | `max-width: 1280px` on homepage containers |
| `--fid-nav-chrome-height` | **226px** nav + **68px** offset → main @ **294px** | `.HomepageNav_root__L4mvf` height 226, top 68 |
| `--fid-lead-headline-size` | **38px** | Lead `h1` computed |
| `--fid-lead-headline-width` | **624px** | Lead `h1` rendered width |
| `--fid-lead-image-box` | **624×416px** | Aspect **~1.50** (3:2) |
| `--fid-rail-tile` | **296px** column; thumbs **296×197** (3:2) or **296×296** | Opening mosaic |
| `--fid-rail-headline` | **18px** / **26px** line-height | Secondary `h2` in rails |
| `--fid-opening-gutter` | **32px** | 408 − (80+296) between columns |

### Measured reference geometry (Atlantic — Wayback @ 390)

| Token | Measured value |
| --- | --- |
| `--fid-page-gutter-390` | **16px** (content width **358px**) |
| `--fid-nav-chrome-height-mobile` | **102px** (nav band) |
| `--fid-lead-headline-size-mobile` | **32px** |
| `--fid-lead-image-box-mobile` | **358×239px** (~3:2) |
| **Mobile lead order** | **Image first** (image top 189, headline top 465) |

---

## Measured current geometry (AmpliYorker — live @ 1440)

| Token | Measured value | Fidelity gap |
| --- | --- | --- |
| Page gutter | **144px** | **+64px** vs Atlantic 80px |
| Container | **1152px** grid inside **1200px** max | **−128px** vs Atlantic 1280px |
| Header through nav | **262px** | Missing integrated nav; extra promo + edition rows |
| Utility bar | **32px** | Not equivalent to Atlantic nav utility cluster |
| Masthead block | **71px**, wordmark **28px** | Separate band; Atlantic uses single nav |
| Promo band | **64px** full-bleed ink | No measured Atlantic equivalent at this size |
| Lead layout | **flex column**, copy-first | vs Atlantic mosaic + mobile image-first |
| Lead headline | **31.68px** | **−6.32px** vs 38px |
| Lead image | **820×280px** | Wrong aspect & height vs **624×416** |
| Primary / sidebar | **820px + 300px** | vs **296 / 624 / 296** mosaic |

### AmpliYorker live @ 390

| Token | Measured | Gap |
| --- | --- | --- |
| Header chrome | **308px** (promo **119px** wrapped) | vs Atlantic **102px** nav |
| Lead headline | **24px** | vs **32px** |
| Lead image | **358×200** | vs **358×239**; copy-first vs image-first |

---

## Geometry tokens (Builder targets — phase 1+)

Apply as CSS custom properties in `src/styles/tokens.css` / `editorial.css` (names are spec-level; Builder may alias):

```css
/* Phase 2H — measured from Wayback reference */
:root {
  --fid-container-max: 1280px;
  --fid-page-gutter-desktop: 80px;
  --fid-page-gutter-mobile: 16px;
  --fid-opening-col-narrow: 296px;
  --fid-opening-col-lead: 624px;
  --fid-opening-gutter: 32px;
  --fid-lead-headline-desktop: 38px;
  --fid-lead-headline-mobile: 32px;
  --fid-lead-image-ratio: 3 / 2;
  --fid-lead-image-max-h-desktop: 416px;
  --fid-lead-image-max-h-mobile: 239px;
  --fid-rail-headline: 18px;
  --fid-nav-chrome-target-desktop: 294px; /* inclusive of Atlantic HomepageNav band */
  --fid-nav-chrome-target-mobile: 102px;
  --fid-rule-hairline: 1px;
  --fid-rule-color-muted: #e2e2e2;
  --fid-rule-color-ink: #121212;
}
```

**Non-goals (preserve):** Hash routes, `data-*` analytics hooks, Statsig/Amplitude contracts, simulated auth/checkout, plan count, chat behavior.

---

## Build phases

| Phase | Scope | Exit criteria |
| --- | --- | --- |
| **2H-1** | **Masthead + nav fusion** — single chrome band; align utility actions; reduce stacked promo/edition; target chrome heights | `P2H-FID-A01`–`A05` @ 1440 & 390 |
| **2H-2** | **Container + inset** — `max-width: 1280px`, **80px** gutter @ 1440, **16px** @ 390 | `P2H-FID-A06`–`A08` |
| **2H-3** | **Opening grid** — 3-column mosaic or documented 2-column simplification with **296/624/296** proportions; **image-first on mobile** | `P2H-FID-A09`–`A12` |
| **2H-4** | **Type & imagery** — lead **38/32px**, rail **18px**, lead image **3:2** caps | `P2H-FID-A13`–`A16` |
| **2H-5** | **Rules & rhythm** — hairline consistency, column gutters **32px**, secondary thumb policy | `P2H-FID-A17`–`A20` |
| **2H-6** | Remaining homepage bands, article hero parity, UX diff loop | Planner sign-off |

**First delivery:** complete **2H-1** and **2H-3** before lower-priority bands.

---

## Mismatch checklist (current site vs reference)

| ID | Area | Current (measured) | Reference (measured) | Severity |
| --- | --- | --- | --- | --- |
| FID-M01 | Page gutter @ 1440 | 144px | 80px | High |
| FID-M02 | Container max | 1152–1200px | 1280px | High |
| FID-M03 | Opening topology | 820+300 sidebar | 296 / 624 / 296 mosaic | High |
| FID-M04 | Lead image box | 820×280 | 624×416 (3:2) | High |
| FID-M05 | Mobile lead order | Copy-first | Image-first | High |
| FID-M06 | Mobile header height | 308px | 102px nav | High |
| FID-M07 | Promo band | 64px ink slab (desktop) | Inline nav subscribe pattern | Medium |
| FID-M08 | Edition line | 26px band under wordmark | Not in reference DOM | Medium |
| FID-M09 | Lead headline size | 31.68px / 24px | 38px / 32px | Medium |
| FID-M10 | Secondary headlines | ~16px CSS | 18px rail h2 | Low |
| FID-M11 | Masthead structure | Utility 32px + wordmark 71px + nav 69px | Single HomepageNav 226px | High |

---

## Acceptance IDs (`P2H-FID-A01+`)

| ID | Assertion | Method |
| --- | --- | --- |
| **P2H-FID-A01** | Page gutter @ 1440 ∈ **[76px, 84px]** (target **80px**) | Playwright bbox `.home-editorial-grid` or outer container |
| **P2H-FID-A02** | Container max width **1280px** (±4px) centered | Computed `max-width` + rect width @ 1440 |
| **P2H-FID-A03** | Header chrome height @ 1440 ≤ **300px** and ≥ integrated nav pattern (no separate 64px promo + 26px edition without spec waiver) | DOM stack measurement |
| **P2H-FID-A04** | Header chrome height @ 390 ≤ **120px** (+ optional slim promo **≤40px**) | Mobile stack |
| **P2H-FID-A05** | Utility actions (Newsletter / account / subscribe) live in **top chrome**, Atlantic-like alignment | Visual + DOM order |
| **P2H-FID-A06** | Opening grid uses **three columns** totaling **1280px** with **32px** gutters OR documented approved simplification with **624px** lead column | Grid template / flex basis |
| **P2H-FID-A07** | Lead column width **624px** (±8px) @ 1440 | Lead package bbox |
| **P2H-FID-A08** | Side rail column width **296px** (±8px) each where mosaic enabled | Thumb column bbox |
| **P2H-FID-A09** | Lead image rendered height **≤416px** and aspect **1.45–1.55** @ 1440 | `.lead-hero-image` bbox |
| **P2H-FID-A10** | Mobile lead image **≥235px** height, **≤245px**, width **358px** @ 390 | Bbox |
| **P2H-FID-A11** | Mobile lead **image above headline** in DOM/visual order | DOM order + y positions |
| **P2H-FID-A12** | Lead headline computed **36–40px** desktop, **30–34px** mobile | `getComputedStyle` |
| **P2H-FID-A13** | Rail / secondary headline **17–19px** where mosaic rails exist | Sample `h2`/`h3` |
| **P2H-FID-A14** | Horizontal rules **1px**; muted rules `#e2e2e2` | Computed borders |
| **P2H-FID-A15** | White canvas `#ffffff` | `body` background |
| **P2H-FID-A16** | No regression: `data-subscribe-promo`, section `data-*`, router IDs | Static + smoke |
| **P2H-FID-A17** | Secondary thumbs align to **296×197** or **296×296** policy per column | Thumb bbox sample |
| **P2H-FID-A18** | Sidebar (if retained) ≤ **296px** or merged into mosaic | Width cap |
| **P2H-FID-A19** | Evidence folder updated after build | `docs/evidence/atlantic-fidelity/` |
| **P2H-FID-A20** | UX screenshot sign-off vs Wayback reference pair @ 1440 & 390 | Planner/UX diff |

---

## File map (expected Builder touch)

| File | Fidelity changes |
| --- | --- |
| `src/styles/tokens.css` | `--fid-*` geometry tokens; container max **1280px** |
| `src/styles/editorial.css` | Masthead/nav fusion, mosaic grid, lead image 3:2 caps, mobile order |
| `src/ui/shell.ts` | Header markup order — collapse bands; relocate promo |
| `src/pages/home.ts` | Opening grid columns; mobile image-first lead package |
| `src/pages/article.ts` | Hero caps consistent with `--fid-lead-image-*` (phase 6) |

---

## UX diff loop

After each build slice:

1. Re-run Playwright capture script → `media/atlantic-fidelity/`.
2. Update `annotated-comparison.md` Δ columns for changed metrics.
3. Tick acceptance IDs; attach screenshots to `docs/evidence/atlantic-fidelity/`.

---

## Handoff

| Item | Path |
| --- | --- |
| **Spec (this file)** | `/cursor/stores/self/docs/2/ATLANTIC-FIDELITY-SPEC.md` |
| **Evidence index** | `/cursor/stores/self/docs/evidence/atlantic-fidelity/index.md` |
| **Screenshots** | `/cursor/stores/self/media/atlantic-fidelity/` |
| **Status** | **READY** for `P2H-BUILD-ATLANTIC-FIDELITY-001` (Planner naming) |

**Planner:** Live Atlantic remains WAF-blocked for bots; fidelity acceptance uses **Wayback-measured** editorial DOM plus post-build AmpliYorker captures — not live theatlantic.com until human-verified.