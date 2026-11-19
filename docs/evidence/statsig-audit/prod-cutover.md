# Statsig production environment cutover

**Goal:** Live demo (GitHub Pages) evaluates gates, experiments, and parameter stores in Statsig **production** tier — same client SDK key; environment tier is `production`.

## Repo / deploy

| Step | Action |
| --- | --- |
| 1 | GitHub Actions secret **`VITE_STATSIG_ENV_TIER`** = `production` |
| 2 | Secret **`VITE_STATSIG_CLIENT_KEY`** present (unchanged) |
| 3 | Merge `cursor/statsig-prod-tier-93b2` (or follow-up); Pages deploy rebuilds bundle |
| 4 | Verify `docs/evidence/statsig-audit/p7-live-merge-smoke.json` / `pnpm test:statsig-network-smoke` |

Runtime: `resolveStatsigEnvTier()` in `src/lib/statsig/env-tier.ts` — explicit env wins; else `production` for `import.meta.env.PROD`, else `development` for local dev.

## Console (AmpliYorker [BAS]) — release pipeline

Promote entity definitions **development → staging → production** per Statsig console workflow (do not skip review on production where `reviewRequired` applies — see P5 S21).

| Order | Entity type | Notes |
| --- | --- | --- |
| 1 | Parameter stores (14) | Promote each store; production may require review |
| 2 | Layers linked to stores | Keep layer/store pairs per `docs/statsig-entities-step2.md` |
| 3 | Gates | e.g. `premium_paywall_after_scroll` |
| 4 | Experiments | `home_recommendation_strategy`, `subscription_offer_framing`, `subscription_message_copy`, `retention_renewal_treatment` |

After promotion: spot-check live demo exposures and `auto_capture::` / custom events in Statsig **production** project views.

**Do not** change experiment allocations or launch new experiments as part of this cutover unless explicitly approved.