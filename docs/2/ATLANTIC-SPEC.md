# Phase 2F — Atlantic-inspired refinement — UX specification

## Status and phase

| Field | Value |
| --- | --- |
| **Status** | **READY** |
| **Phase ID** | `2F` (Atlantic refinement; assignment **`P2F-UX-ATLANTIC-001`**) |
| **Audited revision** | Git `main` post–photo merge (`5a7dcbafa2496f70801432a2aea230335efc55e6` or later); live https://beccaabusharkh.github.io/AmpliYorker/ |
| **Implementation branch** | `atlantic-refinement` (Builder **`P2F-BUILD-ATLANTIC-001`**, agent `bc-e05e21fe-01c2-5e95-981a-bb0d5f5193b2`) |
| **Objective** | Re-skin Amplitude Daily toward **The Atlantic** digital character: **pure white** canvas, **compact masthead** + subscribe promo band, **smaller editorial imagery** and denser grid, refined **typography**, **ad** proportions, **article** column rhythm, polished **login/register**, **three-tier subscribe** + paywall, **Ask the Daily** chat panel — while preserving routes, journeys, content/placement/campaign IDs (where applicable), Amplitude/Statsig contracts, demo controls, and simulated auth/checkout/chat. |
| **Viewports (verification)** | `1440×1000`, `768×1024`, `390×844` |
| **Reviewed routes** | `#/`, `#/article/:id` (flagship `cohort-compound-interest`, premium `retention-myths`), `#/search`, `#/topic/:slug`, `#/author/:slug`, `#/account/login`, `#/account/register`, `#/account`, `#/subscribe`, `#/checkout`, `#/checkout/confirmation` |
| **Exclusions** | UX agent code/git; new vendor SDKs; new Statsig experiments/gates; removal of Exposure Inspector; hash router or Pages base path changes |
| **Supersedes** | `docs/2/PHOTO-SPEC.md` **60/40** lead grid (`3fr 2fr`), large `min-height` hero targets, ivory `--color-paper` as page ground, and any oversized home/article image defaults that conflict with this spec |
| **Supporting brief** | `/cursor/stores/self/docs/atlantic-refinement-brief.md` |

---

## Audit evidence

| Source | Method | Result |
| --- | --- | --- |
| https://www.theatlantic.com/ | Playwright @ 1440×1000, 390×844 | **Access blocked** (bot/WAF interstitial; title `Your access has been blocked – The Atlantic`). Body background on interstitial: `rgb(255, 255, 255)`. Screenshots: `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/media/atlantic-refine/theatlantic-home-desktop-1440.png`, `theatlantic-home-mobile-390.png`; metrics: `browser-audit.json`. |
| https://beccaabusharkh.github.io/AmpliYorker/#/ | Playwright @ 1440×1000 | Baseline screenshot: `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/media/atlantic-refine/ampliyorker-baseline-1440.png`. Ivory ground `#faf9f7`; 60/40 lead; lead image computed height **~1080px**. |
| User reference screenshots (masthead / subscribe / chat) | Glob Project store + workspace | **Not found** — Builder and verify agents must rely on this spec and Atlantic public design patterns only. |
| Repo `main` | Static read | `src/ui/shell.ts`, `src/pages/home.ts`, `src/styles/editorial.css`, `src/styles/tokens.css`, account/subscribe/checkout pages, `src/ui/discovery-chat.ts`, `src/data/plans.json` (2 plans today), photo ads + editorial WebPs from photo merge. |
| Internal audit note | `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/internal/atlantic-refine/browser-audit-summary.md` | |

---

## Requirement map (sections 1–9)

