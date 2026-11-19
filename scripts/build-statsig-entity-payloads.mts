import fs from "fs";
import {
  PAGE_DEFAULTS,
  PAGE_LAYER_NAMES,
  PAGE_STORE_NAMES,
  type PageId,
  type ParamValue,
} from "../src/lib/statsig/page-params-defaults.ts";

const EXPERIMENT_PARAM_LINKS: Partial<Record<PageId, Record<string, { experiment: string; param: string }>>> = {
  home: { home_recommendation_variant: { experiment: "home_recommendation_strategy", param: "variant" } },
  article: {},
  subscribe: { subscription_offer_variant: { experiment: "subscription_offer_framing", param: "variant" } },
  account: { retention_treatment_variant: { experiment: "retention_renewal_treatment", param: "variant" } },
};

const GATE_PARAM_LINKS: Partial<Record<PageId, Record<string, string>>> = {
  article: { premium_paywall_scroll_enabled: "premium_paywall_after_scroll" },
};

function inferParamType(value: ParamValue): "string" | "number" | "boolean" | "object" | "array" {
  if (Array.isArray(value)) return "array";
  if (typeof value === "object" && value !== null) return "object";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "string";
}

function layerParameters(page: PageId) {
  return Object.entries(PAGE_DEFAULTS[page]).map(([name, value]) => ({
    name,
    type: inferParamType(value),
    defaultValue: value,
    description: `${page} param ${name}`,
  }));
}

function storeParameters(page: PageId) {
  const layerName = PAGE_LAYER_NAMES[page];
  const experimentLinks = EXPERIMENT_PARAM_LINKS[page] ?? {};
  const gateLinks = GATE_PARAM_LINKS[page] ?? {};

  return Object.entries(PAGE_DEFAULTS[page]).map(([name, value]) => {
    if (gateLinks[name]) {
      return {
        ref_type: "gate" as const,
        name,
        gate_name: gateLinks[name],
        param_type: inferParamType(value),
        pass_value: inferParamType(value) === "boolean" ? true : value,
        fail_value: inferParamType(value) === "boolean" ? false : value,
      };
    }
    if (experimentLinks[name]) {
      return {
        ref_type: "experiment" as const,
        name,
        param_type: inferParamType(value),
        experiment_name: experimentLinks[name].experiment,
        param_name: experimentLinks[name].param,
      };
    }
    return {
      ref_type: "layer" as const,
      name,
      param_type: inferParamType(value),
      layer_name: layerName,
      param_name: name,
    };
  });
}

const pages = Object.keys(PAGE_DEFAULTS) as PageId[];
const out = Object.fromEntries(
  pages.map((page) => [
    page,
    {
      layer: PAGE_LAYER_NAMES[page],
      store: PAGE_STORE_NAMES[page],
      createLayer: {
        name: PAGE_LAYER_NAMES[page],
        description: `AmpliYorker ${page} page parameters`,
        idType: "userID",
      },
      createStore: {
        name: PAGE_STORE_NAMES[page],
        displayName: PAGE_STORE_NAMES[page],
        description: `Parameter store for ${page} surface`,
      },
      updateLayer: { description: `AmpliYorker ${page} layer defaults`, parameters: layerParameters(page) },
      updateStore: { parameters: storeParameters(page) },
    },
  ]),
);

fs.writeFileSync("/tmp/statsig-page-payloads.json", JSON.stringify(out, null, 2));
console.log(`pages=${pages.length}`);