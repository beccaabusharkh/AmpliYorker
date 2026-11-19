# Annotated comparison — The Atlantic vs AmpliYorker

**Measurement policy:** Live Atlantic blocked → reference columns cite **Wayback** `2025-10-31` DOM (Playwright). AmpliYorker columns cite **live** GitHub Pages `main` (Playwright 2026-11-18). No invented reference pixels.

Legend: **Δ** = AmpliYorker − Reference (negative = AmpliYorker smaller/shorter).

---

## Desktop (1440×1000)

### Masthead & chrome

| Element | Reference (Wayback measured) | AmpliYorker (live measured) | Δ / notes |
| --- | --- | --- | --- |
| **Utility / top row** | Integrated in `HomepageNav` (body text: Popular, Latest, Newsletters, Sign In, Subscribe); nav grid starts **y=69** | Dedicated `.site-utility-bar` **32px** tall; Newsletter + Log in right-aligned; **11px** type | Structure mismatch — Atlantic folds utilities into nav; AmpliYorker adds separate 32px band |
| **Wordmark / logo block** | Centered SVG wordmark within nav grid container **1280×225** band (**y=69–294**) | `.site-masthead` text wordmark **71px** block (**y=32–103**), **28px** computed size, **1px** ink rule | Atlantic nav block **226px** tall vs AmpliYorker masthead **71px** — different hierarchy |
| **Edition / date line** | Not a separate band in measured DOM | `.site-masthead-edition` **26px** @ **y=103–129**, **12px** type | AmpliYorker-only row — not Atlantic pattern |
| **Subscribe promo band** | Subscribe CTA inline in nav (text in body preview; no separate full-bleed promo strip in measured nav) | `.site-promo-band` **64px** tall **#121212** band @ **y=129–193** | AmpliYorker adds heavy promo slab Atlantic does not mirror at this height |
| **Section nav row** | Same `HomepageNav` component (**226px** total nav chrome) | `.home-section-nav` **69px** @ **y=193–262**; search field **224px** wide | AmpliYorker splits topic nav below promo |
| **Chrome height to main** | `main` begins **y=294** → **294px** | Content grid begins **y≈582** (after leaderboard wrap) / nav ends **262px** | AmpliYorker main editorial offset larger once ads insert; header alone **262px** vs Atlantic **294px** |

![Atlantic Wayback desktop](/cursor/stores/self/media/atlantic-fidelity/atlantic-wayback-desktop-1440x1000.png)

![AmpliYorker desktop](/cursor/stores/self/media/atlantic-fidelity/ampliyorker-desktop-1440x1000.png)

### Container width & opening grid

| Element | Reference (Wayback) | AmpliYorker (live) | Δ / notes |
| --- | --- | --- | --- |
| **Page inset (horizontal)** | Content container **left=80** on 1440 → **80px** margin | `.home-editorial-grid` **left=144** → **144px** margin | **+64px** inset — AmpliYorker narrower feel |
| **Max content width** | `HomepageLayout_container__d1PzS` **1280px** (`max-width: 1280px`) | `max-width: 1200px` (computed grid **1152px** usable @ 1440) | **−128px** usable vs Atlantic |
| **Opening grid topology** | **3-column mosaic**: left rail **296px** @ x=80, lead **624px** @ x=408, right rail **196–296px** @ x=1064+ | **2-column**: primary **820px** + sidebar **300px**; lead stack **flex column** copy-first | Topology mismatch — Atlantic simultaneous rails; AmpliYorker magazine sidebar |
| **Lead headline** | `h1` **38px** / **44px** line box, width **624px** | `.lead-headline` **31.68px** computed, width **640px** | **−6.32px** type; similar width |
| **Lead image** | **624×416** rendered (**aspect ~1.50**, 3:2) @ y=314 | **820×280** (**aspect ~2.93**), `max-height: 280px` | AmpliYorker wider + shorter — not Atlantic above-fold proportion |
| **Secondary module type** | `h2` **18px** / **26px** line-height (rail headlines) | Secondary `h3` **1rem (16px)** per CSS | Smaller secondary type on AmpliYorker |
| **Rail / sidebar thumbs** | **296×197** (3:2) and **296×296** squares in grid | Sidebar **300px** column + sponsored module; secondary thumbs **260×140** | Thumb geometry differs (Atlantic square grid tiles vs capped 16:9 strips) |

