# Phase 2 photography-led visual fix — UX specification

## Status and phase

| Field | Value |
| --- | --- |
| **Status** | **READY** |
| **Phase ID** | `2` (photography extension; assignment **`P2E-UX-PHOTO-001`**) |
| **Audited revision** | Git `main` workspace HEAD (2026-11-18); live https://beccaabusharkh.github.io/AmpliYorker/ |
| **Implementation branch** | `photo-editorial-v2` (Builder `P2E-BUILD-PHOTO-001`; commit yes; no push without Planner) |
| **Objective** | Replace reused SVG placeholders with distinct licensed or generated photography: 60/40 desktop lead hero, ≥8 homepage photos (≥3 in first two viewport heights), three photoreal ad campaigns, article heroes and inline art — without changing routes, journeys, or Amplitude/Statsig event contracts |
| **Viewports (verification)** | `1440×1000`, `768×1024`, `390×844` |
| **Reviewed routes** | `#/` (home), `#/article/:id` (all corpus IDs), flagship `#/article/cohort-compound-interest`, `#/article/retention-myths` (premium paywall), any article with `wordCountBand: "feature"` |
| **Exclusions** | Code changes by UX agent; git push/merge/deploy; new vendors; new Statsig gates/experiments; deleting `public/images/editorial/*.svg` until Builder confirms zero references |
| **Supporting brief** | `/cursor/stores/self/docs/photography-led-redesign-brief.md` |

---

## Audit evidence

| Source | Method | Result |
| --- | --- | --- |
| `public/images/editorial/` | Repo listing | **3 files only:** `hero-placeholder.svg`, `inline-a.svg`, `inline-b.svg` |
| `src/data/articles.json` | Static read | **6** stories define `heroImage`; all six point at `hero-placeholder.svg`; **6** reuse `inline-a.svg` / `inline-b.svg` |
| `src/lib/articles.ts` | Static read | Featured home lead = `cohort-compound-interest` (`FEATURED_ID`) |
| `src/pages/home.ts` | Static read | Lead hero `<img class="lead-hero-image">`; **no** thumbnails on secondary leads, feed list, or podcast strip |
| `src/data/ads.json` | Static read | Three **text-only** campaigns: `camp-metricsmart-display`, `camp-cohortly-video`, `camp-pipeline-pros`; placements `home_leaderboard`, `home_rail`, `article_mpu` |
| `src/lib/ads.ts` | Static read | `renderAdUnit` — label, body, CTA only; **no** `<img>`; preserves `data-placement-id`, `data-ad-id`, `[data-ad-cta]` |
| `src/styles/editorial.css` | Static read | `.lead-grid { grid-template-columns: 1.2fr 1fr; }` ≈ **55/45**, not 60/40; hero `aspect-ratio: 3/2`; breakpoints `768px`, `390px` |
| Live site | Remote (HTTP 200) | Same bundle as `main`; visible SVG illustration aesthetic on home lead and article heroes |

**Featured article (home lead):** `cohort-compound-interest`

**Home secondary leads (runtime, “Top Stories” default):** first three non-sponsored articles after featured by `publishedAt` desc → **`daily-decisions`**, **`retention-myths`**, **`funnel-friction`**.

---

## Findings

| ID | Screen | Component | Current | Impact | Required change |
| --- | --- | --- | --- | --- | --- |
| PF-01 | Home | Lead hero | Single SVG reused | Weak magazine credibility | Distinct photo for `cohort-compound-interest`; 60/40 lead grid |
| PF-02 | Home | Secondary leads | Text-only cards | No visual hierarchy | Add 4:3 thumbs using each story’s hero asset |
| PF-03 | Home | Tab feed | Text links only | <8 photos on page | Add 48×48 or 80×60 thumbs for first **three** visible feed rows |
| PF-04 | Home | Podcast spotlight | Text only | Missed photo slot | Hero thumb for `signal-weekly-podcast` |
| PF-05 | Home / Article | Ad slots | CSS box + copy | Ads demo underwhelming | Photo-forward Northline / Sunday House / Margin Coffee units |
| PF-06 | Article | Hero / inline | 3 SVGs recycled | Long-form feels templated | Unique WebP/JPEG per `heroImage` + per inline slot |
| PF-07 | Global | Manifest | Absent | No license/alt audit trail | `public/images/ASSET-MANIFEST.md` per schema below |

