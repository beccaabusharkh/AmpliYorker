# Phase 2G — Subscribe, account, header polish — UX specification

## Status and phase

| Field | Value |
| --- | --- |
| **Status** | **READY** |
| **Phase ID** | `2G` (subscribe/account/header polish; assignment **`P2G-UX-POLISH-001`**) |
| **Audited revision** | Git `main` post–Atlantic merge; live https://beccaabusharkh.github.io/AmpliYorker/ (2026-11-18) |
| **Implementation assignment** | **`P2G-BUILD-POLISH-001`** (same Builder `bc-e05e21fe-01c2-5e95-981a-bb0d5f5193b2`; commit yes; **no push** unless Planner authorizes) |
| **Objective** | Fix **subscribe** plan grid width, reshape **account** into a publication-style dashboard, **de-simulate** reader-facing chrome copy on subscribe/account/header/paywall entry points, polish **sponsored offer** rail module, **center** section navigation with balanced **header actions + search**, and reunify **wordmark + edition line** — while preserving hash routes, session/checkout journeys, plan IDs, Amplitude/Statsig contracts, demo controls, and simulated backend behavior. |
| **Viewports (verification)** | `1440×1000`, `768×1024`, `390×844` |
| **Reviewed routes** | `#/subscribe`, `#/account`, `#/account/login`, `#/account/register` (regression), `#/` (header + sponsored module) |
| **Exclusions** | UX agent code/git; new vendor SDKs; new experiments/gates; removal of Exposure Inspector; footer legal simulation line; ad disclosure strings; Ask the Daily scripted disclaimer; `data-*` analytics hooks |
| **Supporting brief** | `/cursor/stores/self/docs/subscribe-account-polish-brief.md` |
| **Inherits (no regressions)** | Atlantic white canvas, compact masthead, promo band presence, three-plan subscribe data, `account-surface` login pattern from `docs/2/ATLANTIC-SPEC.md` |

---

## Audit evidence

| Source | Method | Result |
| --- | --- | --- |
| Live `#/subscribe` (signed in) | Playwright @ 1440 | `.account-surface--wide` computed width **448px** (~28rem); `grid-template-columns` **~156px × 3** — plan cards crushed. Screenshot: `/cursor/stores/self/media/polish-fix/subscribe-signed-in-1440.png` |
| Live `#/account` (signed in) | Playwright @ 1440 | **6** stacked `.form-panel` sections, **no** `.account-surface`; max panel width **448px**; **3+** `.simulation-label` in chrome. Screenshot: `/cursor/stores/self/media/polish-fix/account-signed-in-1440.png` |
| Live `#/` header | Playwright @ 1440 | `.home-section-nav` `justify-content: space-between`; nav list **not** centered; promo copy still says **“simulated plans”**. Screenshot: `/cursor/stores/self/media/polish-fix/header-chrome-1440.png` |
| Repo `main` | Static read | `subscribe.ts` smoke-persona paragraph; `account.ts` verbose simulated headings; CSS `.account-page > .account-surface { max-width: 28rem }` overrides `.account-surface--wide` (specificity bug) |
| User problem screenshots | Glob Project store + workspace | **Not found** — baseline = live captures under `/cursor/stores/self/media/polish-fix/` (index: `/cursor/stores/self/docs/evidence/polish-fix/audit-index.md`) |
| Metrics | `browser-audit.json` | `/cursor/stores/self/media/polish-fix/browser-audit.json` |

---

## Requirement map (user sections 1–7)

| § | Theme | Builder outcome |
| --- | --- | --- |
| **1** | Subscribe layout | Wide plan grid (56rem), readable three-column cards, editorial page title |
| **2** | Account dashboard | Single wide dashboard surface + sections; collapse advanced/demo blocks |
| **3** | De-simulate copy | Reader-facing strings on subscribe/account/header/login/register/paywall **without** “simulated” where listed below; keep footer, ads, demo controls |
| **4** | Sponsored offer | Featured sponsored offer card in home rail with thumb + CTA |
| **5** | Header actions / search | Utility actions aligned; search field sized and aligned to nav row |
| **6** | Centered nav | Section links centered as a group; search in right column |
| **7** | Wordmark + edition line | Edition date centered under wordmark; utility row simplified |

---

## Findings (baseline → target)