### Rules & whitespace

| Element | Reference | AmpliYorker | Notes |
| --- | --- | --- | --- |
| **Hairline rules** | Nav / section borders within Atlantic nav component (1px implied in layout bands) | Utility **#e2e2e2** 1px; masthead **#121212** 1px; nav **#e2e2e2** 1px | AmpliYorker uses mixed ink vs gray rules |
| **Lead copy → image gap** | Headline **y=779** below image bottom **730** → **~49px** (title under image in Atlantic lead package) | Copy-first stack: headline **y=620**, image **y=762** → **~16px** flex gap | **Order inverted** — fidelity gap vs Atlantic cover layout |
| **Column gutter (opening)** | **32px** between 296px tiles (408−80−296=32) | Primary/sidebar **gap: 32px** | Gutter aligned |
| **Body canvas** | White (archived) | `rgb(255,255,255)` | Match |

---

## Mobile (390×844)

| Element | Reference (Wayback) | AmpliYorker (live) | Δ / notes |
| --- | --- | --- | --- |
| **Nav chrome** | `HomepageNav` **102px** (**y=67–169**) | Header through section nav **308px** (promo wraps to **119px**) | AmpliYorker header **+206px** — promo stacking |
| **Horizontal padding** | Lead content **left=16** (width **358**) | Grid **left=16**, width **358** | **Match** |
| **Lead headline** | `h1` **32px**, box **80px** tall | `.lead-headline` **24px** | **−8px** |
| **Lead image** | **358×239** (~1.50 aspect) | **358×200** (`max-height: 200px`) | **−39px** height |
| **Opening order** | Image **y=189** then headline **y=465** (image-first) | Headline **y=702** then image **y=877** (copy-first) | Inverted vs Atlantic mobile |

![Atlantic Wayback mobile](/cursor/stores/self/media/atlantic-fidelity/atlantic-wayback-mobile-390x844.png)

![AmpliYorker mobile](/cursor/stores/self/media/atlantic-fidelity/ampliyorker-mobile-390x844.png)

---

## Live Atlantic limitation (evidence)

Screenshots `atlantic-desktop-1440x1000.png` and `atlantic-mobile-390x844.png` show only Cloudflare block copy (`h1` **48px**, decorative image **700×630** / **342×308** on interstitial — **not editorial**). Do not use those rects for fidelity targets.

---

## Phase 1 build slice (P2H-BUILD-FIDELITY-P1-001)

After opening-mosaic + fused chrome on `atlantic-fidelity` — see `docs/evidence/atlantic-fidelity/p2h-p1-geometry.json`, `side-by-side-p1-1440.png`, `side-by-side-p1-390.png`.

| Metric | Target | Post P1 (measured) |
| --- | --- | --- |
| FID-M01 gutter @ 1440 | 80px | See `p2h-p1-geometry.json` `gutterLeft` |
| FID-M02 container | 1280px | `gridWidth` |
| FID-M03 topology | 296/624/296 | `data-opening-mosaic` 3-column @ ≥769 |
| FID-M04 lead image | 624×416 3:2 | `leadImage` bbox |
| FID-M05 mobile order | image-first | `imageBeforeHeadline` |
| FID-M06 mobile chrome | ≤120px (+ slim promo) | `chromeHeight` @ 390 |

---

## Priority fidelity gaps (for Builder phase 1)

1. **Opening grid topology** — move from 820+300 magazine layout toward **1280-centered 3-across mosaic** (296 / 624 / 296) or faithful simplification with measured gutters.
2. **Lead package order (mobile)** — Atlantic image-first above fold; AmpliYorker copy-first.
3. **Header stack** — collapse utility + wordmark + subscribe into **single ~226–294px nav**; remove or slim **64px promo slab** and **edition line** unless product requires them elsewhere.
4. **Page inset** — reduce horizontal margin **144px → 80px** @ 1440 to match **1280px** Atlantic container.
5. **Lead image proportion** — target **~624×416 (3:2)** desktop lead cap, not **820×280** banner.