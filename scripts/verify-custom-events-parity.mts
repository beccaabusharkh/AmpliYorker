import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const demoEvents = execSync(`rg -o 'trackDemoEvent\\(\\s*"([^"]+)"' src -r '$1' --no-filename | sort -u`, {
  encoding: "utf8",
})
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

const agentEvents = execSync(`rg -o 'track\\(\\s*"([^"]+)"' src/lib/analytics/agent-chat.ts -r '$1' --no-filename | sort -u`, {
  encoding: "utf8",
})
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

const TERNARY_WIRED = [
  "Article Saved",
  "Article Unsaved",
  "Author Followed",
  "Author Unfollowed",
];
const READ_ARTICLE = ["Read Article"];
const EXPECTED = [...new Set([...demoEvents, ...agentEvents, ...READ_ARTICLE, ...TERNARY_WIRED, "[Agent] Session End"])].sort();

const yamlPath = path.resolve("custom-events.yml");
const yaml = fs.readFileSync(yamlPath, "utf8");
const eventsStart = yaml.indexOf("events:\n");
const eventsBlock = eventsStart >= 0 ? yaml.slice(eventsStart) : yaml;
const dict: string[] = [];
for (const line of eventsBlock.split("\n")) {
  const m = /^  (?:"([^"]+)"|([A-Z][^:\n]*)):$/.exec(line);
  const name = m?.[1] ?? m?.[2];
  if (name && name !== "properties") {
    dict.push(name);
  }
}

const DICT_NOT_WIRED = dict.filter((e) => !EXPECTED.includes(e));
const WIRED_NOT_DICT = EXPECTED.filter((e) => !dict.includes(e));

const missing = WIRED_NOT_DICT;
const extra = DICT_NOT_WIRED;
const legacy = dict.filter((e) => /Article Reading|Recommendation Set/.test(e));
if (missing.length || legacy.length) {
  console.error(
    JSON.stringify(
      {
        pass: false,
        missing,
        dictOnlyNotWired: extra,
        legacy,
        dictCount: dict.length,
        wiredCount: EXPECTED.length,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
console.log(
  JSON.stringify(
    { pass: true, dictCount: dict.length, wiredCount: EXPECTED.length, dictOnlyNotWired: extra.length, dictOnly: extra },
    null,
    2,
  ),
);