| ID | Area | Current | Impact | Target |
| --- | --- | --- | --- | --- |
| POL-01 | `editorial.css` | `.account-page > .account-surface` forces **28rem** on all surfaces | Subscribe grid **~448px** wide | `.account-surface--wide` wins at **56rem**; subscribe route uses wide surface only |
| POL-02 | `#/subscribe` | Title “Simulated subscription plans”; smoke persona callout | Reads as QA page | Editorial title + deck; smoke hint **removed** from page (retain in demo controls doc only) |
| POL-03 | `#/subscribe` logged out | “Simulated plans — log in first…” | Harsh demo tone | Gate card matching login surface; CTA **Log in** / **Create account** |
| POL-04 | `#/account` | Six disconnected `form-panel` stacks | No publication account UX | **`account-dashboard`** grid inside one `account-surface--wide` |
| POL-05 | Copy | “(simulated)” on status, buttons, billing headers | Breaks Atlantic polish | Replace per copy table §3; keep `demo-controls` + footer |
| POL-06 | Home rail | Sponsored module = heading + text list only | Weak sponsor offer | **Offer card** with hero thumb, deck, primary CTA |
| POL-07 | Header nav | `justify-content: space-between` | Nav links hug left | **3-column grid**: spacer · centered nav · search |
| POL-08 | Promo band | “simulated plans from $12/month” | Reader-facing simulation | Publication promo copy (no “simulated”) |
| POL-09 | Utility + masthead | Edition only in utility left | Wordmark block disconnected from date | **Edition subline** under wordmark; utility holds actions only |
| POL-10 | Login/register | Titles “Simulated login/registration” | Inconsistent with polish | Align titles/CTAs to de-simulated table |

---

## Layout and tokens

### Subscribe (`#/subscribe`)

| Property | Value |
| --- | --- |
| Main | `.page-main.account-page` |
| Surface | `.account-surface.account-surface--wide` — **max-width `56rem`**, margin `48px auto`, padding `0 20px` |
| Card shell | Border `1px solid var(--color-rule)`; padding `32px 28px` |
| Plan grid | `.plan-grid.plan-grid--three` — `gap: 20px` |
| ≥769px | `grid-template-columns: repeat(3, minmax(0, 1fr))`; each card **≥240px** content width |
| ≤768px | Single column; **`annual` (recommended) first** in DOM order |
| Vertical rhythm | Title + one-line deck + grid; **no** persona smoke block in main |

**CSS fix (required):**

```css
.account-page > .account-surface--wide {
  max-width: 56rem;
}
```

Or equivalent specificity so wide surface is never capped at 28rem.

### Account dashboard (`#/account`)

| Region | Class / element | Layout |
| --- | --- | --- |
| Shell | `.account-dashboard.account-surface.account-surface--wide` | One outer card @ 56rem |
| Header row | `.account-dashboard__header` | `h1` display name + subscription pill |
| Summary | `.account-dashboard__summary` | `dl.status-dl` in **2-column CSS grid** @ ≥769px |
| Primary actions | `nav.account-actions` | Horizontal link row; ink button for Subscribe when inactive |
| Billing | `.account-dashboard__billing` | Existing `data-billing-form` fields |
| Plan change | `.account-dashboard__plan` | `data-plan-form` |
| Cancel | `.account-dashboard__cancel` | `data-cancel-form` inside `<details>` default **closed** |
| Device export | `.account-dashboard__devices` | Buttons inside `<details>` default **closed** |
| Retention | `.retention-module` | Unchanged triggers/copy variants from Statsig |
| Demo | `details.demo-controls` | Unchanged; **only** place for “simulated” advanced hints |

Logged-out gate: single `.account-surface` (28rem) with de-simulated copy; links to login/register.

| Breakpoint | Dashboard grid |
| --- | --- |
| ≥769px | Summary 2-col; billing + plan side-by-side in `grid-template-columns: 1fr 1fr` where width allows |
| ≤768px | Stack all sections; actions full-width buttons |
| 390px | Padding `16px`; touch targets ≥44px |

### Header chrome (all routes)

| Element | Target |
| --- | --- |
| Utility `.site-utility-bar` | Flex; **right cluster only**: `Newsletter`, `Log in` / `Account` · Subscriber |
| Edition | **Remove** date from utility left; add `.site-masthead-edition` below wordmark |
| Masthead `.site-masthead` | Centered; unchanged size tokens from Atlantic |
| Tagline `.home-masthead-tagline` | Hidden ≥769px; @ mobile show **either** tagline **or** edition subline (not both) |
| Nav `.home-section-nav` | `display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px` |
| Nav list | `justify-content: center` in center column |
| Search `.section-nav-search` | Right column; `justify-self: end`; input `min-width: 14rem` @ 1440; `height: 40px` |
| Promo `.site-promo-band` | De-simulated copy (below) |

