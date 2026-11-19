import fs from "fs";
import path from "path";
import { PAGE_PARAM_REGISTRY, type PageId } from "../src/lib/statsig/page-params-defaults.ts";

const yamlPath = path.resolve("docs/statsig-params.yml");
const yaml = fs.readFileSync(yamlPath, "utf8");

const failures: string[] = [];

function pageSection(page: string): string | null {
  const start = yaml.indexOf(`  ${page}:\n`);
  if (start < 0) {
    return null;
  }
  const rest = yaml.slice(start + 1);
  const next = rest.search(/^  [a-z0-9_]+:\n/m);
  return next < 0 ? yaml.slice(start) : yaml.slice(start, start + 1 + next);
}

for (const page of Object.keys(PAGE_PARAM_REGISTRY) as PageId[]) {
  const keys = PAGE_PARAM_REGISTRY[page];
  const block = pageSection(page);
  if (!block) {
    failures.push(`missing page block: ${page}`);
    continue;
  }
  for (const key of keys) {
    const paramRe = new RegExp(`^      ${key}:`, "m");
    if (!paramRe.test(block)) {
      failures.push(`${page}.${key} missing in statsig-params.yml`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({ pass: true, pages: Object.keys(PAGE_PARAM_REGISTRY).length }, null, 2));