---

## Screen and component inventory

### Home `#/` — photography-related

| ID | Anchor | Role | Photo behavior |
| --- | --- | --- | --- |
| HP-001 | `.home-leaderboard-wrap` / `[data-leaderboard-slot]` parent | Northline leaderboard ad | Campaign image 970×250 safe area (responsive width 100%) |
| HP-002 | `[data-component="home-lead"]` `.lead-hero-image` | Cover hero | Story `cohort-compound-interest` hero file; 60/40 grid left column |
| HP-003–005 | `.home-secondary-leads .secondary-lead-card` | Secondary package | New `.secondary-lead-thumb` per story IDs in map |
| HP-006 | `[data-rail-ad-slot]` | Sunday House rail | 300×250 min slot image |
| HP-007 | `.home-podcast-spotlight` | Podcast | `signal-weekly-podcast` hero crop |
| HP-008–010 | `[data-feed-list] li` (first 3) | Feed | Inline thumb from each row’s `article.heroImage` |
| HP-011 | `.ad-slot__visual` (new) | Ad chrome | Shared pattern for all three placements |

### Article `#/article/:id`

| ID | Anchor | Role |
| --- | --- | --- |
| AR-001 | `.article-hero img` | Full-width hero from `article.heroImage` |
| AR-002 | `.inline-figure img` | Mid-body figures from `inlineFigures[]` |
| AR-003 | `[data-article-mpu]` or article rail MPU mount | Margin Coffee MPU |

### Builder file touch list (reference only — not UX edits)

| File | Change |
| --- | --- |
| `public/images/editorial/**`, `public/images/ads/**` | New raster assets |
| `public/images/ASSET-MANIFEST.md` | New manifest |
| `src/data/articles.json` | `src` paths + alt/credit |
| `src/data/ads.json` | Campaign IDs, copy, `image` fields |
| `src/lib/ads.ts`, `src/pages/home.ts`, `src/styles/editorial.css` | Image markup, secondary/feed thumbs, 60/40 grid, ad layout |

---

## Exact copy

### Ad disclosure labels (unchanged semantics)

| Placement | `label` (verbatim) |
| --- | --- |
| All simulated ads | `Advertisement · Simulated` |

### Ad campaigns (fictional brands — replace MetricSmart / Cohortly / Pipeline Pros)

| `id` | `placementId` | Brand | `body` (verbatim) | `cta` |
| --- | --- | --- | --- | --- |
| `camp-northline-display` | `home_leaderboard` | **Northline Analytics** | `Northline pipes warehouse metrics into experiment-ready dashboards—without the Sunday scramble.` | `See Northline` |
| `camp-sunday-house-rail` | `home_rail` | **Sunday House Retreats** | `Sunday House offers holdout-friendly team offsites when your experiment calendar needs quiet.` | `Tour spaces` |
| `camp-margin-coffee-mpu` | `article_mpu` | **Margin Coffee Roasters** | `Margin Coffee keeps late-night dashboard reviews civil—simulated sponsor, real caffeine energy.` | `Shop beans` |

**Preservation rule:** `placementId` values **`home_leaderboard`**, **`home_rail`**, **`article_mpu`** must not change (Amplitude `placement_id`).

### Sponsored editorial module (unchanged)

- Heading: `Sponsored insight`
- Disclosure: `Paid post · Simulated sponsor`

---

## Layout and visual values

### Desktop lead package — 60/40 (1440×1000)

| Property | Current | Target |
| --- | --- | --- |
| `.lead-grid` columns | `1.2fr 1fr` | **`3fr 2fr`** (60% image / 40% copy) |
| Gap | `32px` | **`32px`** (unchanged) |
| Image column max | fluid | `minmax(0, 60%)` implicit via `3fr 2fr` |
| `.lead-hero-image` | `aspect-ratio: 3/2`, `object-fit: cover`, `min-height: 320px` | Keep **3:2** for home lead; `object-fit: cover`; `object-position: center 40%`; `min-height: 360px` at ≥769px |
| Copy column | `.lead-copy` | `align-self: center`; padding `0` |