### Sponsored offer (home rail)

| Property | Value |
| --- | --- |
| Container | Keep `section.home-sponsored-module[data-sponsored-module]` |
| Structure | Heading + disclosure + **`.sponsored-offer-card`** (featured) + compact list for second story |
| Featured card | Hero thumb 16:9 **max-height 120px** from `sponsoredStories[0].heroImage.src` |
| CTA | `a.sponsored-offer-card__cta` → `#/article/{id}`; label **Read the partner briefing** |
| Secondary | Optional text link for second sponsored story (no thumb required) |
| Disclosure | **Keep** `Paid post · Simulated sponsor` |

---

## Component and file map

| File | Responsibility |
| --- | --- |
| `src/styles/editorial.css` | Wide surface specificity; `account-dashboard` grid; centered nav grid; masthead edition; sponsored offer card; header search sizing |
| `src/styles/tokens.css` | Optional `--measure-account-wide: 56rem` if not already present |
| `src/pages/subscribe.ts` | De-simulated copy; remove smoke persona paragraph; logged-out gate |
| `src/pages/account.ts` | Dashboard markup refactor; `<details>` wrappers; de-simulated strings; **preserve** all `data-*` forms and handlers |
| `src/ui/shell.ts` | Edition subline markup; promo copy; utility row (no left date) |
| `src/pages/home.ts` | Sponsored offer card markup + thumb |
| `src/lib/subscribe-ui.ts` | De-simulated feature bullets (remove “simulated” adjectives in reader bullets) |
| `src/data/plans.json` | `introOfferLabel` strings without “(simulated)” suffix (optional same release) |
| `src/pages/login.ts` | De-simulated titles/buttons per table |
| `src/pages/register.ts` | De-simulated titles/buttons per table |

---

## §3 — Copy replacements

**Rules**

- Replace **reader-facing** strings below.
- **Do not change:** footer simulation line; `Advertisement · Simulated`; newsletter simulation copy; Ask the Daily disclaimer; `details.demo-controls` summary and body; persona banner when active; toast internals unless user-visible text listed; **event property values** or `plan_id` strings.

| Location | Selector / context | Current (representative) | Target |
| --- | --- | --- | --- |
| Promo band | `.site-promo-band__copy` | `…simulated plans from $12/month.` | `Subscribe for full access to Amplitude Daily — plans from $12/month.` |
| Subscribe logged out | `subscribe.ts` gate | `Simulated plans — log in first…` | `Choose a subscription after you sign in.` |
| Subscribe logged out | link | `Simulated login` | `Log in` |
| Subscribe logged in | `h1` | `Simulated subscription plans` | `Choose your subscription` |
| Subscribe logged in | `.simulation-label` paragraph | Smoke persona / code block | **Remove** (no replacement) |
| Subscribe | intro buttons | `Choose introductory offer` | `Start with introductory offer` |
| Subscribe | secondary buttons | `Choose standard price` | `Continue at standard price` |
| Account logged out | body | `Simulated account hub…` | `Sign in to manage your subscription and saved stories.` |
| Account logged out | links | `Simulated login` | `Log in` |
| Account logged in | `h1` | `Account hub` | `Your account` |
| Account logged in | `.simulation-label` | `Simulated account management — …` | `Signed in as {displayName}.` (no “simulated”) |
| Account status | `dd` canceled | `Canceled (simulated)` | `Canceled` |
| Account status | `dd` expired | `Expired (simulated)` | `Expired` |
| Account | `dt` renewal | `Renewal (simulated)` | `Renewal date` |
| Account nav | button | `Log out (simulated)` | `Log out` |
| Account billing | `h2` | `Simulated billing profile` | `Billing profile` |
| Account billing | labels | `(preset)` suffix | Remove “(preset)” from visible labels |
| Account billing | submit | `Save billing (simulated)` | `Save billing` |
| Account plan | `h2` / submit | `Change plan (simulated)` / `Update plan (simulated)` | `Change plan` / `Update plan` |
| Account cancel | `h2` | `Cancel subscription (simulated)` | `Cancel subscription` |
| Account cancel | footer | `Simulated cancellation recorded` | `Cancellation recorded` |
| Account devices | `h2` | `Simulated device switch` | `Device & export` |
| Retention | link | `View simulated plans` | `View subscription options` |
| Login | `h1` / submit | `Simulated login` / `Log in (simulated)` | `Log in` / `Continue` |
| Login | `.simulation-label` | Preset credentials… | `Use demo credentials to explore subscriber journeys.` |
| Login | register link | `Simulated registration` | `Create account` |
| Register | `h1` / submit | `Simulated registration` / `Create simulated account` | `Create account` / `Create account` |
| Register | options | `(simulated registration)` in option text | Remove parenthetical |
| Paywall | CTA (if touched) | `Simulated login` | `Log in` |
| Plan features | `subscribe-ui.ts` bullets | “simulated” adjectives | Neutral product copy (e.g. “Unlimited article access”) |
| `plans.json` | `introOfferLabel` | `…(simulated)` | Drop “(simulated)” only |

