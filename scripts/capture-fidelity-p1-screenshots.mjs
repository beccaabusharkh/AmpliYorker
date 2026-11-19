/**
 * P2H-BUILD-FIDELITY-P1-001 — captures + side-by-side pairs @ 1440 & 390.
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
const REF_STORE = "/cursor/stores/self/media/atlantic-fidelity";
const PREVIEW = process.env.FIDELITY_PREVIEW ?? "http://127.0.0.1:4174/AmpliYorker/";

fs.mkdirSync(EVIDENCE, { recursive: true });

const browser = await chromium.launch();
const metrics = {};

for (const vp of [
  { id: "1440", width: 1440, height: 1000 },
  { id: "390", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(PREVIEW + "#/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);

  metrics[vp.id] = await page.evaluate(() => {
    const grid = document.querySelector(".opening-mosaic");
    const leadImg = document.querySelector(".lead-hero-image");
    const chrome = document.querySelector("[data-fidelity-chrome]");
    const leadH = document.querySelector(".lead-headline");
    const gr = grid?.getBoundingClientRect();
    const lr = leadImg?.getBoundingClientRect();
    const cr = chrome?.getBoundingClientRect();
    const header = document.querySelector(".site-header--fidelity");
    const promo = document.querySelector("[data-subscribe-promo]");
    const hr = header?.getBoundingClientRect();
    const pr = promo?.getBoundingClientRect();
    const promoVisible = promo ? getComputedStyle(promo).display !== "none" : false;
    return {
      gutterLeft: gr?.left,
      gridWidth: gr?.width,
      leadImage: lr ? { w: lr.width, h: lr.height, aspect: lr.width / lr.height } : null,
      chromeHeight: cr?.height,
      headerHeightToPromo: promoVisible && pr ? pr.bottom - (hr?.top ?? 0) : hr?.height,
      promoVisible,
      imageBeforeHeadline: (leadImg?.getBoundingClientRect().top ?? 1) < (leadH?.getBoundingClientRect().top ?? 0),
      headlineSize: leadH ? getComputedStyle(leadH).fontSize : null,
    };
  });

  const afterPath = path.join(EVIDENCE, `ampliyorker-after-p1-${vp.id}.png`);
  await page.screenshot({ path: afterPath, fullPage: false });

  const refName = vp.id === "1440" ? "atlantic-wayback-desktop-1440x1000.png" : "atlantic-wayback-mobile-390x844.png";
  const refSrc = path.join(REF_STORE, refName);
  const refCopy = path.join(EVIDENCE, `reference-wayback-${vp.id}.png`);
  if (fs.existsSync(refSrc)) fs.copyFileSync(refSrc, refCopy);

  if (fs.existsSync(refCopy)) {
    const pairPath = path.join(EVIDENCE, `side-by-side-p1-${vp.id}.png`);
    await page.setViewportSize({ width: vp.width * 2 + 24, height: vp.height });
    await page.setContent(
      `<!doctype html><style>body{margin:0;display:flex;gap:12px;background:#111;padding:6px}img{width:${vp.width}px;height:${vp.height}px;object-fit:cover;object-position:top}</style>
      <img src="file://${refCopy}" alt="reference" /><img src="file://${afterPath}" alt="after" />`,
    );
    await page.waitForTimeout(200);
    await page.screenshot({ path: pairPath, fullPage: false });
  }

  await page.close();
}

await browser.close();

fs.writeFileSync(
  path.join(EVIDENCE, "p2h-p1-geometry.json"),
  JSON.stringify({ assignment: "P2H-BUILD-FIDELITY-P1-001", metrics, capturedAt: new Date().toISOString() }, null, 2),
);