### Homepage photo count map (≥8 distinct **raster** photos on `#/` at 1440)

| Slot ID | DOM region | Story / ad ID | Asset file (see naming) | Counts toward “first two screenfuls” |
| --- | --- | --- | --- | --- |
| HP-P01 | Leaderboard | `camp-northline-display` | `images/ads/camp-northline-display--leaderboard.webp` | **Yes** (above fold) |
| HP-P02 | Lead hero | `cohort-compound-interest` | `images/editorial/cohort-compound-interest--hero.webp` | **Yes** |
| HP-P03 | Secondary 1 | `daily-decisions` | `images/editorial/daily-decisions--hero.webp` (thumb crop) | **Yes** |
| HP-P04 | Secondary 2 | `retention-myths` | `images/editorial/retention-myths--hero.webp` | Optional |
| HP-P05 | Secondary 3 | `funnel-friction` | `images/editorial/funnel-friction--hero.webp` | Optional |
| HP-P06 | Rail ad | `camp-sunday-house-rail` | `images/ads/camp-sunday-house-rail--rail.webp` | Screenful 2 |
| HP-P07 | Podcast | `signal-weekly-podcast` | `images/editorial/signal-weekly-podcast--hero.webp` | Screenful 2 |
| HP-P08 | Feed row 1 | `experiment-runtime` | same story `--hero` at thumb size | Screenful 2 |
| HP-P09 | Feed row 2 | `signal-weekly-podcast` or next in feed | distinct from P07 if duplicate ID use `north-star-metrics-drift--hero` | Screenful 2 |

**Rule:** Minimum **8** unique bitmap URLs on home. **Minimum 3** among HP-P01, HP-P02, HP-P03 must appear before vertical offset **2000px** at 1440×1000 (leaderboard + lead hero + first secondary thumb).

### Secondary lead thumb

| Property | Value |
| --- | --- |
| Class | `.secondary-lead-thumb` (new) |
| Size | width `100%`, `aspect-ratio: 4 / 3`, `object-fit: cover` |
| Margin below image | `12px` |
| Link | Wraps image + headline; same `href` as headline |

### Feed thumb

| Property | Value |
| --- | --- |
| Class | `.feed-thumb` (new) |
| Size | `64px × 48px`, `object-fit: cover`, `border-radius: 2px` |
| Layout | Flex row: thumb + text; gap `12px` |

### Ad photo layout

| Class | Layout |
| --- | --- |
| `.ad-slot--leaderboard` | Image top full width; max-height `120px`; `object-fit: cover`; label above or below image per `docs/2/SPEC.md` ad pattern |
| `.ad-slot--rail` | Image `300×250` area; text under image |
| `.ad-slot--mpu` | Image min `300×250`; CTA below |

### Article hero

| `aspectRatio` (JSON) | CSS | Master file dimensions |
| --- | --- | --- |
| `16:9` | `aspect-ratio: 16/9` | **1920×1080** export |
| `3:2` | `aspect-ratio: 3/2` | **1800×1200** export |
| `4:3` | `aspect-ratio: 4/3` | **1600×1200** export |

Home lead uses featured article ratio (**16:9** for `cohort-compound-interest` after fix).

### Article inline

| Property | Value |
| --- | --- |
| Max width | `min(100%, var(--measure-wide))` |
| Aspect | **16:9** default; `loading="lazy"` |
| `width` / `height` attrs | `800` × `450` (layout hint) |
| Caption | Existing `figcaption`; credit line mandatory |

### Responsive breakpoints

| Viewport | Lead grid | Hero crop | Secondary grid | Feed |
| --- | --- | --- | --- | --- |
| **1440×1000** | 60/40 horizontal | 3:2 cover | 3 columns | Thumbs on |
| **768×1024** | **1 column**; image **above** copy | Full width; `min-height: 280px`; `object-position: center 35%` | 2 columns | Thumbs on |
| **390×844** | Stack | Full width; `min-height: 220px` | 1 column | Thumbs on; rail ad **below** primary column (existing stack) |

