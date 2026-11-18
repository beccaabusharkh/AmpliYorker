# Phase 2 editorial redesign — UX specification

## Status and phase

| Field | Value |
| --- | --- |
| **Status** | **READY** |
| **Phase ID** | `2` (editorial redesign extension; assignment `P2-UX-EDITORIAL-001`) |
| **Audited revision** | `main` at `b077491` or later (workspace HEAD `c9e2ff1`, 2026-11-18) — Phases 0–5 shipped (Amplitude, Statsig, ten use cases) |
| **Implementation branch** | `editorial-redesign` branched from audited `main`; no changes to `custom-events.yml` event **names** except milestone enum + copy edits noted under Analytics |
| **Objective** | Premium newspaper/magazine visual and information redesign for **Amplitude Daily**: NYT-style homepage hierarchy + New Yorker-style long-form article rhythm, while preserving every account, subscription, retention, instrumentation, and Statsig journey from `main` |
| **Viewports (verification)** | `1440×900`, `768×1024`, `390×844` |
| **Reviewed routes** | `#/`, `#/article/:id`, `#/search`, `#/search/:query`, `#/topic/:slug`, `#/author/:slug`, `#/account/register`, `#/account/login`, `#/account`, `#/subscribe`, `#/checkout`, `#/checkout/confirmation`, unknown hash → not-found |
| **Exclusions** | Live AI, real payments/auth/email, backend, new vendor SDKs, new Statsig experiments/gates, removal of Exposure Inspector, changing hash router or Pages base path `/AmpliYorker/` |

**Primary references (layout character only — no copied NYT/New Yorker content):**

- Homepage hierarchy: utility row, dated masthead, section navigation, tabbed feeds, dense module grid (NYT-style).
- Long-form rhythm: display headline, deck, byline, date, hero figure + credit, drop cap, ~42rem measure, pull quotes, inline figures with captions, end-of-article treatment (New Yorker-style; reference article structure audited 2026-11-18).

**Supporting brief:** `/cursor/stores/bc-da01a087-ffe1-4bdf-ba6a-966d2a7fd0f5/docs/editorial-redesign-brief.md`

---

## Audit evidence

| Source | Method | Notes |
| --- | --- | --- |
| Live demo | Remote | https://beccaabusharkh.github.io/AmpliYorker/ — 6 articles, two-column home, minimal header (brand + subscribe + search), discovery chat FAB |
| Repo `main` | Static read | `src/pages/*`, `src/ui/*`, `src/styles/tokens.css`, `src/data/articles.json` (6 stories, 2 short body paragraphs each), `custom-events.yml`, `BUILDER_HANDOFF.md` UC-1…UC-10 |
| New Yorker article | Character study | Hero image 16:9, H1 + deck + byline + date, illustrative lead, serif body, pull quote + cartoon interrupt, mid-article figures with credits |
| UX handoff | N/A on `main` | `UX_HANDOFF.md` absent at audit time; scope from assignment + editorial brief + `BUILDER_HANDOFF.md` |

**Observed gaps (editorial redesign scope):**

1. Home lacks utility row, section nav, tabbed feeds, and multi-package hierarchy; only featured + 4-item list + rail ad.
2. Articles lack long-form typography (drop cap, pull quotes, inline art slots), premium measure, and paywall **preview** body separate from full body.
3. Corpus has 6 stories; requirement is ≥18 with 6 features at 1,800–2,500 words.
4. Ask-the-Daily assistant is labeled “Discovery chat” with minimal chrome; brief requires Sierra-inspired redesign.
5. One generic home-rail ad; brief requires three fictional campaigns + sponsored editorial module.
6. `Read Article` fires milestones `10,25,50,75,90,100`; `active_reading_seconds` is always `0` (`src/lib/analytics/article-reading.ts`).
7. Footer still says “Phase 2”; demo controls on account are expanded `<h2>` sections, not collapsible.
8. Breakpoint in CSS is `720px`; verification requires explicit layout at `768px` and `390px`.

---

## Findings

