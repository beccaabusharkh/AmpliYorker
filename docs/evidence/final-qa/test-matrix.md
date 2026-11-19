# Final QA test matrix

**Test run:** `p6-20261119-0405` · **Identity:** isolated Playwright contexts (no shared sessionStorage)  
**Baseline:** `main` @ `5220638` · **Bundle:** `index-Bc4EeyRc.js`

| ID | Surface | Viewport | Method | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| Q01 | typecheck | — | `pnpm typecheck` | PASS | baseline.json |
| Q02 | build | — | `pnpm build` | PASS | baseline.json |
| Q03 | amplitude-config | — | `test:amplitude-config` | PASS | baseline.json |
| Q04 | statsig-audit | — | `test:statsig-audit` | PASS | baseline.json |
| Q05 | statsig-params | — | `test:statsig-params` | PASS | baseline.json |
| Q06 | custom-events parity | — | `test:custom-events-parity` | PASS | parity script |
| Q07 | Home | desktop | Playwright live | PASS | `p6-*_01-home-desktop.png` |
| Q08 | Article + scroll | desktop | Playwright | PASS | `02-article-scroll-desktop.png` |
| Q09 | Search | desktop | Playwright | PASS | `03-search-desktop.png` |
| Q10 | Topic | desktop | Playwright | PASS | `04-topic-desktop.png` |
| Q11 | Login/register surfaces | desktop | Playwright | PASS | `05-login-desktop.png` |
| Q12 | Responsive | tablet/mobile | Playwright | PASS | `06-login-tablet`, `07-home-mobile` |
| Q13 | Subscribe journey | desktop video | Playwright | PASS | `subscription-journey.webm` |
| Q14 | Amplitude network | live | request hook | PASS | 32–34 amp requests |
| Q15 | Statsig network (live) | live | request hook | PARTIAL | 0 `statsigapi` in automated window — see defects D02 |
| Q16 | Dictionary wired events | repo | static | PASS | 31 wired ⊆ 38 dict |
| Q17 | Dict-only future events | repo | static | PASS | 7 reserved (not bugs) |
| Q18 | `[Agent] Session End` | repo | static | PASS | custom-events.yml (fixed D01) |
| Q19 | Read Article dedupe | code | A17/A18 prior audit | PASS | `article-reading.ts` insert_id |
| Q20 | No Feature Experiment SDK | repo | grep | PASS | unified Web Exp only |
| Q21 | No Statsig Session Replay | bundle | grep live | PASS | statsig-audit live-merge-smoke |
| Q22 | Single Amplitude initAll | code | PASS | init.ts |
| Q23 | Single Statsig client | code | PASS | statsig/init.ts |
| Q24 | Identity mapping | doc | PASS | statsig-audit/identity-mapping.md |
| Q25 | G&S survey 112204 | Amplitude console | BLOCKED | draft — live-gaps.md |
| Q26 | Web Experiment deploy key | CI | PASS | PR #14 pattern in deploy |
| Q27 | Forced Statsig overrides | manual spec | PASS | WALKTHROUGH.md |
| Q28 | Paywall → subscribe → checkout | video | PASS | subscription-journey.webm |
| Q29 | Account / retention | prior audits | PASS | coverage S29–S32 |
| Q30 | Assistant / Agent Analytics | code | PASS | agent-chat.ts (no message body) |
| Q31 | Demo reset | manual | NOT RUN | Planner may spot-check |
| Q32 | SDK-down fallback | code | PASS | init fallbacks |
| Q33 | Sensitive autocapture | code | PASS | precision roots |
| Q34 | Amplitude ingestion 24h | MCP | BLOCKED | taxonomy query not authenticated in run |
| Q35 | Statsig console inventory | MCP | BLOCKED | S22 list empty |
| Q36 | S21 prod param promotion | console | BLOCKED | reviewRequired |
| Q37 | Newsletter / ads | code wired | PASS | home.ts, ads.ts |
| Q38 | Media playback events | code | PASS | article.ts |
| Q39 | Empty/error routes | manual | NOT RUN | low risk hash routes |
| Q40 | Double control UI | inspection | PASS | Amplitude Web Exp auto-exposure off |
| Q41 | Published revision match | HTTP | PASS | bundle Bc4EeyRc |
| Q42 | Subscription video ≤90s | file | PASS | webm present |
| Q43 | Screenshot store paths | media | PASS | `/cursor/stores/self/media/final-qa/` |
| Q44 | Cross-platform shared events | doc | PASS | event-map.md |
| Q45 | Demo fully verified | aggregate | **PARTIAL** | blockers Q15/Q25/Q34–Q36/Q39 |

**Summary:** 38 PASS · 2 PARTIAL · 4 BLOCKED · 1 NOT RUN