import { STATSIG_GATES, RETENTION_COPY } from "./catalog";
import {
  getGateValue,
  getHomeRecommendationVariant,
  getRetentionTreatmentVariant,
  getSubscriptionOfferVariant,
  getStatsigClientForParams,
} from "./evaluate";
import {
  PAGE_DEFAULTS,
  PAGE_LAYER_NAMES,
  PAGE_STORE_NAMES,
  type PageId,
  type PageParamsMap,
  type ParamValue,
} from "./page-params-defaults";

export type { PageId, PageParamsMap };
export { PAGE_PARAM_REGISTRY, PAGE_LAYER_NAMES, PAGE_STORE_NAMES, PAGE_DEFAULTS } from "./page-params-defaults";

function coerceValue(_key: string, raw: unknown, fallback: ParamValue): ParamValue {
  if (raw === undefined || raw === null) {
    return fallback;
  }
  if (typeof fallback === "boolean") {
    if (typeof raw === "boolean") {
      return raw;
    }
    if (typeof raw === "string") {
      return raw === "true";
    }
    return Boolean(raw);
  }
  if (typeof fallback === "number") {
    const num = typeof raw === "number" ? raw : Number(raw);
    return Number.isFinite(num) ? num : fallback;
  }
  if (typeof fallback === "object" && fallback !== null && !Array.isArray(fallback)) {
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw) as ParamValue;
      } catch {
        return fallback;
      }
    }
    if (typeof raw === "object" && raw !== null) {
      return raw as ParamValue;
    }
    return fallback;
  }
  if (Array.isArray(fallback)) {
    if (Array.isArray(raw)) {
      return raw;
    }
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw) as ParamValue;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
  return String(raw);
}

function readStoreParams(page: PageId): PageParamsMap[PageId] {
  const defaults = { ...PAGE_DEFAULTS[page] } as PageParamsMap[PageId];
  const merged = { ...defaults } as Record<string, ParamValue>;
  const client = getStatsigClientForParams();
  if (!client) {
    return merged as PageParamsMap[PageId];
  }
  const storeName = PAGE_STORE_NAMES[page];
  const layerName = PAGE_LAYER_NAMES[page];
  try {
    const store = client.getParameterStore(storeName);
    void layerName;
    for (const key of Object.keys(defaults) as (keyof typeof defaults)[]) {
      const fallback = defaults[key] as ParamValue;
      const raw = store.get(key as string, fallback as string | number | boolean);
      merged[key as string] = coerceValue(key as string, raw, fallback);
    }
  } catch {
    return merged as PageParamsMap[PageId];
  }
  return merged as PageParamsMap[PageId];
}

type MutablePageParams<P extends PageId> = {
  -readonly [K in keyof PageParamsMap[P]]: PageParamsMap[P][K];
};

function applyLiveAssignments<P extends PageId>(
  page: P,
  params: PageParamsMap[P],
): MutablePageParams<P> {
  const next = JSON.parse(JSON.stringify(params)) as MutablePageParams<P>;
  const mutable = next as Record<string, ParamValue>;
  if (page === "home") {
    mutable.home_recommendation_variant = getHomeRecommendationVariant("home-params");
    const retentionVariant = getRetentionTreatmentVariant("home-params");
    if (retentionVariant !== "control") {
      const copy = RETENTION_COPY[retentionVariant];
      mutable.retention_title = copy.title;
      mutable.retention_body = copy.body;
    }
  }
  if (page === "article") {
    mutable.premium_paywall_scroll_enabled = getGateValue(
      STATSIG_GATES.premiumPaywallScroll,
      "article-params",
    );
  }
  if (page === "account") {
    mutable.retention_treatment_variant = getRetentionTreatmentVariant("account-params");
    if (mutable.retention_treatment_variant !== "control") {
      const copy = RETENTION_COPY[mutable.retention_treatment_variant as keyof typeof RETENTION_COPY];
      mutable.retention_title = copy.title;
      mutable.retention_body = copy.body;
    }
  }
  if (page === "subscribe") {
    mutable.subscription_offer_variant = getSubscriptionOfferVariant("subscribe-params");
  }
  return next;
}

export function getPageParams<P extends PageId>(page: P): MutablePageParams<P> {
  const fromStore = readStoreParams(page) as PageParamsMap[P];
  return applyLiveAssignments(page, fromStore);
}