| ID | Screen | Component / area | Current behavior | User impact | Proposed change |
| --- | --- | --- | --- | --- | --- |
| F-01 | Home | `site-header` (`src/ui/shell.ts`) | Single row: brand, tagline, 2 nav links, search | Weak publication identity; no section discovery | Add utility bar, masthead, horizontal section nav, optional “Today’s edition” date line |
| F-02 | Home | `home-layout` | 2-col grid featured + rail | Does not showcase breadth of coverage | NYT-style lead package + 3 secondary leads + tabbed feed + topic ribbons + podcast strip |
| F-03 | Article | `article-body` | Short paragraphs only | Does not demo long-form engagement analytics | New Yorker-style long feature template: hero, ≥2 inline images, pull quote, drop cap, word-count bands |
| F-04 | Article | Paywall | Replaces body with message when locked | No teaser reading / preview milestone story | Show first `previewParagraphCount` paragraphs + gradient fade; full body when `allowed` |
| F-05 | Global | `articles.json` | 6 entries | UC-1/5/6/7 thin | Expand to 18+ JSON entries + assets under `public/images/editorial/` |
| F-06 | Global | Ads | `home-rail-display` only | Under-demonstrates ad viewability/revenue | Three campaigns with reserved slots + in-article MPU + sponsored module |
| F-07 | Global | `discovery-chat` | “Discovery chat” FAB | Off-brand for “Amplitude Daily” | Rebrand “Ask the Daily”, suggested prompts, disclosure, keyboard trap compliant |
| F-08 | Account | `demo-controls` | Always expanded | Clutters account during demos | `<details>` collapsible default **closed**; summary “Demo controls (simulated)” |
| F-09 | Analytics | `Read Article` | Includes 10% milestone; no active time | Misaligned with stakeholder reading model | Milestones `25,50,75,90,100` only; accumulate `active_reading_seconds` per spec below |
| F-10 | A11y | Focus / contrast | Functional but blog-like | Fails premium bar at 1440/768/390 | Sticky nav focus order, visible skip link, 4.5:1 text, reduced-motion on progress bar |

---

## Screen and component inventory

### Global shell (all routes)

| Component ID | DOM / file anchor | Hierarchy | Notes |
| --- | --- | --- | --- |
| SKL-001 | `div.app-shell` (`main.ts`) | Root wrapper | Unchanged route mounting |
| SKL-002 | `header.site-header` → refactor `src/ui/shell.ts` | Utility bar → masthead → section nav → search row | `data-component="site-header"` |
| SKL-003 | `footer.site-footer` | Legal + simulation line | Update footer copy (see Exact copy) |
| SKL-004 | `ui/discovery-chat.ts` → rename mount `mountAskDailyAssistant` | FAB + panel | Keep analytics intents; new classes `ask-daily-*` |
| SKL-005 | `ui/account-support-chat.ts` | Account routes only | Style alignment only; behavior unchanged |
| SKL-006 | `ui/exposure-inspector.ts` | Fixed bottom-right stack | z-index below Ask the Daily when both open |
| SKL-007 | `#skip-main` skip link | First focusable in shell | New; targets `main.page-main` |

### Home `#/`

| Component ID | Description | Parent |
| --- | --- | --- |
| HOME-001 | `section.home-utility-bar` — date, newsletter CTA, account shortcut | `main.page-main` |
| HOME-002 | `section.home-lead-package` — 1 hero story (image slot 3:2) + headline/deck/kicker | main |
| HOME-003 | `div.home-secondary-leads` — 3 cards in row (≥768) / stack (390) | main |
| HOME-004 | `section.home-tabbed-feed` — tabs: Top Stories, Product Analytics, Experimentation, Podcasts | main |
| HOME-005 | `ul.home-feed-list` — 6–8 items per active tab | HOME-004 |
| HOME-006 | `section.home-topic-ribbon` — horizontal scroll chips → `#/topic/:slug` | main |
| HOME-007 | `section.home-podcast-spotlight` — podcast feature card + audio teaser | main |
| HOME-008 | `aside.home-rail` — ads + sponsored + latest | main |
| HOME-009 | `section.home-newsletter` | existing behavior | Retain simulation + events |
| HOME-010 | `section.retention-module` | Statsig copy variants | Unchanged triggers |
| HOME-011 | `section.home-sponsored-module` | Rail | **Sponsored editorial** module (see AD-004) |

### Article `#/article/:id`