### Mobile crop focal points (Builder `object-position`)

| Asset group | `object-position` |
| --- | --- |
| People / teams | `center 30%` |
| Product / coffee / dashboards | `center center` |
| Wide workplace | `center 40%` |

---

## Asset manifest schema

Builder creates **`public/images/ASSET-MANIFEST.md`** with one table per directory.

### Editorial + ads row schema (required columns)

| Column | Type | Description |
| --- | --- | --- |
| `file` | string | Repo-relative path e.g. `images/editorial/daily-decisions--hero.webp` |
| `entity_type` | `story` \| `ad` | |
| `entity_id` | string | `articles.json` `id` or `ads.json` `id` |
| `role` | `hero` \| `inline` \| `thumb` \| `leaderboard` \| `rail` \| `mpu` | |
| `source` | string | `Unsplash:Photo-ID` or `Generated:prompt-hash` |
| `license` | string | e.g. `Unsplash License` |
| `alt_text` | string | Matches JSON `alt` |
| `width` | number | Intrinsic pixels |
| `height` | number | Intrinsic pixels |
| `format` | `webp` preferred; `jpg` fallback | |
| `max_bytes` | number | Target ≤ **180KB** hero, ≤ **90KB** inline/thumb |

### JSON machine manifest (optional but recommended)

`public/images/asset-manifest.json` — array of objects with the same keys for scriptable QA.

---

## Per-story image file naming

**Pattern:** `public/images/editorial/{story-id}--{role}[-{index}].webp`

| Role | Filename | Example |
| --- | --- | --- |
| Hero | `{story-id}--hero.webp` | `cohort-compound-interest--hero.webp` |
| Inline slot 1 | `{story-id}--inline-01.webp` | `daily-decisions--inline-01.webp` |
| Inline slot 2 | `{story-id}--inline-02.webp` | `daily-decisions--inline-02.webp` |

**Ad pattern:** `public/images/ads/{campaign-id}--{placement-suffix}.webp`

| Suffix | Example |
| --- | --- |
| `leaderboard` | `camp-northline-display--leaderboard.webp` |
| `rail` | `camp-sunday-house-rail--rail.webp` |
| `mpu` | `camp-margin-coffee-mpu--mpu.webp` |

**Rules:**

1. `story-id` must match `articles.json` `id` exactly (kebab-case).
2. Replace all references to `hero-placeholder.svg`, `inline-a.svg`, `inline-b.svg` in JSON with the per-story files above for every article that defines `heroImage` / `inlineFigures`.
3. Short articles without `heroImage` today: add `heroImage` + file for any story used in HP-P03–P09 map; minimum corpus photos **18 heroes** if all stories appear in feeds (stretch); **mandatory minimum** = 6 existing feature heroes + 3 secondaries + podcast + 2 feed + 3 ads = satisfies 8+.
4. Do not use shared filenames across stories except responsive `srcset` variants: `{story-id}--hero-768.webp` optional.

### Story ID → asset map (feature articles — full hero + inline)

| story `id` | Hero file | Inline 01 | Inline 02 |
| --- | --- | --- | --- |
| `daily-decisions` | `daily-decisions--hero.webp` | `daily-decisions--inline-01.webp` | `daily-decisions--inline-02.webp` |
| `retention-myths` | `retention-myths--hero.webp` | `retention-myths--inline-01.webp` | `retention-myths--inline-02.webp` |
| `cohort-compound-interest` | `cohort-compound-interest--hero.webp` | `cohort-compound-interest--inline-01.webp` | `cohort-compound-interest--inline-02.webp` |
| `replay-ethics-lab` | `replay-ethics-lab--hero.webp` | `replay-ethics-lab--inline-01.webp` | `replay-ethics-lab--inline-02.webp` |
| `paywall-timing-study` | `paywall-timing-study--hero.webp` | `paywall-timing-study--inline-01.webp` | `paywall-timing-study--inline-02.webp` |
| `identity-graph-fiction` | `identity-graph-fiction--hero.webp` | `identity-graph-fiction--inline-01.webp` | `identity-graph-fiction--inline-02.webp` |

