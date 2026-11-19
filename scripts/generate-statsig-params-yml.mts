import fs from "fs";
import path from "path";
import {
  PAGE_DEFAULTS,
  PAGE_LAYER_NAMES,
  PAGE_STORE_NAMES,
  type PageId,
} from "../src/lib/statsig/page-params-defaults.ts";

function inferType(value: unknown): string {
  if (Array.isArray(value)) {
    return "json";
  }
  if (typeof value === "object" && value !== null) {
    return "json";
  }
  if (typeof value === "number") {
    return "number";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  return "string";
}

function yamlScalar(value: unknown, indent: number): string {
  const pad = " ".repeat(indent);
  if (typeof value === "string") {
    const needsQuote = /[:#\n]/.test(value) || value.includes("'") || value.startsWith(" ");
    return needsQuote || value.includes("—")
      ? `${pad}default: "${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
      : `${pad}default: ${value}`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return `${pad}default: ${value}`;
  }
  if (Array.isArray(value)) {
    return `${pad}default: |\n${pad}  ${JSON.stringify(value)}`;
  }
  return `${pad}default: |\n${pad}  ${JSON.stringify(value)}`;
}

const lines: string[] = [
  "# AmpliYorker page parameters — mirrors Statsig param stores (console entities pending MCP write)",
  "version: 1",
  "project: AmpliYorker [BAS]",
  "pages:",
];

for (const page of Object.keys(PAGE_DEFAULTS) as PageId[]) {
  lines.push(`  ${page}:`);
  lines.push(`    layer: ${PAGE_LAYER_NAMES[page]}`);
  lines.push(`    store: ${PAGE_STORE_NAMES[page]}`);
  lines.push("    parameters:");
  for (const [key, value] of Object.entries(PAGE_DEFAULTS[page])) {
    lines.push(`      ${key}:`);
    lines.push(`        type: ${inferType(value)}`);
    lines.push(yamlScalar(value, 8));
  }
}

const out = path.resolve("docs/statsig-params.yml");
fs.writeFileSync(out, `${lines.join("\n")}\n`);
console.log(`Wrote ${out}`);