| Component ID | Description |
| --- | --- |
| ART-001 | Sticky `div.reading-progress` |
| ART-002 | `header.article-masthead` — kicker, H1, deck, byline line, date, topic/author links, premium badge, save |
| ART-003 | `figure.article-hero` — reserved 16:9 box, `img`, `figcaption` credit |
| ART-004 | `div.article-body` — drop-cap first graf, `p`, `blockquote.pull-quote`, `figure.inline-figure` ×≥2 on features |
| ART-005 | `section.article-paywall-preview` | Visible when locked premium; preview paragraphs only |
| ART-006 | `section.narrated-block` | When `narrated: true` and allowed |
| ART-007 | `aside.article-rail` — MPU ad slot (≥768) |
| ART-008 | `section.recommendations` | “More for you” list |
| ART-009 | `section.article-end-signoff` — “End of article” rule + newsletter CTA |

### Ads (cross-surface)

| Component ID | Placement ID | Route(s) |
| --- | --- | --- |
| AD-001 | `home_leaderboard` | Home below utility bar, full width |
| AD-002 | `home_rail` | Home aside (existing) |
| AD-003 | `article_mpu` | Article rail / in-body after paragraph 4 on long features |
| AD-004 | `sponsored_editorial_home` | Home rail module linking to sponsored article |

### Account / commerce (preserve structure)

All existing form panels in `src/pages/account.ts`, `login.ts`, `register.ts`, `subscribe.ts`, `checkout.ts`, `checkout-confirmation.ts` — **re-skin only** (typography, spacing, buttons) without changing field names, validation, session keys, or event payloads.

---

## Story inventory (≥18)

All stories live in `src/data/articles.json` (or split `src/data/articles/*.json` merged at build if file size warrants). Each entry extends the current schema:

```ts
{
  id, headline, deck, body: string[], publishedAt, topic, author, authorName,
  wordCountBand: "short" | "feature",
  previewParagraphCount?: number,
  narrated?: boolean, podcast?: boolean, sponsored?: boolean, premium?: boolean,
  heroImage?: { src, alt, credit, aspectRatio: "16:9" | "3:2" | "4:3" },
  inlineFigures?: { afterParagraph: number, src, alt, credit }[],
  pullQuotes?: { afterParagraph: number, quote, attribution? }[],
  kicker?: string
}
```

**Word counts:** Builder must compute word count from `body` (+ pull quote text); `short` = 600–1,000 words; `feature` = 1,800–2,500 words. No lorem ipsum; topics stay fictional analytics/experimentation journalism.

| # | `id` | Type | Words | Topic | Flags |
| --- | --- | --- | --- | --- | --- |
| 1 | `daily-decisions` | feature | 2,100 | product-analytics | narrated |
| 2 | `retention-myths` | feature | 1,950 | experimentation | premium |
| 3 | `funnel-friction` | short | 820 | product-analytics | |
| 4 | `experiment-runtime` | short | 760 | experimentation | |
| 5 | `signal-weekly-podcast` | short | 680 | podcast | podcast |
| 6 | `partner-playbook-sponsored` | short | 740 | experimentation | sponsored |
| 7 | `cohort-compound-interest` | feature | 2,200 | product-analytics | |
| 8 | `replay-ethics-lab` | feature | 1,880 | experimentation | premium |
| 9 | `north-star-metrics-drift` | short | 900 | product-analytics | |
| 10 | `warehouse-latency-culture` | short | 650 | product-analytics | |
| 11 | `holdout-holiday` | short | 720 | experimentation | |
| 12 | `session-replay-masked` | short | 800 | product-analytics | |
| 13 | `paywall-timing-study` | feature | 2,050 | experimentation | premium |
| 14 | `newsletter-aperture` | short | 610 | product-analytics | |
| 15 | `guide-surveys-field-note` | short | 770 | experimentation | |
| 16 | `identity-graph-fiction` | feature | 2,400 | product-analytics | narrated |
| 17 | `win-back-cohort-diaries` | short | 690 | experimentation | |
| 18 | `vendor-stack-sponsored` | short | 720 | experimentation | sponsored |

**Six long features:** rows 1, 2, 7, 8, 13, 16 — each includes `heroImage`, ≥2 `inlineFigures`, ≥1 `pullQuotes`, `previewParagraphCount: 2` when `premium: true`.

**Featured rotation:** `getFeaturedArticle()` returns `cohort-compound-interest` after redesign (was `daily-decisions`); home lead package uses same ID.

---

## Exact copy

### Publication chrome

