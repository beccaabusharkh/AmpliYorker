# Amplitude ↔ Statsig event map (P7)

Convention: Amplitude **display name** → Statsig custom event **snake_case** (e.g. `read_article`). **`auto_capture::`** is reserved for Statsig Web Analytics plugin only (`page_view`, `page_view_end`, clicks).

| Amplitude (`custom-events.yml`) | Statsig custom mirror |
| --- | --- |
| Topic Filter Applied | `topic_filter_applied` |
| Author Filter Applied | `author_filter_applied` |
| Search Completed | `search_completed` |
| Read Article | `read_article` |
| Registration Completed | `registration_completed` |
| Sign In Completed | `sign_in_completed` |
| Sign Out Completed | `sign_out_completed` |
| Article Saved | `article_saved` |
| Article Unsaved | `article_unsaved` |
| Author Followed | `author_followed` |
| Author Unfollowed | `author_unfollowed` |
| Newsletter Subscription Completed | `newsletter_subscription_completed` |
| Media Playback Started | `media_playback_started` |
| Media Playback Completed | `media_playback_completed` |
| Paywall Presented | `paywall_presented` |
| Subscription Added To Cart | `subscription_added_to_cart` |
| Checkout Started | `checkout_started` |
| Checkout Completed | `checkout_completed` |
| Subscription Activated | `subscription_activated` |
| Trial Started | `trial_started` |
| Subscription Payment Completed | `subscription_payment_completed` |
| Advertisement Viewable | `advertisement_viewable` |
| Ad Revenue Recorded | `ad_revenue_recorded` |
| Retention Treatment Presented | `retention_treatment_presented` |
| Billing Details Updated | `billing_details_updated` |
| Subscription Plan Changed | `subscription_plan_changed` |
| Cancellation Started | `cancellation_started` |
| Subscription Canceled | `subscription_canceled` |
| Chat Request Submitted | `chat_request_submitted` |
| Chat Response Delivered | `chat_response_delivered` |
| `[Agent] Session End` | `agent_session_end` |
| `[Agent] User Message` | `agent_user_message` |
| `[Agent] AI Response` | `agent_ai_response` |

## Treatment surfaces → outcomes

| Statsig entity | Surface | Primary Amplitude outcomes |
| --- | --- | --- |
| `premium_paywall_after_scroll` | `article-params` | `Paywall Presented` |
| `subscription_message_copy` | `paywall` / `article-paywall` | `Paywall Presented` |
| `subscription_offer_framing` | `subscribe-params` | `Subscription Added To Cart`, `Checkout Started` |
| `home_recommendation_strategy` | `home-params` | `Read Article` |
| `retention_renewal_treatment` | `home-params`, `account-params` | `Retention Treatment Presented` |

**Exposures:** all SDK reads log to Statsig; demo inspector dedupes per gate/experiment + surface for UI only.