| § | Theme | Builder outcome |
| --- | --- | --- |
| **1** | White background | `#ffffff` page + shell surfaces; rules `#e2e2e2`; retire ivory as **page** ground |
| **2** | Masthead + promo | Compact Atlantic-style header: utility row, centered wordmark, **subscribe promo band**, slim rules, right-aligned Subscribe / Log in |
| **3** | Smaller images / grid | **Stacked** lead (headline-first); capped image heights; dense secondary + feed thumbs; **not** 60/40 side-by-side hero |
| **4** | Typography | Display serif headlines, neutral sans UI, 18px body measure; tighter headline scale |
| **5** | Ads | Photo ads retained; **reduced** visual dominance (shorter leaderboard, inline label hierarchy) |
| **6** | Articles | Narrower hero, square crop, Atlantic-style byline row; preserve long-form / paywall / progress |
| **7** | Login / register | Centered account column, Atlantic CTA color, card shell on white |
| **8** | Three-plan subscribe | Add third plan in `plans.json` + comparative grid; paywall CTAs aligned |
| **9** | Chat | Sierra-inspired **Ask the Daily** panel (header, chips, shadow, FAB); preserve behavior + analytics |

---

## Findings (baseline → target)

| ID | Area | Current | Impact | Target |
| --- | --- | --- | --- | --- |
| ATL-01 | Global | `--color-paper: #faf9f7` | Off-Atlantic warmth | `--color-canvas: #ffffff`; paper token only for optional inset cards |
| ATL-02 | Shell | Masthead 2.25rem / thick 3px rule / tall padding | Magazine-NYT not Atlantic | Compact masthead ~1.5–1.75rem; **1px** rules; total masthead block ≤ **72px** excluding promo |
| ATL-03 | Shell | No subscribe promo band | Weak conversion lane | Full-width **promo band** below masthead (desktop + mobile variants) |
| ATL-04 | Home | `lead-grid` **3fr 2fr**, hero `min-height: 360px`, 16:9 uncapped | PHOTO 60/40 dominates viewport | **Single-column** lead: copy first, image **max-height 280px** (3:2) |
| ATL-05 | Home | Secondary 4:3 full-width thumbs | Large tiles | **16:9** thumbs **max-height 140px**; tighter headline 1rem |
| ATL-06 | Article | Hero uses full width + tall 16:9 | Oversized | Hero **max-height 420px** @ ≥769px; caption below rule |
| ATL-07 | Subscribe | 2 plans | Brief requires 3 | **Digital Monthly**, **Digital Annual**, **Premium Annual** (fictional) |
| ATL-08 | Account | Generic `form-panel` on gray tokens | Inconsistent with white Atlantic | `account-surface` card, serif page title, primary **ink** button |
| ATL-09 | Chat | Functional but generic FAB/panel | Brief Sierra polish | Taller panel, accent top rule, chip row, refined FAB |

---

## Component and file map

| File | Responsibility (Atlantic changes) |
| --- | --- |
| `src/styles/tokens.css` | Align `--color-bg` / surfaces to white; add `--color-canvas`, `--color-promo`, `--color-cta-subscribe`, `--font-atlantic-display` |
| `src/styles/editorial.css` | **Primary** layout/token overrides: masthead, promo band, lead/secondary/feed tiers, article hero caps, account, plan grid, ask-daily |
| `src/ui/shell.ts` | Masthead structure: utility row, **promo band** markup (`data-subscribe-promo`), relocate Subscribe CTA, optional mobile menu affordance (visual only; same links) |
| `src/pages/home.ts` | Lead markup order: **copy block before image** inside `home-lead-package`; retain all `data-*` hooks |
| `src/pages/article.ts` | Optional `article-masthead` meta row classes; hero `figure` wrapper classes only — **no** analytics hook changes |
| `src/pages/login.ts` | Wrap in `account-surface`; add `data-login-form` preservation |
| `src/pages/register.ts` | Same account shell |
| `src/pages/subscribe.ts` | Three-column plan grid; highlight **recommended** annual digital |
| `src/pages/checkout.ts` | Support `premium` plan amounts (spec below) |
| `src/pages/account.ts` | Visual reskin; **`<details>` demo controls** unchanged |
| `src/data/plans.json` | Third plan object + copy |
| `src/lib/plans.ts` | No logic change (types already generic) |
| `src/lib/ads.ts` | Optional class tweaks via `extraClass`; **no** placement/id changes |
| `src/ui/discovery-chat.ts` | Class names + minor markup (icon span, subtitle); **preserve** `data-ask-daily`, `data-chat-*`, `mountAskDailyAssistant` |
| `src/ui/account-support-chat.ts` | Match ask-daily visual language on account routes |
| `public/images/**` | **No** asset replacement required for Atlantic pass unless Builder swaps crops; use existing WebPs with **CSS size caps** |

