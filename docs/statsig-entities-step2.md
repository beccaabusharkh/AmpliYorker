# Statsig page params — Step 2 entity summary

**Project:** AmpliYorker [BAS] (`1Nj9BkrZHElrDQV9CIWiyf`)  
**Environment:** SDK `development` tier (matches `initStatsig`); console provisioned for all environments unless gated — **production** changes require review per project settings.

## Layers + param stores (14 pairs)

| Page | Layer | Param store | Params |
| --- | --- | --- | --- |
| home | `home_layer` | `home_params` | 25 |
| article | `article_layer` | `article_params` | 20 |
| search | `search_layer` | `search_params` | 5 |
| topic | `topic_layer` | `topic_params` | 3 |
| author | `author_layer` | `author_params` | 5 |
| account_register | `account_register_layer` | `account_register_params` | 10 |
| account_login | `account_login_layer` | `account_login_params` | 7 |
| account | `account_layer` | `account_params` | 14 |
| subscribe | `subscribe_layer` | `subscribe_params` | 10 |
| checkout | `checkout_layer` | `checkout_params` | 9 |
| checkout_confirmation | `checkout_confirmation_layer` | `checkout_confirmation_params` | 7 |
| not_found | `not_found_layer` | `not_found_params` | 3 |
| shell | `shell_layer` | `shell_params` | 11 |
| discovery_chat | `discovery_chat_layer` | `discovery_chat_params` | 5 |

## Store ↔ layer links

- Default: each store parameter uses `ref_type: layer` → same name on the paired layer.
- **Gate:** `article_params.premium_paywall_scroll_enabled` → `premium_paywall_after_scroll`.
- **Experiments (existing, no new experiments created):**
  - `home_params.home_recommendation_variant` → `home_recommendation_strategy.variant`
  - `subscribe_params.subscription_offer_variant` → `subscription_offer_framing.variant`
  - `account_params.retention_treatment_variant` → `retention_renewal_treatment.variant`

## Review / production

- **No review pending** for development provisioning (`reviewRequired: false`).
- **Production** env: `reviewRequired: true` — promote or re-apply configs via console review before relying on prod tier.

Payload source: `scripts/build-statsig-entity-payloads.mts` → `/tmp/statsig-page-payloads.json`.