---

## §4 — Sponsored block specification

**DOM (append inside existing module):**

```html
<section class="home-sponsored-module sponsored-card" data-sponsored-module>
  <h3>Sponsored insight</h3>
  <p class="sponsored-disclosure">Paid post · Simulated sponsor</p>
  <article class="sponsored-offer-card" data-sponsored-offer>
  <a class="sponsored-offer-card__thumb" href="#/article/…">…img…</a>
  <h4 class="sponsored-offer-card__title">…</h4>
  <p class="sponsored-offer-card__deck">…</p>
  <a class="sponsored-offer-card__cta" href="#/article/…">Read the partner briefing</a>
  </article>
  <!-- existing second story compact link may remain -->
</section>
```

| Rule | Detail |
| --- | --- |
| Featured story | First entry in `sponsoredStories` (`partner-playbook-sponsored` expected) |
| Image | `<img loading="lazy">` from article `heroImage`; alt from article |
| Analytics | **No new events**; navigation uses existing internal links |
| Styling | Border `1px solid var(--color-rule)`; padding `12px`; CTA ink button or text link ≥44px tap target |

---

## Screen compositions (ASCII)

### Subscribe desktop (1440) — target

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [header chrome per §5–7]                                                    │
├────────────────────────────────────────────────────────────────────────────┤
│                    ┌──────────────────────────────────────┐                │
│                    │ Choose your subscription             │                │
│                    │ Unlimited access to every story…     │                │
│                    │  ┌─────────┐ ┌─────────┐ ┌─────────┐ │                │
│                    │  │ Annual  │ │ Monthly │ │ Premium │ │                │
│                    │  │ (rec.)  │ │         │ │         │ │                │
│                    │  └─────────┘ └─────────┘ └─────────┘ │                │
│                    └──────────────────────────────────────┘                │
│                              max-width 56rem                                │
└────────────────────────────────────────────────────────────────────────────┘
```

### Account dashboard desktop — target

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Your account · {name}                          [ Subscribe ] [ Log out ] │ │
│ │ ┌ Subscription ──────┬ Renewal / device ─────┐                          │ │
│ │ │ status · plan      │ saved · writers       │                          │ │
│ │ └────────────────────┴───────────────────────┘                          │ │
│ │ [ retention module if active ]                                          │ │
│ │ ┌ Billing profile ───┬ Change plan ─────────┐                          │ │
│ │ │ data-billing-form  │ data-plan-form        │                          │ │
│ │ └────────────────────┴───────────────────────┘                          │ │
│ │ ▸ Cancel subscription (details, closed)                                  │ │
│ │ ▸ Device & export (details, closed)                                      │ │
│ │ ▸ Demo controls (simulated) (existing)                                   │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

### Header nav (1440) — target

```
utility:                          Newsletter    Log in
────────────────────────────────────────────────────────
              AMPLITUDE DAILY
        Wednesday, November 18, 2026 · Today’s edition
────────────────────────────────────────────────────────
[ promo band ]
────────────────────────────────────────────────────────
    Home  Product Analytics … Subscribe          [ Search___ ] Submit
    └──────── centered ────────┘                 └─ right ───┘