---

## Screen compositions

### Desktop home (1440×1000) — ASCII

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ UTILITY: Today's edition · date          Newsletter    Log in / Account     │
├──────────────────────────────────────────────────────────────────────────────┤
│                         AMPLITUDE DAILY (wordmark)                           │
│              Independent reporting on product analytics…                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ PROMO BAND: Subscribe for unlimited access · From $12/mo (simulated)  [CTA]│
├──────────────────────────────────────────────────────────────────────────────┤
│ Home | Product Analytics | … | Subscribe          [ Search____________ ]      │
├──────────────────────────────────────────────────────────────────────────────┤
│ [ Leaderboard ad — max visual height 90px ]                                   │
├───────────────────────────────────────────────┬──────────────────────────────┤
│ KICKER · COVER STORY                          │  Sponsored insight           │
│ H2 Lead headline (serif, ~2rem)                 │  Rail ad 300×250 cap         │
│ Lead deck                                       │  Latest / Editor's picks     │
│ Byline meta row (future slot)                   │                              │
│ ┌─────────────────────────────┐               │                              │
│ │ Lead image 3:2 max-h 280px  │               │                              │
│ └─────────────────────────────┘               │                              │
│ [ 3 × secondary cards — small 16:9 thumbs ]    │                              │
│ [ Tabbed feed — 64×48 thumbs ]                 │                              │
│ … newsletter, podcast, topics …                │                              │
└───────────────────────────────────────────────┴──────────────────────────────┘
                                                      [ Ask the Daily FAB ]
```

### Mobile home (390×844) — ASCII

```
┌─────────────────────────┐
│ utility (stacked)       │
│ WORDMARK (1.375rem)     │
│ PROMO band (2 lines)    │
│ nav scroll → Subscribe  │
│ search                  │
│ leaderboard             │
│ headline → deck         │
│ lead img max-h 200px    │
│ secondary 1-col         │
│ tabs / feed             │
│ rail modules stack      │
└─────────────────────────┘
```

### Article desktop — ASCII

```
[sticky reading progress 2px]
[kicker]
H1 headline (2.5rem max)
deck · byline · date · topic links · save
────────────────────────────
[ hero max-h 420px, full content width ≤ measure-wide ]
caption
────────────────────────────
body measure 42rem — drop cap, pull quote, inline figures (max-h 320px)
[paywall preview fade when locked]
rail MPU @ ≥768 sticky top 88px
```

---

## Section 1 — White background

| Token | Value | Apply to |
| --- | --- | --- |
| `--color-canvas` | `#ffffff` | `html`, `body`, `.site-header`, `.home-section-nav`, `.page-main` |
| `--color-paper` | **Deprecated as page bg** → set equal to `#ffffff` or alias `--color-canvas` | Migration: replace `background: var(--color-paper)` on shell with `--color-canvas` |
| `--color-surface` | `#ffffff` | Cards, chat panel, account forms |
| `--color-rule` | `#e2e2e2` | Hairline rules (was `#d4d4d4`) |
| `--color-rule-strong` | `#121212` | Masthead bottom rule **1px** only (remove 3px `--rule-thick` on masthead) |
| `--color-ink` | `#121212` | Text (unchanged) |
| `--color-ink-muted` | `#5c5c5c` | Decks, meta |

**Acceptance note:** Body computed `background-color` must be `rgb(255, 255, 255)` at all breakpoints.

---

## Section 2 — Masthead and subscribe promo band

### Utility row (`site-utility-bar`)

| Property | Value |
| --- | --- |
| Height | `32px` min |
| Padding | `0 20px` (1440), `0 16px` (390) |
| Font | `0.6875rem` / `600` / sans (`--font-ui`) |
| Border-bottom | `1px solid var(--color-rule)` |

Preserve copy and links from `shell.ts` (`Today's edition`, `Newsletter`, `Log in` / `Account`).

### Masthead (`site-masthead`)