| Element | Text |
| --- | --- |
| Masthead link | `Amplitude Daily` |
| Masthead tagline | `Independent reporting on product analytics and experimentation` |
| Utility bar left | `Today’s edition · {locale date: weekday, month day, year}` |
| Utility bar newsletter | `Newsletter` → scroll/focus `#home-newsletter` |
| Utility bar account (anonymous) | `Log in` → `#/account/login` |
| Utility bar account (logged in) | `Account` → `#/account`; subscriber suffix ` · Subscriber` when `hasActiveSubscription()` |
| Section nav items | `Home`, `Product Analytics`, `Experimentation`, `Podcasts`, `Subscribe` |
| Footer | `© {year} Amplitude Daily · Fictional demo publication · Simulated accounts, payments, and advertising` |
| Simulation persona banner | Unchanged: `Persona: {displayName} ({activePersonaId}) · simulated session` |

### Home modules

| Element | Text |
| --- | --- |
| Lead kicker (feature) | `Cover story` |
| Tab labels | `Top Stories`, `Product Analytics`, `Experimentation`, `Podcasts` |
| Tab empty state | `No stories in this section yet.` |
| Topic ribbon heading | `Topics` |
| Podcast spotlight label | `Podcast` |
| Sponsored module heading | `Sponsored insight` |
| Sponsored module disclosure | `Paid post · Simulated sponsor` |
| Newsletter heading | `The Daily Briefing` |
| Newsletter subcopy | `Simulated newsletter signup — no email is sent.` |
| Newsletter email label | `Work email` |
| Newsletter placeholder | `you@company.com` |
| Newsletter submit | `Sign up` |
| Newsletter success | `Simulated signup — no email sent` |

### Article chrome

| Element | Text |
| --- | --- |
| Save (logged out) | `Save article` → redirects login (unchanged) |
| Save (logged in, unsaved) | `Save article` |
| Save (saved) | `Saved` |
| Premium badge locked | `Premium · preview` |
| Premium badge unlocked | `Premium · subscriber access` |
| Paywall message | Keep Statsig-driven `paywallMessage()` strings from `SUBSCRIPTION_MESSAGE_COPY` |
| Paywall CTAs | `Simulated login` · `Subscribe` |
| Preview fade label (screen reader) | `Article preview — subscribe for full text` |
| Pull quote cite prefix | `— ` |
| End signoff | `You’ve reached the end of this article.` |
| Recommendations heading | `More for you` |
| Listen label | `Listen to this article` |

### Ask the Daily (replaces Discovery chat labels)

| Element | Text |
| --- | --- |
| FAB | `Ask the Daily` |
| Panel title | `Ask the Daily` |
| Disclosure | `Scripted assistant for this demo — no live AI. Answers come from local FAQ rules.` |
| Input label (visually hidden) | `Ask a question` |
| Input placeholder | `What should I read about retention?` |
| Submit | `Ask` |
| Close control | `×` with `aria-label="Close Ask the Daily"` |
| Suggested prompt chips | `Search tips`, `Premium access`, `Newsletter signup`, `Sponsored content` |
| Empty submit error | `Type a question to continue.` |
| Fallback answer | Keep final `faq.json` fallback entry text |

### Ad campaigns (fictional)

| Campaign ID | Label line | Body (1 sentence) | CTA |
| --- | --- | --- | --- |
| `camp-metricsmart-display` | `Advertisement · Simulated` | `MetricSmart helps teams pipe warehouse metrics into experiment dashboards.` | `Learn more` (button, no navigation — toast `Simulated ad engagement`) |
| `camp-cohortly-video` | `Advertisement · Simulated` | `Cohortly retargets churning readers with holdout-safe journeys.` | `Watch demo` |
| `camp-pipeline-pros` | `Advertisement · Simulated` | `Pipeline Pros sponsors analytics engineering briefings.` | `View sponsor` |

Sponsored article remains `partner-playbook-sponsored`; add `vendor-stack-sponsored` for second sponsored short.

### Demo controls (account)

| Element | Text |
| --- | --- |
| `<summary>` | `Demo controls (simulated)` |
| Section intro | `Adjust demo time and reset local storage.` |
| Buttons | Unchanged: `Advance +7 days`, `Advance +30 days`, `Reset demo data` |

### Account / checkout simulation labels

Preserve all existing `simulation-label`, paywall, checkout, and toast strings from `main`; apply new typography only.

