import fs from "node:fs";
import path from "node:path";
import { PRECISION_INTERACTION_ROOTS } from "../src/lib/analytics/precision.ts";

const FORBIDDEN_SECONDARY_PACKAGES = ["@amplitude/analytics-browser", "@amplitude/ai"];

async function main(): Promise<void> {
  const pkg = JSON.parse(await import("node:fs/promises").then((fs) => fs.readFile("package.json", "utf8"))) as {
    dependencies?: Record<string, string>;
  };
  const deps = Object.keys(pkg.dependencies ?? {});
  const offenders = deps.filter((name) => FORBIDDEN_SECONDARY_PACKAGES.includes(name));
  if (offenders.length > 0) {
    console.error("FAIL: secondary Amplitude packages:", offenders.join(", "));
    process.exit(1);
  }
  if (!deps.includes("@amplitude/unified")) {
    console.error("FAIL: @amplitude/unified missing");
    process.exit(1);
  }
  if (PRECISION_INTERACTION_ROOTS.length < 10) {
    console.error("FAIL: precision interaction roots too small");
    process.exit(1);
  }
  const distHtml = path.resolve("dist/index.html");
  const apiKey = process.env.VITE_AMPLITUDE_API_KEY?.trim();
  if (apiKey && fs.existsSync(distHtml)) {
    const html = fs.readFileSync(distHtml, "utf8");
    const expected = `https://cdn.amplitude.com/script/${apiKey}.experiment.js`;
    if (!html.includes(expected)) {
      console.error("FAIL: dist/index.html missing Web Experiment CDN script", expected);
      process.exit(1);
    }
  }
  console.log("PASS amplitude-config: unified-only SDK, precision roots", PRECISION_INTERACTION_ROOTS.length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});