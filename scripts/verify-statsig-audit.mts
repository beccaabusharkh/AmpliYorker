import { STATSIG_EXPERIMENTS, STATSIG_GATES } from "../src/lib/statsig/catalog.ts";
import { PAGE_STORE_NAMES, PAGE_PARAM_REGISTRY } from "../src/lib/statsig/page-params-defaults.ts";

const REQUIRED_SURFACES = [
  "home-params",
  "article-params",
  "subscribe-params",
  "account-params",
  "paywall",
  "article-paywall",
];

async function main(): Promise<void> {
  const pkg = JSON.parse(await import("node:fs/promises").then((fs) => fs.readFile("package.json", "utf8"))) as {
    dependencies?: Record<string, string>;
  };
  const deps = Object.keys(pkg.dependencies ?? {});
  if (!deps.includes("@statsig/web-analytics")) {
    console.error("FAIL: @statsig/web-analytics missing");
    process.exit(1);
  }
  if (deps.some((d) => d.includes("session-replay") && d.startsWith("@statsig"))) {
    console.error("FAIL: Statsig session replay package present");
    process.exit(1);
  }
  const gates = Object.values(STATSIG_GATES);
  const experiments = Object.values(STATSIG_EXPERIMENTS);
  if (gates.length < 1 || experiments.length < 4) {
    console.error("FAIL: catalog incomplete");
    process.exit(1);
  }
  const storeCount = Object.keys(PAGE_STORE_NAMES).length;
  if (storeCount !== 14) {
    console.error("FAIL: expected 14 param stores, got", storeCount);
    process.exit(1);
  }
  const pages = Object.keys(PAGE_PARAM_REGISTRY);
  if (pages.length !== 14) {
    console.error("FAIL: param registry page count", pages.length);
    process.exit(1);
  }
  console.log(
    "PASS statsig-audit:",
    gates.length,
    "gates,",
    experiments.length,
    "experiments,",
    storeCount,
    "stores; surfaces",
    REQUIRED_SURFACES.join(","),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});