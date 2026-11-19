import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const failures: string[] = [];
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8")) as { dependencies?: Record<string, string> };
const deps = Object.keys(pkg.dependencies ?? {});

if (!deps.includes("@statsig/web-analytics")) {
  failures.push("missing @statsig/web-analytics");
}
if (deps.some((d) => d.includes("session-replay"))) {
  failures.push("forbidden @statsig/session-replay");
}

const init = fs.readFileSync("src/lib/statsig/init.ts", "utf8");
if (!init.includes("StatsigAutoCapturePlugin")) {
  failures.push("init missing StatsigAutoCapturePlugin");
}
const track = fs.readFileSync("src/lib/analytics/track.ts", "utf8");
if (!track.includes("trackStatsigMirror")) {
  failures.push("track.ts missing Statsig mirror");
}
const evaluate = fs.readFileSync("src/lib/statsig/evaluate.ts", "utf8");
if (/getExperiment\([^)]*disableExposureLog/.test(evaluate) || /checkGate\([^)]*disableExposureLog/.test(evaluate)) {
  failures.push("gate/experiment reads still use disableExposureLog");
}
const statsigSrc = execSync("rg disableExposureLog src/lib/statsig -l || true", { encoding: "utf8" }).trim();
if (statsigSrc) {
  failures.push(`disableExposureLog still present: ${statsigSrc}`);
}

const sample = execSync(
  `node --experimental-strip-types -e "import { amplitudeEventToStatsigName } from './src/lib/statsig/event-names.ts'; console.log(amplitudeEventToStatsigName('Read Article')); console.log(amplitudeEventToStatsigName('[Agent] User Message'));"`,
  { encoding: "utf8" },
).trim();
if (!sample.includes("read_article") || sample.includes("auto_capture::")) {
  failures.push("event name mapping read_article (no auto_capture prefix)");
}

if (failures.length) {
  console.error(JSON.stringify({ pass: false, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ pass: true, mapping_sample: sample.split("\n") }, null, 2));