### Story ID → hero only (homepage / corpus — assign distinct editorial photography)

| story `id` | Hero file | Alt text pattern |
| --- | --- | --- |
| `funnel-friction` | `funnel-friction--hero.webp` | `Photo illustrating {headline}` |
| `experiment-runtime` | `experiment-runtime--hero.webp` | same pattern |
| `signal-weekly-podcast` | `signal-weekly-podcast--hero.webp` | same pattern |
| `partner-playbook-sponsored` | `partner-playbook-sponsored--hero.webp` | same pattern |
| `north-star-metrics-drift` | `north-star-metrics-drift--hero.webp` | same pattern |
| `warehouse-latency-culture` | `warehouse-latency-culture--hero.webp` | same pattern |
| `holdout-holiday` | `holdout-holiday--hero.webp` | same pattern |
| `session-replay-masked` | `session-replay-masked--hero.webp` | same pattern |
| `newsletter-aperture` | `newsletter-aperture--hero.webp` | same pattern |
| `guide-surveys-field-note` | `guide-surveys-field-note--hero.webp` | same pattern |
| `win-back-cohort-diaries` | `win-back-cohort-diaries--hero.webp` | same pattern |
| `vendor-stack-sponsored` | `vendor-stack-sponsored--hero.webp` | same pattern |

**Alt text rule:** Describe visible scene, not “illustration” or “sketch”; include topic nouns; never duplicate full headline verbatim if >120 chars — truncate with ellipsis in `alt`.

**Credit line (figcaption):** `Amplitude Daily (simulated) · {Photographer or Unsplash credit}`

---

## States and interactions

| Interaction | Trigger | Result | Analytics |
| --- | --- | --- | --- |
| Lead hero click | `[data-lead-link]` | Navigate `#/article/cohort-compound-interest` | Unchanged |
| Ad viewability | 50% intersection 1s | `Advertisement Viewable` | `ad_id`, `placement_id` from dataset |
| Ad CTA | `[data-ad-cta]` | Toast + `Ad Revenue Recorded` | `ad_id` must match new campaign `id` |
| Article hero | — | Decorative; no separate click | `Read Article` unchanged |
| Inline images | — | Lazy load | — |

**Reduced motion:** No parallax or Ken Burns on photos; static images only.

---

## Accessibility

| Requirement | Specification |
| --- | --- |
| Decorative ads | Ad product photo: `alt=""` if adjacent text repeats offer; else short alt with brand name |
| Editorial heroes | Non-empty `alt` on every `.article-hero img` and `.lead-hero-image` |
| Secondary / feed thumbs | `alt` = shortened story topic (max 80 chars) |
| Contrast on ad text | Body text on `#ffffff` / `#f7f8fa`: ≥ **4.5:1** (use `--color-ink` on `--color-surface`) |
| Focus | Thumbnail links use visible focus ring (existing `:focus-visible` or 2px `#0059c1` outline) |
| Reading order | DOM: leaderboard → lead image → lead headline → secondaries left-to-right → tabs |
| Motion | `prefers-reduced-motion: reduce` — no image transitions |

---

## Journey, analytics, and experiment selectors

### Must preserve (no rename, no removal)

| Selector / attribute | Location |
| --- | --- |
| `data-component="home-lead"` | Home lead section |
| `data-lead-link` | Lead hero + headline links |
| `data-leaderboard-slot` | Parent of leaderboard ad (class `.home-leaderboard-wrap`) |
| `data-rail-ad-slot` | Rail ad mount |
| `data-placement-id`, `data-ad-id` | `.ad-slot` root (`ads.ts`) |
| `[data-ad-cta]` | Ad button |
| `data-home-tabs`, `data-tab`, `data-feed-list`, `data-feed-empty` | Tab feed |
| `data-sponsored-module` | Sponsored strip |
| `data-newsletter`, `data-newsletter-form`, `data-newsletter-success` | Newsletter |
| `data-retention-sub` | Retention module |
| `data-latest-list` | Rail list |
| `data-article-body`, `data-progress-bar` | Article reading |
| `data-rec-link`, `data-paywall-login`, `data-paywall-sub` | Article / paywall |