```

---

## Analytics and selector preservation

### Must preserve (no rename, no removal)

| Selector / attribute | Location |
| --- | --- |
| `data-select-plan`, `data-intro` | Subscribe buttons |
| `data-login-link`, `data-register-link`, `data-sub-link`, `data-premium-link` | Account/subscribe gates |
| `data-billing-form`, `data-plan-form`, `data-cancel-form` | Account forms |
| `data-export-snapshot`, `data-apply-device`, `data-advance-time`, `data-reset-demo` | Account demo tools |
| `data-account-status` | Subscription status cell |
| `details.demo-controls` | Collapsible demo block |
| `data-newsletter-link`, `data-utility-account`, `data-section-link`, `data-header-search` | Header |
| `data-subscribe-promo` | Promo band |
| `data-sponsored-module`, `data-sponsored-offer` (new, additive) | Home rail |
| `data-login-form`, `data-register-form` | Auth |
| Field `name`s on all forms | Unchanged |

### Event names

Unchanged per `custom-events.yml` (`Sign In Completed`, `Subscription Added To Cart`, `Billing Details Updated`, etc.).

---

## Accessibility

| Requirement | Spec |
| --- | --- |
| Subscribe/account `h1` | One **content** `h1` per route inside `main`; shell wordmark may remain `h1` on home only — on subscribe/account use **`p.site-masthead`** or `div` with `aria-label` for brand to avoid duplicate `h1` (Builder choice documented in PR) |
| Dashboard | `<details>` summaries are focusable; cancel/device closed by default |
| Promo / CTAs | ≥44px min touch target |
| Sponsored thumb | Non-empty `alt` from article hero |
| Contrast | Unchanged Atlantic white-surface rules |

---

## Acceptance criteria

| ID | Steps | Expected result | Evidence |
| --- | --- | --- | --- |
| **P2G-POL-A01** | `#/subscribe` logged in @ 1440 | `.account-surface--wide` width **≥880px** (56rem − padding) | Bounding rect + screenshot |
| **P2G-POL-A02** | Same | Plan grid three columns; each card width **≥240px** | DevTools |
| **P2G-POL-A03** | Subscribe page text | No “Simulated subscription”; no smoke persona paragraph | DOM text |
| **P2G-POL-A04** | `#/account` logged in @ 1440 | Single `.account-surface--wide` dashboard; **≤2** top-level sections outside `details` | Screenshot |
| **P2G-POL-A05** | Account copy | No reader-visible “simulated” except `demo-controls` + persona banner | DOM |
| **P2G-POL-A06** | Cancel + device blocks | Wrapped in `<details>`, **closed** by default | DOM |
| **P2G-POL-A07** | `#/` rail | `.sponsored-offer-card` with image + CTA; `data-sponsored-module` present | DOM |
| **P2G-POL-A08** | Promo band | Copy matches table; no “simulated plans” | Text |
| **P2G-POL-A09** | Header @ 1440 | Section nav links visually **centered**; search right-aligned | Screenshot |
| **P2G-POL-A10** | Masthead | `.site-masthead-edition` visible under wordmark; utility **without** left date | DOM |
| **P2G-POL-A11** | `#/subscribe` logged out | Editorial gate; CTAs `Log in` / register path | Screenshot |
| **P2G-POL-A12** | Select plan → checkout | `data-select-plan` / intro flag still work; events fire | Journey |
| **P2G-POL-A13** | `#/account/login` | De-simulated title; `data-login-form` intact | DOM |
| **P2G-POL-A14** | Demo controls | Still collapsible; summary still contains “simulated” | DOM |
| **P2G-POL-A15** | Footer / ads | Footer simulation line + `Advertisement · Simulated` unchanged | DOM |
| **P2G-POL-A16** | `pnpm typecheck` && `pnpm build` | Exit 0 | CI |
| **P2G-POL-A17** | Compare subscribe screenshot | Card layout wider than `subscribe-signed-in-1440.png` baseline | Before/after in `docs/evidence/polish-fix/` |
| **P2G-POL-A18** | User reference screenshots | Documented **absent**; live baseline used | This spec § Audit |

### Verification evidence target

Builder/verify: `docs/evidence/polish-fix/` — after screenshots @ 1440, 768, 390 for `#/subscribe`, `#/account`, header; before = `/cursor/stores/self/media/polish-fix/*`.

---

## Blocked decisions

| Item | Resolution |
| --- | --- |
| User problem screenshots | **Not provided** — live captures are baseline |
| Duplicate `h1` (shell vs page) | Builder picks masthead downgrade on account routes or visually hidden brand; must satisfy A11y row above |

---

## Planner handoff

- **Spec path:** `/cursor/stores/self/docs/2/POLISH-SPEC.md`
- **Status:** **READY**
- **Assignment:** `P2G-BUILD-POLISH-001` after dispatch
- **Baseline evidence:** `/cursor/stores/self/media/polish-fix/`, index `/cursor/stores/self/docs/evidence/polish-fix/audit-index.md`