| Property | Current | Atlantic target |
| --- | --- | --- |
| Font size | `2.25rem` (36px) | **`clamp(1.375rem, 2.5vw, 1.75rem)`** |
| Padding | `24px 24px 16px` | **`16px 20px 12px`** |
| Border | `3px solid ink` | **`1px solid var(--color-rule-strong)`** below masthead only |
| Tagline | visible | **Hidden ≥769px**; show under wordmark **only @ ≤768** at `0.8125rem` muted |

Wordmark text remains **Amplitude Daily** (do not copy Atlantic trademark).

### Subscribe promo band (new)

| Property | Value |
| --- | --- |
| Element | `div.site-promo-band` with `data-subscribe-promo` |
| Placement | Between masthead block and `nav.home-section-nav` |
| Background | `#121212` |
| Text | `#ffffff`, `0.8125rem` |
| Copy (verbatim) | `Subscribe for full access to Amplitude Daily — simulated plans from $12/month.` |
| CTA | Link styled as button: `Subscribe` → `#/subscribe`; class `promo-band__cta`; min-height `44px` |
| Mobile | Stack CTA below text; padding `12px 16px` |

### Section nav

| Property | Target |
| --- | --- |
| Sticky | `top: 0`; background `--color-canvas` |
| Link style | Sans `0.8125rem` `600`; **no** uppercase |
| Subscribe link | Retain in list; **also** surface in promo CTA |
| Search | Right cluster; input border `1px solid var(--color-rule)` |

### Measurements (1440)

| Region | Approx height |
| --- | --- |
| Utility | 32px |
| Masthead + rule | 56px |
| Promo band | 44px |
| Section nav | 48px |
| **Total chrome** | **~180px** before main content (vs ~230px+ today) |

---

## Section 3 — Homepage grid and image size tiers

**Supersedes PHOTO-SPEC 60/40:** Builder must **not** use `grid-template-columns: 3fr 2fr` on `.lead-grid`.

### Lead package

| Property | Target |
| --- | --- |
| Layout | `.lead-grid { display: flex; flex-direction: column; gap: 16px; }` — **copy first**, image second |
| Image class | `.lead-hero-image` |
| Aspect ratio | **3:2** |
| Max height | **280px** @ ≥769px; **200px** @ ≤768 |
| Min height | **Remove** `min-height: 360px` / `320px` |
| Width | `100%`, `object-fit: cover`, `object-position: center 35%` |
| Headline | `.lead-headline` → `clamp(1.5rem, 2.2vw, 2rem)` |

### Secondary leads (3-up → 3-up retained)

| Tier | Class | Max height | Aspect | Headline |
| --- | --- | --- | --- | --- |
| Secondary | `.secondary-lead-thumb` | **140px** | **16:9** | `1rem` / `600` |
| Podcast spotlight | `.podcast-spotlight-thumb` | **160px** | 16:9 | — |
| Feed row | `.feed-thumb` | **48px** fixed | **4:3** (64×48 keep) | unchanged |

### Home editorial grid

| Breakpoint | Columns |
| --- | --- |
| ≥769px | `minmax(0, 1fr) 300px` (unchanged max-width `75rem`) |
| ≤768px | Single column |
| ≤390px | Padding `16px`; secondary **1 column** |

### Homepage photo density

Retain photo merge assets; Atlantic pass **reframes** not rescans:

| Rule | Value |
| --- | --- |
| Min distinct raster URLs on `#/` | **≥8** (inherited from photo merge) |
| Max lead image painted height @ 1440 | **≤280px** (was ~1080px baseline) |
| Photos in first **1200px** scroll | Leaderboard + lead + first secondary (**≥3**) |

---

## Section 4 — Typography

| Role | Stack | Size / weight |
| --- | --- | --- |
| Display / masthead / H1 | `--font-atlantic-display`: `"Lyon Text", "Guardian Egyptian", Georgia, serif` | Masthead 1.75rem; article H1 `clamp(2rem, 4vw, 2.5rem)` |
| Body long-form | `--font-body-serif`: `Georgia, "Times New Roman", serif` | **18px** / line-height **1.6** |
| UI / utility / nav | `--font-ui`: `"Graphik", "Helvetica Neue", Inter, sans-serif` | 0.8125–0.875rem |
| Kickers | sans uppercase | `0.6875rem`, letter-spacing `0.1em` |
| Ad label | sans | `0.6875rem` bold, muted |

