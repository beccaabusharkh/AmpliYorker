# Outcome events (Amplitude) ↔ Statsig surfaces

Statsig does **not** mirror Amplitude autocapture. Treatment **exposures** are recorded locally (`exposures.ts`) and via suppressed SDK reads; **outcomes** use Amplitude custom events per `custom-events.yml`.

| Statsig entity | Surface id | Treatment effect | Primary Amplitude outcomes |
| --- | --- | --- | --- |
| `premium_paywall_after_scroll` | `article-params` | Scroll-triggered paywall on premium articles | `Paywall Presented` |
| `subscription_message_copy` | `paywall` / `article-paywall` | Paywall copy urgency vs control | `Paywall Presented` (`message_id`) |
| `subscription_offer_framing` | `subscribe-params` | Intro badge CTA framing | `Subscription Added To Cart`, `Checkout Started` |
| `home_recommendation_strategy` | `home-params` | Feed variant | `Read Article`, home engagement |
| `retention_renewal_treatment` | `home-params`, `account-params` | Renewal copy + module | `Retention Treatment Presented` |

**Synthetic / forced:** exposure records set `isForced: true`; exclude from live experiment conclusions per inspector disclosure.