### Event names (no changes)

`Advertisement Viewable`, `Ad Revenue Recorded`, `Read Article`, `Newsletter Subscription Completed`, `Retention Treatment Presented`, Paywall/checkout/subscription events per `custom-events.yml`.

### Required Builder changes (analytics-impacting)

| Change | Reason |
| --- | --- |
| Update `ads.json` `id` to Northline / Sunday House / Margin Coffee IDs above | `ad_id` property on ad events will change — acceptable; **`placement_id` unchanged** |
| Keep `IntersectionObserver` threshold **0.5** | Viewability contract |
| Do not wrap ad image in separate clickable link unless CTA remains sole engagement control | Avoid duplicate revenue events |

### Statsig (unchanged)

`getHomeRecommendationVariant`, `getRetentionTreatmentVariant`, `STATSIG_GATES.premiumPaywallScroll` — no new exposures from photo work.

---

## Acceptance criteria

| ID | Steps | Expected result | Evidence |
| --- | --- | --- | --- |
| **P2E-PHOTO-A01** | Open `#/` at 1440×1000 | `.lead-grid` uses **60/40** (`3fr 2fr`); lead image is **not** an SVG | Screenshot + computed style |
| **P2E-PHOTO-A02** | View page source / network on home | **≥8** distinct raster image URLs under `images/editorial/` or `images/ads/` | Network log |
| **P2E-PHOTO-A03** | Scroll ≤2000px at 1440×1000 | ≥**3** photos visible (leaderboard, lead hero, secondary #1 minimum) | Screenshot |
| **P2E-PHOTO-A04** | Inspect `cohort-compound-interest--hero.webp` | Home lead uses featured story unique asset | DevTools `src` |
| **P2E-PHOTO-A05** | Check secondary cards | Three thumbs map to `daily-decisions`, `retention-myths`, `funnel-friction` | DOM + manifest |
| **P2E-PHOTO-A06** | Leaderboard ad | Northline photo + label `Advertisement · Simulated`; `data-placement-id="home_leaderboard"` | DOM |
| **P2E-PHOTO-A07** | Rail ad | Sunday House photo; `data-placement-id="home_rail"` | DOM |
| **P2E-PHOTO-A08** | Open `#/article/retention-myths` MPU | Margin Coffee photo; `data-placement-id="article_mpu"` | DOM |
| **P2E-PHOTO-A09** | Open `#/article/cohort-compound-interest` | Hero + ≥2 inline images are **unique** rasters (not `inline-a/b.svg`) | Network |
| **P2E-PHOTO-A10** | Repeat home at **768×1024** | Lead stacks image over copy; no horizontal overflow; thumbs visible | Screenshot |
| **P2E-PHOTO-A11** | Repeat home at **390×844** | Same; secondary grid **1 column** | Screenshot |
| **P2E-PHOTO-A12** | Click ad CTA once | `Ad Revenue Recorded` + `Advertisement Viewable` (on scroll) with new `ad_id` | Event inspector |
| **P2E-PHOTO-A13** | `public/images/ASSET-MANIFEST.md` | Every deployed image has row with `entity_id`, source, alt, dimensions | File review |
| **P2E-PHOTO-A14** | Run `pnpm typecheck` && `pnpm build` | Exit 0 | CI / local log |
| **P2E-PHOTO-A15** | Spot-check `[data-lead-link]` + tab feed keyboard | Focus order and `aria-selected` on tabs unchanged | Manual a11y |

---

## Blocked decisions

None. Spec is **READY** for `P2E-BUILD-PHOTO-001`.

---

## Planner handoff

- **Spec path:** `docs/2/PHOTO-SPEC.md` (Project store: `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/docs/2/PHOTO-SPEC.md`)
- **Status:** **READY**
- **Builder:** Implement on `photo-editorial-v2`; commit manifest + assets; verification `docs/evidence/photo-v2/` per `P2E-VERIFY-PHOTO-001`