**Links:** Default ink with underline on hover; accent `#0059c1` for in-body links only (preserve existing).

**Measure:** Article body `--measure-article: 42rem` (672px). Home copy blocks `max-width: 40rem` optional on lead deck.

---

## Section 5 — Ads

Preserve campaigns (`camp-northline-display`, `camp-sunday-house-rail`, `camp-margin-coffee-mpu`) and **placement IDs**.

| Placement | DOM | Size target (Atlantic — less dominant) |
| --- | --- | --- |
| Leaderboard | `.home-leaderboard-wrap` → `[data-leaderboard-slot]` | Image **max-height 90px** (was 120px); label above; **no** full-bleed photo past 970×90 safe area |
| Rail | `[data-rail-ad-slot]` | **300×250** max; border `1px solid var(--color-rule)`; padding `12px` |
| MPU | article rail / `[data-article-mpu]` | **300×250**; same border treatment |

Label remains verbatim: **`Advertisement · Simulated`**.

CTA: filled **ink** button on white (`background: #121212; color: #fff; border-radius: 2px`).

---

## Section 6 — Articles

| Element | Specification |
| --- | --- |
| Progress | 2px bar, ink fill (unchanged behavior) |
| Masthead block | Centered @ mobile; left-aligned @ ≥769px; max-width `48rem` |
| Hero | `.article-hero img` — **max-height 420px** (≥769), **240px** (≤768); `width: 100%`; `object-fit: cover`; **no border-radius** |
| Inline figures | `max-height: 320px`; caption `0.8125rem` muted |
| Paywall preview | Unchanged logic; fade height `80px` on white |
| Rail | Sticky `top: 88px` accounting for shorter header |

**Flagship verification articles:** `cohort-compound-interest` (feature), `retention-myths` (premium paywall).

---

## Section 7 — Login and register

Shared pattern `account-page` / `account-surface`:

| Property | Value |
| --- | --- |
| Main | `max-width: 28rem`; margin `48px auto`; padding `0 20px` |
| Card | `.account-surface`: border `1px solid var(--color-rule)`; padding `32px 28px`; background `#fff` |
| H1 | Display serif `1.75rem`; margin-bottom `8px` |
| Simulation label | `0.8125rem` muted; margin below title |
| Inputs | Full width; height `44px`; border `1px solid var(--color-rule)` |
| Primary button | Full width; background `#121212`; color `#fff`; height `48px`; font-weight `600` |
| Secondary links | Centered below card; accent links |

**Preserve:** `data-login-form`, `data-register-form`, field `name`s, persona select behavior, events `Sign In Completed` / `Registration Completed`.

**Copy:** Unchanged from current `login.ts` / `register.ts` strings (simulated labels).

---

## Section 8 — Three-plan subscribe and paywall

### `plans.json` (add third tier)

| `id` | `name` | `priceLabel` | `introOfferLabel` | `renewalIntervalDays` | Notes |
| --- | --- | --- | --- | --- | --- |
| `monthly` | Digital Monthly | `$12 / month` | (unchanged) | 30 | |
| `annual` | Digital Annual | `$99 / year` | (unchanged) | 365 | **Recommended** badge in UI |
| `premium` | **Premium Annual** | `$149 / year` | `Introductory offer — $119 for your first year (simulated)` | 365 | Fictional bundle: audio + deep dives |

### Subscribe page layout

| Breakpoint | Layout |
| --- | --- |
| ≥769px | `grid-template-columns: repeat(3, 1fr)`; gap `20px` |
| ≤768px | Single column stack; recommended plan first |

| UI element | Spec |
| --- | --- |
| Plan card | Border `1px solid var(--color-rule)`; padding `24px 20px`; **no** heavy shadow |
| Recommended | `annual` card: `border-color: #121212`; pill `Recommended` |
| Feature bullets | Static list per plan (3 bullets each, fictional) — Builder adds under price |
| Buttons | Keep `data-select-plan`, `data-intro="true|false"` on **both** CTAs per plan |
| Logged out | Same gate; CTA to login |

### Checkout amount mapping (extend `subscribe.ts` / `checkout.ts`)