---

## Layout and visual values

### Design tokens (`src/styles/tokens.css`)

Add tokens (retain existing `--color-accent` etc. for links):

| Token | Value | Use |
| --- | --- | --- |
| `--color-paper` | `#faf9f7` | Page background |
| `--color-ink` | `#121212` | Primary text |
| `--color-ink-muted` | `#5a5a5a` | Decks, meta |
| `--color-rule` | `#d4d4d4` | Rules, borders |
| `--color-accent` | `#0059c1` | Keep (links, buttons) |
| `--color-sponsor-accent` | `#9a6700` | Sponsored borders |
| `--font-display` | `"Iowan Old Style", "Palatino Linotype", Georgia, serif` | Masthead, H1 |
| `--font-body-serif` | `Georgia, "Times New Roman", serif` | Long-form body |
| `--font-ui` | existing `--font-sans` | UI chrome |
| `--measure-article` | `42rem` (672px) | Body column (within 620–720px brief) |
| `--measure-wide` | `75rem` (1200px) | Home grid max |
| `--space-2xs` | `0.125rem` | Tight rules |
| `--space-section` | `3rem` | Section breaks |
| `--rule-thick` | `3px` | Masthead rule |

Set `html, body { background: var(--color-paper); color: var(--color-ink); }`.

### Header layout (1440px)

- Utility bar: height `36px`, padding `0 24px`, font `0.75rem`, border-bottom `1px solid var(--color-rule)`.
- Masthead: padding `24px 24px 16px`, center-aligned brand `2.25rem` display, rule `3px solid var(--color-ink)` below.
- Section nav: horizontal list, gap `24px`, `font-size: 0.875rem`, `font-weight: 600`, sticky `top: 0`, background `var(--color-paper)`, `z-index: 10`, padding `12px 24px`, border-bottom `1px solid var(--color-rule)`.
- Search row: within sticky nav right cluster; input `min-width: 16rem`.

### Home grid (1440px)

- `max-width: var(--measure-wide)`; margin `0 auto`; padding `32px 24px`.
- Lead package: grid `1.2fr 1fr`, gap `32px`; hero image `aspect-ratio: 3/2`, `object-fit: cover`, min-height `320px` reserved.
- Secondary leads: 3-column grid, gap `20px`.
- Tabbed feed: full width below leads; tab list `border-bottom: 2px solid var(--color-rule)`; active tab `border-bottom: 3px solid var(--color-ink)`.
- Rail: `width: 300px` fixed in `grid-template-columns: minmax(0, 1fr) 300px`.

### Home grid (768px)

- Single column; lead image full width; secondary leads `grid-template-columns: repeat(2, 1fr)`; rail follows main column (ads still reserved height `250px` leaderboard).

### Home grid (390px)

- Single column stack; section nav horizontal scroll `overflow-x: auto`; tap targets min `44px`; FAB `Ask the Daily` inset `16px` from edges.

### Article layout

- Masthead max-width `48rem`; body `max-width: var(--measure-article)`; rail at ≥768: `position: sticky; top: 80px`.
- Hero: `margin: 24px 0`, `border-radius: 0` (square crop), caption `font-size: 0.8125rem`, color `--color-ink-muted`.
- Drop cap: first letter `font-size: 3.5rem`, `float: left`, `line-height: 0.85`, `padding-right: 8px`, `font-family: var(--font-display)`.
- Pull quote: `border-left: 4px solid var(--color-ink)`, `padding-left: 20px`, `margin: 32px 0`, `font-size: 1.25rem`, serif italic.
- Inline figure: `margin: 32px 0`, image max-width `100%`, reserved min-height `240px` with `background: var(--color-rule)` until loaded (CLS guard).
- Preview fade: `max-height` on preview container + `linear-gradient` mask bottom `80px`.

### Ad slot dimensions (reserved)

| Slot | Min height | Min width |
| --- | --- | --- |
| Leaderboard | `90px` | `100%` (728×90 proportional) |
| Rail | `250px` | `300px` |
| MPU | `250px` | `300px` |

### Motion

- Reading progress: honor `@media (prefers-reduced-motion: reduce)` — set `transition: none` on progress bar fill.

---

## States and interactions

### Account-state variants (unchanged logic)

