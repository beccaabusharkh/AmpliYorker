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
  console.log("PASS amplitude-config: unified-only SDK, precision roots", PRECISION_INTERACTION_ROOTS.length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});