| Plan | Standard USD | Intro USD |
| --- | --- | --- |
| `monthly` | 12 | 1 |
| `annual` | 99 | 79 |
| `premium` | 149 | 119 |

**Analytics:** `plan_id` may include `premium`; **do not** rename events.

### Paywall CTAs

Article paywall actions remain `data-paywall-login`, `data-paywall-sub`; style as text links + optional **Subscribe** button (ink filled) matching promo band.

---

## Section 9 — Ask the Daily chat (Sierra-inspired)

**File:** `src/ui/discovery-chat.ts` — behavior, FAQ matching, `Alt+D`, focus trap **unchanged**.

| Element | Target |
| --- | --- |
| FAB `.ask-daily-fab` | Height `48px`; padding `0 20px`; border `1px solid #121212`; font-weight `600`; optional leading `?` icon in span |
| Panel `.ask-daily-panel` | Width `min(26rem, calc(100vw - 2rem))`; max-height `min(32rem, 70vh)`; border-radius `12px`; box-shadow `0 12px 40px rgba(0,0,0,0.12)` |
| Header | Bottom border `1px solid var(--color-rule)`; padding-bottom `12px`; subtitle `How can we help you explore the demo?` at `0.75rem` muted |
| Disclosure | Keep verbatim scripted disclaimer |
| Chips | Outline pills; active/hover border ink |
| Input row | Rounded input `8px`; submit button ink fill |
| z-index | Panel `25`; Exposure Inspector stays **below** open panel |

**Account support chat:** Mirror panel styles in `account-support-chat.ts`.

---

## Analytics and selector preservation

### Must preserve (no rename, no removal)

| Selector / attribute | Location |
| --- | --- |
| `data-component="site-header"` | `shell.ts` header |
| `data-subscribe-promo` | **New** promo band (additional) |
| `data-newsletter-link`, `data-utility-account`, `data-section-link`, `data-header-search` | Header |
| `data-component="home-lead"`, `data-lead-link` | Home lead |
| `data-leaderboard-slot`, `data-rail-ad-slot` | Home ads |
| `data-placement-id`, `data-ad-id`, `[data-ad-cta]` | `ads.ts` |
| `data-home-tabs`, `data-tab`, `data-feed-list`, `data-feed-empty` | Tab feed |
| `data-sponsored-module`, `data-newsletter`, `data-newsletter-form`, `data-newsletter-success` | Home modules |
| `data-retention-sub`, `data-latest-list` | Rail / retention |
| `data-article-body`, `data-progress-bar`, `data-save-article` | Article |
| `data-paywall-preview`, `data-paywall-login`, `data-paywall-sub`, `data-rec-link` | Article |
| `data-login-form`, `data-register-form`, `data-select-plan` | Account flows |
| `data-ask-daily`, `data-chat-toggle`, `data-chat-form`, `data-chip`, `data-chat-close`, `data-chat-answer`, `data-chat-transcript` | Ask the Daily |
| `data-amplitude-mask` | Masked fields (unchanged) |

### Event names (no changes)

Per `custom-events.yml`: including `Read Article`, `Advertisement Viewable`, `Ad Revenue Recorded`, `Sign In Completed`, `Registration Completed`, `Subscription Added To Cart`, `Checkout Started`, `Subscription Payment Completed`, `Chat Request Submitted`, `Chat Response Delivered`, paywall/retention/newsletter events.

### Builder analytics rules

| Rule | Detail |
| --- | --- |
| Ad viewability | `IntersectionObserver` threshold **0.5** unchanged |
| `placement_id` | **Do not** change `home_leaderboard`, `home_rail`, `article_mpu` |
| Third plan | Emit `plan_id: premium` on cart/checkout when selected |
| Promo band CTA | Track as navigation only; **no** new event |

---

## Accessibility

| Requirement | Spec |
| --- | --- |
| Contrast on white | Body text ≥ **4.5:1**; promo band white on `#121212` ≥ **4.5:1** |
| Focus | Visible `2px #0059c1` outline (unchanged) |
| Touch | Promo CTA, FAB, nav links ≥ **44px** min dimension |
| Heading order | One `h1` per route; home page `h1` = masthead wordmark |
| Promo band | `aria-label="Subscription promotion"` on `data-subscribe-promo` |
| Ask the Daily | `role="dialog"`, `aria-expanded` on FAB, focus trap preserved |
| Reduced motion | Progress bar + image transitions none |