| State | Home | Article premium | Paywall | Subscribe CTA |
| --- | --- | --- | --- | --- |
| anonymous | Full top stories | Preview only | login + subscribe | visible |
| registered | Same | Preview or full per paywall rules | same | visible |
| trial / paid | Subscriber utility suffix | Full body | hidden | hidden in nav emphasis |
| canceled / expired | Same as registered | Preview | message + subscribe | visible |

### Home tabbed feed

- **Trigger:** click tab button `role="tab"` / key Left/Right.
- **Result:** `aria-selected` toggle; filter list by topic or `podcast: true`.
- **Persistence:** none (session UI state only in memory).
- **Default tab:** `Top Stories` (all non-sponsored sorted by `publishedAt` desc).

### Ask the Daily

- **Open:** FAB click or `Alt+D` when not in input; focus moves to input.
- **Close:** Close button, `Escape`, FAB toggle; focus returns to FAB.
- **Chips:** fill input with chip text; do not auto-submit.
- **Submit:** same FAQ matching as today; fires `Chat Request Submitted`, `Chat Response Delivered`.
- **Focus trap:** while open, Tab cycles within panel (input, submit, close, chips).

### Ads

- **Viewability:** existing `IntersectionObserver` threshold `0.5` for 1s → `Advertisement Viewable` (unchanged event).
- **Engagement CTA:** click → `showToast('Simulated ad engagement')` + optional `Ad Revenue Recorded` if already wired on `main`; do not navigate away.

### Paywall / preview

- **Trigger:** `!canAccessArticle(id)` on premium.
- **Body:** render `body.slice(0, previewParagraphCount)` inside preview section; paywall message below fade.
- **Statsig scroll gate:** unchanged `premium_paywall_after_scroll` behavior.
- **Events:** `Paywall Presented` unchanged; **no** `Read Article` milestones above preview depth cap (max 25% if preview shorter than 25% of full text length — use `min(25, floor(previewChars/totalChars*100))` as cap).

### Demo controls

- `<details class="demo-controls">` default `open` attribute **omitted** (closed).
- Expanding does not navigate; buttons behave as on `main`.

### Reading progress + milestones

- **Progress bar:** unchanged localStorage via `attachReadingProgress`.
- **Milestones:** see Analytics section.

### All hash links

Continue `navigateToHash` + `data-internal-link` pattern; no full page reload.

---

## Accessibility

| Requirement | Implementation |
| --- | --- |
| Skip link | SKL-007 visible on focus, top-left |
| Heading order | One `h1` per route (masthead brand is `p` with class on home; article `h1` is headline) |
| Landmarks | `header`, `nav` (labeled), `main`, `footer`, `aside` for rails |
| Tab order (home) | Skip → utility links → section nav → search → main lead link → tabs → feed links |
| Tab order (article) | Skip → save → masthead links → body → audio controls → recommendations |
| Focus visible | `outline: 2px solid var(--color-accent); outline-offset: 2px` on interactive elements |
| Contrast | Body text `#121212` on `#faf9f7` ≥ 12:1; muted `#5a5a5a` ≥ 4.5:1 on paper |
| Ask the Daily | `role="dialog"`, `aria-modal="false"`, `aria-labelledby` on title |
| Images | All editorial images require non-empty `alt`; decorative sponsor logos `alt=""` if redundant with adjacent text |
| Reduced motion | Disable progress transition; no auto-playing video in ads |
| 1440 / 768 / 390 | No horizontal scroll on body; nav scroll region has `aria-label="Sections"` |

---

## Analytics and reading milestones

**Preserve event name:** `Read Article` (and all other names in `custom-events.yml`).

### Change request for `custom-events.yml` (Planner/BUILDER coordination)

Update `Read Article.properties.content_progress_percent.enum` from `[10, 25, 50, 75, 90, 100]` to **`[25, 50, 75, 90, 100]`** only.

Update `fires_at` text to:

> ArticleReader, when the reader reaches each content milestone: 25, 50, 75, 90, or 100 percent of **full article body** (not paywall preview). Fire once per milestone per article per session. Measure article body element `[data-article-body]` only; 100 means end of body visible. On restored position, baseline without firing skipped milestones until reader interaction. Include **`active_reading_seconds`** accumulated while tab is visible and reader interacted in the last 30s.

### Implementation rules (`src/lib/analytics/article-reading.ts`)

