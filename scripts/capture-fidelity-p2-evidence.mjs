/**
 * P2H-BUILD-FIDELITY-P2-001 — below-fold + rule/typography evidence.
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { chromium } = require(
  fs.existsSync("/tmp/node_modules/playwright")
    ? "/tmp/node_modules/playwright"
    : "playwright",
);

const EVIDENCE = path.resolve("docs/evidence/atlantic-fidelity");
const PREVIEW = process.env.FIDELITY_PREVIEW ?? "http://127.0.0.1:4174/AmpliYorker/";

const browser = await chromium.launch();
const metrics = {};

for (const vp of [
  { id: "1440", width: 1440, height: 1000 },
  { id: "390", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(PREVIEW + "#/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  if (vp.id === "1440") {
    await page.locator(".home-content-grid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(EVIDENCE, "home-below-fold-p2-1440.png"), fullPage: false });
  } else {
    await page.locator("[data-opening-mosaic]").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(EVIDENCE, "home-opening-p2-390.png"), fullPage: false });
  }

  metrics[vp.id] = await page.evaluate(() => {
    const railHeadline = document.querySelector(".opening-rail .rail-headline");
    const feedHeadline = document.querySelector(".feed-headline");
    const tabRule = document.querySelector(".home-tablist");
    const rail = document.querySelector(".home-rail");
    const thumb = document.querySelector(".opening-rail .secondary-lead-thumb");
    const tabBtn = document.querySelector(".home-tablist button");
    return {
      railHeadlinePx: railHeadline ? getComputedStyle(railHeadline).fontSize : null,
      feedHeadlinePx: feedHeadline ? getComputedStyle(feedHeadline).fontSize : null,
      tabBorderPx: tabRule ? getComputedStyle(tabRule).borderBottomWidth : null,
      tabBorderColor: tabRule ? getComputedStyle(tabRule).borderBottomColor : null,
      railWidth: rail?.getBoundingClientRect().width,
      thumbBox: thumb
        ? {
            w: thumb.getBoundingClientRect().width,
            h: thumb.getBoundingClientRect().height,
          }
        : null,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      chromeHeight: document.querySelector("[data-fidelity-chrome]")?.getBoundingClientRect().height,
      tabButtonSize: tabBtn ? getComputedStyle(tabBtn).fontSize : null,
    };
  });

  await page.close();
}

await browser.close();

const fidStatus = {
  "FID-M01": { status: "addressed", note: "80px gutter @1440 (P1)" },
  "FID-M02": { status: "addressed", note: "1280px opening container (P1)" },
  "FID-M03": { status: "addressed", note: "296/624/296 mosaic (P1)" },
  "FID-M04": { status: "addressed", note: "624×416 3:2 lead (P1)" },
  "FID-M05": { status: "addressed", note: "image-first (P1)" },
  "FID-M06": { status: "addressed", note: "~101px chrome @390 (P1b)" },
  "FID-M07": { status: "partial", note: "desktop slim promo band remains below chrome; hidden @390" },
  "FID-M08": { status: "partial", note: "edition in chrome center @desktop; not Atlantic-hidden" },
  "FID-M09": { status: "addressed", note: "38/32px lead headline tokens" },
  "FID-M10": { status: "addressed", note: "18px rail/feed/latest (P2)" },
  "FID-M11": { status: "partial", note: "fused chrome ~155px @1440; below Atlantic 226px nav monolith" },
};

fs.writeFileSync(
  path.join(EVIDENCE, "p2h-p2-geometry.json"),
  JSON.stringify({ assignment: "P2H-BUILD-FIDELITY-P2-001", metrics, fidStatus, capturedAt: new Date().toISOString() }, null, 2),
);