---

## Acceptance criteria

| ID | Steps | Expected result | Evidence |
| --- | --- | --- | --- |
| **P2F-ATL-A01** | Open `#/` @ 1440×1000 | `body` background **#ffffff** (not `#faf9f7`) | Computed style + screenshot |
| **P2F-ATL-A02** | Inspect `.lead-grid` | **No** `3fr 2fr`; column/stack with copy **above** image | DevTools |
| **P2F-ATL-A03** | Measure `.lead-hero-image` | Painted height **≤280px** @ 1440 | Bounding rect |
| **P2F-ATL-A04** | Header stack | Promo band visible with verbatim copy + Subscribe CTA; masthead total ≤ **72px** excluding promo | Screenshot |
| **P2F-ATL-A05** | Secondary cards | Thumbs **16:9**, height **≤140px** | DOM |
| **P2F-ATL-A06** | `#/` @ 390×844 | No horizontal overflow; promo stacks; lead img **≤200px** | Screenshot |
| **P2F-ATL-A07** | Leaderboard ad | `max-height ≤90px` image; `data-placement-id="home_leaderboard"` | DOM |
| **P2F-ATL-A08** | Open `#/article/cohort-compound-interest` | Hero **≤420px** tall @ 1440; milestones still fire on scroll | Screenshot + events |
| **P2F-ATL-A09** | `#/article/retention-myths` logged out | Paywall preview + styled CTAs; `data-paywall-sub` works | DOM |
| **P2F-ATL-A10** | `#/account/login` | Centered `account-surface` card; `data-login-form` intact | Screenshot |
| **P2F-ATL-A11** | `#/subscribe` logged in | **Three** plan cards; `annual` shows Recommended; `data-select-plan` on buttons | DOM |
| **P2F-ATL-A12** | Select **premium** intro → checkout | Checkout shows Premium Annual; payment smoke completes | Journey |
| **P2F-ATL-A13** | Ask the Daily open @ 1440 | Panel ≥ **24rem** wide; header rule; chips visible; `Alt+D` toggles | Manual |
| **P2F-ATL-A14** | Tab home feed | `data-tab` / `data-feed-list` unchanged; keyboard tabs work | a11y spot check |
| **P2F-ATL-A15** | Ad CTA click | `Ad Revenue Recorded` + viewability still fire | Inspector |
| **P2F-ATL-A16** | `pnpm typecheck` && `pnpm build` | Exit 0 | CI log |
| **P2F-ATL-A17** | Compare to baseline PNG | Lead image area materially smaller than `ampliyorker-baseline-1440.png` | Before/after in `docs/evidence/atlantic-refine/` |
| **P2F-ATL-A18** | Statsig surfaces | Home retention + paywall scroll gate unchanged | Exposure inspector |
| **P2F-ATL-A19** | Photo merge regression | ≥8 raster images still on home; Northline/Sunday/Margin assets present | Network |
| **P2F-ATL-A20** | Reference screenshots | Documented **absent** in store; spec is sole UX reference for masthead/subscribe/chat | This spec § Audit |

### Verification evidence target

Builder/verify: `docs/evidence/atlantic-refine/` — screenshots @ 1440, 768, 390; before=`media/atlantic-refine/ampliyorker-baseline-1440.png`.

---

## Blocked decisions

| Item | Resolution |
| --- | --- |
| Live theatlantic.com DOM metrics | **Blocked** — use assignment + this spec |
| User masthead/subscribe/chat screenshots | **Not provided** — documented |

---

## Planner handoff

- **Spec path:** `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/docs/2/ATLANTIC-SPEC.md`
- **Status:** **READY**
- **Supersedes:** conflicting `PHOTO-SPEC.md` hero/grid/ivory guidance
- **Builder:** `P2F-BUILD-ATLANTIC-001` on branch `atlantic-refinement` after dispatch
- **Baseline evidence:** `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/media/atlantic-refine/`
- **Internal audit:** `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/internal/atlantic-refine/browser-audit-summary.md`