| Rule | Detail |
| --- | --- |
| Milestones array | `[25, 50, 75, 90, 100]` |
| Interaction gate | Same as today (wheel/key/touch) before firing |
| Restore baseline | Mark milestones ≤ restored percent as fired without emit |
| Preview mode | When `!allowed` and premium preview showing, **do not** attach milestone tracker |
| Active time | Start timer on first interaction; pause on `visibilitychange` hidden or `blur`; resume on visible+interaction; increment each second on `requestAnimationFrame` or 1s interval; send cumulative seconds on each milestone fire |
| Property | `active_reading_seconds`: number, one decimal, monotonic non-decreasing across milestones |
| Optional clarity property | Add `reading_surface: "full" \| "preview"` only if Planner approves enum extension; default omit to preserve schema |

### Preservation checklist

Do not rename: `Paywall Presented`, `Advertisement Viewable`, `Ad Revenue Recorded`, checkout/subscription/chat events, or Statsig exposure logging.

---

## Acceptance criteria

Mapped to editorial phase checks **P2E-D1–D4** (new phase definition on `editorial-redesign`).

| ID | Steps | Expected result | Evidence |
| --- | --- | --- | --- |
| **P2E-D1** | On `editorial-redesign` at assigned commit: run `pnpm typecheck` | Exit code 0 | CI log / PHASE_LOG |
| **P2E-D2** | Run `pnpm build` | Exit code 0; `dist/` includes ≥18 article IDs in bundle | Build log; grep `articles.json` ids in `dist` |
| **P2E-D3** | Production preview smoke: (1) open `#/` — utility bar, masthead, section nav, tabbed feed, leaderboard ad slot visible; (2) open `#/article/cohort-compound-interest` — hero, drop cap, 2 inline figures, pull quote; (3) login `registered-reader`, complete intro offer checkout, confirm premium unlock on `retention-myths` | All three journeys succeed without console errors | Screenshot or PHASE_LOG smoke note |
| **P2E-D4** | At viewports 1440, 768, 390: keyboard traverse home → article → Ask the Daily open/close; verify skip link, tab order, contrast sample, reduced-motion progress bar; home layout matches breakpoint rules in this spec | PASS on all three widths | `docs/evidence/p2e-d4/` screenshots + short checklist |
| P2E-A01 | Corpus count | ≥18 distinct `id` values in articles data | JSON inspect |
| P2E-A02 | Feature length | Six feature IDs each 1,800–2,500 words | word-count script output in evidence |
| P2E-A03 | UC regression | UC-1…UC-10 from `BUILDER_HANDOFF.md` still pass on editorial branch (manual or Phase 5 subset) | PHASE_LOG matrix |
| P2E-A04 | Amplitude | `Read Article` fires at 25/50/75/90/100 only with `active_reading_seconds` > 0 after 5s scroll on feature article | Inspector screenshot |
| P2E-A05 | Statsig | Forced `subscription_message_copy: urgency` still swaps paywall copy | Exposure inspector |
| P2E-A06 | Ads | Three campaigns render in reserved slots; `Advertisement Viewable` on home leaderboard | Inspector event |
| P2E-A07 | Sponsored | Sponsored module + 2 sponsored articles labeled | Visual + DOM |
| P2E-A08 | Ask the Daily | FAB label, chips, disclosure, keyboard trap | Manual a11y check |
| P2E-A09 | Demo controls | Account `<details>` closed by default | DOM |
| P2E-A10 | Pages base | Assets load under `/AmpliYorker/` | Network tab |

---

## Blocked decisions

| Item | Status |
| --- | --- |
| — | None. Scope authorized via editorial brief and coordinator assignment. |

---

## Builder file touch list (informational)

| Area | Files (expected) |
| --- | --- |
| Data | `src/data/articles.json`, new images under `public/images/editorial/`, optional `src/data/ads.json` |
| Pages | `src/pages/home.ts`, `article.ts`, topic/search/author (list styling) |
| UI | `src/ui/shell.ts`, `discovery-chat.ts` (Ask the Daily), `tokens.css` + new `editorial.css` if split |
| Lib | `src/lib/articles.ts` (schema), `src/lib/analytics/article-reading.ts`, `custom-events.yml` enum |
| Analytics | No new event names |

---

*UX agent `P2-UX-EDITORIAL-001` — specification **READY** for Builder handoff on branch `editorial-redesign`.*