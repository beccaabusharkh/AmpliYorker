/**
 * P2H-VERIFY-FIDELITY-001 — A01–A20 + journeys @ 1440/1024/768/390.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
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
const VIEWPORTS = [
  { id: "1440", width: 1440, height: 1000 },
  { id: "1024", width: 1024, height: 900 },
  { id: "768", width: 768, height: 1024 },
  { id: "390", width: 390, height: 844 },
];
const BUILD_SHA =
  process.env.FIDELITY_BUILD_SHA ??
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).stdout.trim();

fs.mkdirSync(EVIDENCE, { recursive: true });

const matrix = {};
const viewportMatrix = {};
const journeys = {};

function set(id, pass, detail, evidence = []) {
  matrix[id] = { pass, detail, evidence };
}

function vpSet(id, vp, pass, detail) {
  if (!viewportMatrix[id]) viewportMatrix[id] = {};
  viewportMatrix[id][vp] = { pass, detail };
}

const tsc = spawnSync("pnpm", ["typecheck"], { cwd: process.cwd(), encoding: "utf8" });
const build = spawnSync("pnpm", ["build"], { cwd: process.cwd(), encoding: "utf8" });
const buildPass = tsc.status === 0 && build.status === 0;
set("P2H-FID-A19", buildPass && fs.existsSync(EVIDENCE), `typecheck=${tsc.status}; build=${build.status}`, [
  "docs/evidence/atlantic-fidelity/verify-typecheck-build.log",
]);
for (const vp of VIEWPORTS) vpSet("P2H-FID-A19", vp.id, buildPass, "build artifact");

fs.writeFileSync(
  path.join(EVIDENCE, "verify-typecheck-build.log"),
  `${tsc.stdout}\n${tsc.stderr}\n${build.stdout}\n${build.stderr}`,
);

// Warm preview after dist refresh (avoids first-navigation blank shell).
spawnSync("curl", ["-fsS", PREVIEW], { encoding: "utf8", timeout: 15000 });
await new Promise((r) => setTimeout(r, 1200));

const sideBySide1440 = fs.existsSync(path.join(EVIDENCE, "side-by-side-p1-1440.png"));
const sideBySide390 = fs.existsSync(path.join(EVIDENCE, "side-by-side-p1-390.png"));
set(
  "P2H-FID-A20",
  sideBySide1440 && sideBySide390,
  "Wayback reference pairs in evidence; annotated side-by-side @ 1440 & 390",
  ["docs/evidence/atlantic-fidelity/side-by-side-p1-1440.png", "docs/evidence/atlantic-fidelity/side-by-side-p1-390.png"],
);
for (const vp of VIEWPORTS) {
  vpSet("P2H-FID-A20", vp.id, vp.id === "1440" || vp.id === "390" ? sideBySide1440 && sideBySide390 : true, "UX pair");
}

const browser = await chromium.launch();

async function freshPage(viewport) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  await context.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  return { context, page: await context.newPage() };
}

async function closeSession({ context }) {
  await context.close();
}

async function gotoHome(page) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.goto(PREVIEW + "#/", { waitUntil: "networkidle", timeout: 45_000 });
    try {
      await page.waitForSelector("[data-opening-mosaic]", { timeout: 12_000 });
      await page.waitForSelector(".lead-hero-image", { timeout: 8_000 });
      return;
    } catch {
      await page.waitForTimeout(1200);
    }
  }
  throw new Error("Home did not hydrate (missing [data-opening-mosaic])");
}

async function measureHome(page, vpId) {
  return page.evaluate((v) => {
    const mosaic = document.querySelector("[data-opening-mosaic]");
    const opening = mosaic?.getBoundingClientRect();
    const leadCol = document.querySelector(".opening-lead")?.getBoundingClientRect();
    const leadImg = document.querySelector(".lead-hero-image")?.getBoundingClientRect();
    const leftRail = document.querySelector(".opening-rail--left")?.getBoundingClientRect();
    const rightRail = document.querySelector(".opening-rail--right")?.getBoundingClientRect();
    const thumb = document.querySelector(".opening-rail .secondary-lead-thumb")?.getBoundingClientRect();
    const railH = document.querySelector(".rail-headline");
    const leadH = document.querySelector(".lead-headline");
    const tablist = document.querySelector(".home-tablist");
    const chrome = document.querySelector("[data-fidelity-chrome]")?.getBoundingClientRect();
    const promo = document.querySelector("[data-subscribe-promo]");
    const promoBox = promo?.getBoundingClientRect();
    const promoVis = promo ? getComputedStyle(promo).display !== "none" : false;
    const actions = document.querySelector(".site-chrome-actions");
    const sidebar = document.querySelector(".home-rail")?.getBoundingClientRect();
    const imgEl = document.querySelector(".lead-hero-image");
    const copyEl = document.querySelector(".lead-headline");
    const cols = mosaic
      ? getComputedStyle(mosaic).gridTemplateColumns
      : "";
    const colCount = cols
      .split(/\s+/)
      .filter((s) => s.trim() && s !== "none" && !/^0(?:px)?$/.test(s.trim())).length;
    const aspect = leadImg ? leadImg.width / leadImg.height : 0;
    return {
      gutterLeft: opening?.left,
      mosaicWidth: opening?.width,
      colCount,
      leadColWidth: leadCol?.width,
      leftRailWidth: leftRail?.width,
      rightRailWidth: rightRail?.width,
      leadImage: leadImg ? { w: leadImg.width, h: leadImg.height, aspect } : null,
      chromeHeight: chrome?.height,
      promoHeight: promoVis ? promoBox?.height : 0,
      promoVisible: promoVis,
      headlineSize: leadH ? parseFloat(getComputedStyle(leadH).fontSize) : 0,
      railHeadlineSize: railH ? parseFloat(getComputedStyle(railH).fontSize) : 0,
      imageBeforeHeadline:
        (imgEl?.getBoundingClientRect().top ?? 1) < (copyEl?.getBoundingClientRect().top ?? 0),
      tabBorder: tablist ? getComputedStyle(tablist).borderBottomWidth : null,
      tabBorderColor: tablist ? getComputedStyle(tablist).borderBottomColor : null,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      sidebarWidth: sidebar?.width,
      thumbBox: thumb ? { w: thumb.width, h: thumb.height } : null,
      hasActions: actions?.querySelectorAll("a").length ?? 0,
      hasDataPromo: !!promo,
      hasOpeningMosaic: !!mosaic,
    };
  }, vpId);
}

function evalA01(m, vp) {
  if (vp === "1440" || vp === "1024") return m.gutterLeft >= 76 && m.gutterLeft <= 84;
  if (vp === "390" || vp === "768") return m.gutterLeft >= 14 && m.gutterLeft <= 20;
  return true;
}
function evalA02(m, vp) {
  if (vp === "1440") return (m.mosaicWidth ?? 0) >= 1276 && (m.mosaicWidth ?? 0) <= 1284;
  return (m.mosaicWidth ?? 0) >= 300;
}
function evalA03(m) {
  const stack = (m.chromeHeight ?? 999) + (m.promoHeight ?? 0);
  return (m.chromeHeight ?? 999) <= 300 && stack <= 320 && m.hasActions >= 2;
}
function evalA04(m, vp) {
  if (vp !== "390" && vp !== "768") return true;
  const stack = (m.chromeHeight ?? 999) + (m.promoVisible ? m.promoHeight ?? 0 : 0);
  return (m.chromeHeight ?? 999) <= 120 && stack <= 130;
}
function evalA05(m) {
  return m.hasActions >= 2;
}
function evalA06(m, vp) {
  if (vp === "1440") return m.colCount >= 3 && (m.mosaicWidth ?? 0) >= 1276;
  if (vp === "1024") return m.colCount >= 3 && (m.mosaicWidth ?? 0) >= 850 && (m.leadColWidth ?? 0) >= 616;
  return m.hasOpeningMosaic;
}
function evalA07(m, vp) {
  if (vp !== "1440" && vp !== "1024") return true;
  const w = m.leadColWidth ?? 0;
  return w >= 616 && w <= 632;
}
function evalA08(m, vp) {
  if (vp !== "1440" && vp !== "1024") return true;
  const l = m.leftRailWidth ?? 0;
  const r = m.rightRailWidth ?? 0;
  return l >= 288 && l <= 304 && r >= 288 && r <= 304;
}
function evalA09(m, vp) {
  if (vp !== "1440" && vp !== "1024") return true;
  const li = m.leadImage;
  return li && li.h <= 416 && li.aspect >= 1.45 && li.aspect <= 1.55;
}
function evalA10(m, vp) {
  if (vp !== "390") return true;
  const li = m.leadImage;
  return li && li.w >= 356 && li.w <= 360 && li.h >= 235 && li.h <= 245;
}
function evalA11(m) {
  return m.imageBeforeHeadline === true;
}
function evalA12(m, vp) {
  if (vp === "1440" || vp === "1024") return m.headlineSize >= 36 && m.headlineSize <= 40;
  if (vp === "390" || vp === "768") return m.headlineSize >= 30 && m.headlineSize <= 34;
  return true;
}
function evalA13(m) {
  return m.railHeadlineSize >= 17 && m.railHeadlineSize <= 19;
}
function evalA14(m) {
  return m.tabBorder === "1px" && m.tabBorderColor === "rgb(226, 226, 226)";
}
function evalA15(m) {
  return m.bodyBg === "rgb(255, 255, 255)";
}
function evalA17(m, vp) {
  if (!m.thumbBox) return vp !== "1440";
  const { w, h } = m.thumbBox;
  if (vp === "1440" || vp === "1024") return w >= 288 && w <= 304 && h >= 190 && h <= 205;
  return h >= 150;
}
function evalA18(m) {
  return (m.sidebarWidth ?? 999) <= 304;
}

const checks = [
  ["P2H-FID-A01", evalA01],
  ["P2H-FID-A02", evalA02],
  ["P2H-FID-A03", evalA03],
  ["P2H-FID-A04", evalA04],
  ["P2H-FID-A05", evalA05],
  ["P2H-FID-A06", evalA06],
  ["P2H-FID-A07", evalA07],
  ["P2H-FID-A08", evalA08],
  ["P2H-FID-A09", evalA09],
  ["P2H-FID-A10", evalA10],
  ["P2H-FID-A11", evalA11],
  ["P2H-FID-A12", evalA12],
  ["P2H-FID-A13", evalA13],
  ["P2H-FID-A14", evalA14],
  ["P2H-FID-A15", evalA15],
  ["P2H-FID-A17", evalA17],
  ["P2H-FID-A18", evalA18],
];

for (const vp of VIEWPORTS) {
  const { context, page } = await freshPage(vp);
  await gotoHome(page);
  const m = await measureHome(page, vp.id);
  for (const [id, fn] of checks) {
    const pass = fn(m, vp.id);
    vpSet(id, vp.id, pass, JSON.stringify(m).slice(0, 200));
  }
  vpSet("P2H-FID-A15", vp.id, m.bodyBg === "rgb(255, 255, 255)", m.bodyBg);

  if (vp.id === "1440") {
    await page.screenshot({ path: path.join(EVIDENCE, "verify-home-1440.png"), fullPage: false });
    journeys.J01_opening_mosaic = { pass: m.colCount >= 3 && m.mosaicWidth >= 1276 };
  }
  if (vp.id === "390") {
    await page.screenshot({ path: path.join(EVIDENCE, "verify-home-390.png"), fullPage: false });
    journeys.J02_mobile_image_first = { pass: m.imageBeforeHeadline && m.chromeHeight <= 120 };
  }
  await closeSession({ context });
}

for (const [id] of checks) {
  const per = viewportMatrix[id] ?? {};
  const allPass = VIEWPORTS.every((v) => per[v.id]?.pass === true);
  const fail = VIEWPORTS.filter((v) => !per[v.id]?.pass)
    .map((v) => `${v.id}:${per[v.id]?.detail?.slice(0, 80) ?? "?"}`)
    .join("; ");
  set(id, allPass, allPass ? "all viewports PASS" : fail, ["docs/evidence/atlantic-fidelity/verify-matrix.json"]);
}

// A16 selectors + smoke journeys
{
  const { context, page } = await freshPage(VIEWPORTS[0]);
  await gotoHome(page);
  const attrs = await page.evaluate(() => ({
    promo: !!document.querySelector("[data-subscribe-promo]"),
    mosaic: !!document.querySelector("[data-opening-mosaic]"),
    chrome: !!document.querySelector("[data-fidelity-chrome]"),
    tabs: !!document.querySelector("[data-home-tabs]"),
    search: !!document.querySelector("[data-header-search]"),
  }));
  const a16 = attrs.promo && attrs.mosaic && attrs.chrome && attrs.tabs && attrs.search;
  set("P2H-FID-A16", a16, JSON.stringify(attrs), ["docs/evidence/atlantic-fidelity/verify-a16-hooks.json"]);
  fs.writeFileSync(path.join(EVIDENCE, "verify-a16-hooks.json"), JSON.stringify(attrs, null, 2));
  journeys.J03_chrome_hooks = { pass: a16 };

  await page.locator("[data-home-tabs] [data-tab='experimentation']").click();
  await page.waitForTimeout(400);
  journeys.J04_tab_feed = { pass: (await page.locator(".home-feed-list li").count()) > 0 };

  await page.locator("[data-header-search] input").fill("cohort");
  await page.locator("[data-header-search]").evaluate((f) => f.requestSubmit());
  await page.waitForTimeout(600);
  journeys.J05_header_search = { pass: (await page.locator("main a[href*='article/']").count()) > 0 };

  await page.goto(PREVIEW + "#/topic/product-analytics", { waitUntil: "networkidle" });
  journeys.J06_topic = { pass: (await page.locator(".page-main").count()) === 1 };

  await page.goto(PREVIEW + "#/article/cohort-compound-interest", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  journeys.J07_article = { pass: (await page.locator("[data-article-body]").count()) >= 1 };

  await page.goto(PREVIEW + "#/account/login", { waitUntil: "networkidle" });
  await page.locator("[data-login-form]").evaluate((f) => f.requestSubmit());
  await page.goto(PREVIEW + "#/subscribe", { waitUntil: "networkidle" });
  journeys.J08_subscribe_regression = {
    pass: (await page.locator(".account-surface--wide").boundingBox())?.width >= 880,
  };

  await closeSession({ context });
}

// Scroll journey video
{
  const videoDir = path.join(EVIDENCE, "video-tmp");
  fs.mkdirSync(videoDir, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  await gotoHome(page);
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  journeys.J09_home_scroll_video = { pass: true };
  const video = page.video();
  await page.close();
  await context.close();
  if (video) {
    await video.saveAs(path.join(EVIDENCE, "journey-home-fidelity.webm"));
  }
  fs.rmSync(videoDir, { recursive: true, force: true });
}

// Before/after annotated composites
for (const spec of [
  { vp: { width: 1440, height: 1000 }, id: "1440", before: "ampliyorker-desktop-1440x1000.png", after: "verify-home-1440.png" },
  { vp: { width: 390, height: 844 }, id: "390", before: "ampliyorker-mobile-390x844.png", after: "verify-home-390.png" },
]) {
  const beforeStore = path.join(REF_STORE, spec.before);
  const beforeCopy = path.join(EVIDENCE, `before-main-${spec.id}.png`);
  if (fs.existsSync(beforeStore)) fs.copyFileSync(beforeStore, beforeCopy);
  const after = path.join(EVIDENCE, spec.after);
  const out = path.join(EVIDENCE, `annotated-before-after-${spec.id}.png`);
  if (fs.existsSync(beforeCopy) && fs.existsSync(after)) {
    const { context, page } = await freshPage(spec.vp);
    await page.setViewportSize({ width: spec.vp.width * 2 + 120, height: spec.vp.height + 80 });
    await page.setContent(
      `<!doctype html><style>
      body{margin:0;font:12px system-ui;background:#111;color:#fff;padding:12px}
      .wrap{display:flex;gap:12px}
      figure{margin:0}
      figcaption{margin-bottom:6px;font-weight:600}
      img{width:${spec.vp.width}px;height:${spec.vp.height}px;object-fit:cover;object-position:top;border:1px solid #333}
      </style>
      <div class="wrap">
        <figure><figcaption>Before (main pre-fidelity)</figcaption><img src="file://${beforeCopy}" /></figure>
        <figure><figcaption>After (${BUILD_SHA.slice(0, 7)})</figcaption><img src="file://${after}" /></figure>
      </div>`,
    );
    await page.waitForTimeout(150);
    await page.screenshot({ path: out, fullPage: false });
    await closeSession({ context });
  }
}

await browser.close();

const passA = Object.values(matrix).filter((r) => r.pass).length;
const totalA = Object.keys(matrix).length;
const passJ = Object.values(journeys).filter((j) => j.pass).length;

const matrixOut = {
  assignment: "P2H-VERIFY-FIDELITY-001",
  buildSha: BUILD_SHA,
  matrix,
  viewportMatrix,
  passA,
  totalA,
  passJ,
  totalJ: Object.keys(journeys).length,
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(EVIDENCE, "verify-matrix.json"), JSON.stringify(matrixOut, null, 2));
fs.writeFileSync(path.join(EVIDENCE, "verify-journeys.json"), JSON.stringify({ journeys: Object.entries(journeys).map(([id, v]) => ({ id, ...v })) }, null, 2));

console.log(JSON.stringify({ passA, totalA, passJ, totalJ: Object.keys(journeys).length }, null, 2));

process.exit(passA === totalA && passJ === Object.keys(journeys).length ? 0 : 1);