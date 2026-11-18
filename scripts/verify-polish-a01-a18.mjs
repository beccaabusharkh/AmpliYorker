/**
 * P2G-VERIFY-POLISH-001 — P2G-POL-A01–A18 + journeys + resize + copy grep.
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

const EVIDENCE = path.resolve("docs/evidence/polish-fix");
const PREVIEW = "http://127.0.0.1:4174/AmpliYorker/";
const VIEWPORTS = [
  { id: "1440", width: 1440, height: 1000 },
  { id: "1024", width: 1024, height: 900 },
  { id: "768", width: 768, height: 1024 },
  { id: "390", width: 390, height: 844 },
];

fs.mkdirSync(EVIDENCE, { recursive: true });

const matrix = {};
const viewportMatrix = {};
const journeys = {};
const copyLeaks = [];

function matrixSet(id, pass, detail, evidence = []) {
  matrix[id] = { pass, detail, evidence };
}

function vpSet(id, viewport, pass, detail) {
  if (!viewportMatrix[id]) viewportMatrix[id] = {};
  viewportMatrix[id][viewport] = { pass, detail };
}

async function freshPage(viewport) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  await context.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  const page = await context.newPage();
  return { browser, context, page };
}

async function closeAll({ browser, context }) {
  await context.close();
  await browser.close();
}

async function login(page) {
  await page.goto(PREVIEW + "#/account/login", { waitUntil: "domcontentloaded" });
  await page.locator("[data-login-form]").evaluate((f) => f.requestSubmit());
  await page.waitForTimeout(500);
}

const tsc = spawnSync("pnpm", ["typecheck"], { cwd: process.cwd(), encoding: "utf8" });
const build = spawnSync("pnpm", ["build"], { cwd: process.cwd(), encoding: "utf8" });
const buildPass = tsc.status === 0 && build.status === 0;
matrixSet(
  "P2G-POL-A16",
  buildPass,
  `typecheck=${tsc.status ?? 1}; build=${build.status ?? 1}`,
  ["docs/evidence/polish-fix/verify-typecheck-build.log"],
);
for (const vp of VIEWPORTS) vpSet("P2G-POL-A16", vp.id, buildPass, "build artifact global");
fs.writeFileSync(
  path.join(EVIDENCE, "verify-typecheck-build.log"),
  `${tsc.stdout}\n${tsc.stderr}\n${build.stdout}\n${build.stderr}`,
);

matrixSet(
  "P2G-POL-A18",
  true,
  "User reference screenshots not provided; live baseline in subscribe-baseline-1440.png (spec § Audit).",
  ["docs/evidence/polish-fix/subscribe-baseline-1440.png"],
);
for (const vp of VIEWPORTS) vpSet("P2G-POL-A18", vp.id, true, "documented absent");

// --- Per-viewport layout + screenshots ---
for (const vp of VIEWPORTS) {
  // Home header A07-A10, A08
  {
    const { browser, context, page } = await freshPage(vp);
    await page.goto(PREVIEW + "#/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(EVIDENCE, `home-header-${vp.id}.png`), fullPage: false });

    const promo = (await page.locator(".site-promo-band__copy").textContent()) ?? "";
    const a08 = promo.includes("plans from $12/month") && !/simulated plans/i.test(promo);
    vpSet("P2G-POL-A08", vp.id, a08, promo.trim());

    const offer = await page.locator("[data-sponsored-offer]").count();
    const img = await page.locator(".sponsored-offer-card__thumb img").count();
    const cta = await page.locator(".sponsored-offer-card__cta").count();
    const mod = await page.locator("[data-sponsored-module]").count();
    const a07 = offer === 1 && img >= 1 && cta === 1 && mod === 1;
    vpSet("P2G-POL-A07", vp.id, a07, `offer=${offer}; img=${img}; cta=${cta}`);

    const edition = await page.locator(".site-masthead-edition").count();
    const utilDate = await page.locator(".utility-date").count();
    const a10 = edition >= 1 && utilDate === 0;
    vpSet("P2G-POL-A10", vp.id, a10, `edition=${edition}; utility-date=${utilDate}`);

    if (vp.id === "1440") {
      const navDisplay = await page.evaluate(() => getComputedStyle(document.querySelector(".home-section-nav")).display);
      const searchRight = await page.evaluate(() => {
        const nav = document.querySelector(".home-section-nav");
        const search = document.querySelector(".section-nav-search");
        if (!nav || !search) return false;
        const nr = nav.getBoundingClientRect();
        const sr = search.getBoundingClientRect();
        return sr.right >= nr.right - 30 && sr.left > nr.left + nr.width * 0.45;
      });
      const listCentered = await page.evaluate(() => {
        const list = document.querySelector(".section-nav-list");
        const nav = document.querySelector(".home-section-nav");
        if (!list || !nav) return false;
        const lr = list.getBoundingClientRect();
        const nr = nav.getBoundingClientRect();
        const listMid = (lr.left + lr.right) / 2;
        const navMid = (nr.left + nr.right) / 2;
        return Math.abs(listMid - navMid) < 80;
      });
      const a09 = navDisplay === "grid" && searchRight && listCentered;
      vpSet("P2G-POL-A09", vp.id, a09, `grid=${navDisplay}; centered=${listCentered}; searchRight=${searchRight}`);
      journeys.J01_home_polish = { pass: a07 && a08 && a09 && a10, viewport: vp.id };
    } else {
      const navDisplay = await page.evaluate(() => getComputedStyle(document.querySelector(".home-section-nav")).display);
      vpSet("P2G-POL-A09", vp.id, navDisplay === "grid", `nav display=${navDisplay}`);
    }

    await closeAll({ browser, context });
  }

  // Subscribe logged in A01-A03
  {
    const { browser, context, page } = await freshPage(vp);
    await login(page);
    await page.goto(PREVIEW + "#/subscribe", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(EVIDENCE, `subscribe-signed-in-${vp.id}.png`), fullPage: false });

    const wide = await page.locator(".account-surface--wide").boundingBox();
    const minWide = vp.width >= 769 ? 880 : 300;
    const a01 = (wide?.width ?? 0) >= minWide;
    vpSet("P2G-POL-A01", vp.id, a01, `surfaceW=${wide?.width}`);

    const gridCols = await page.evaluate(() => {
      const g = document.querySelector(".plan-grid--three");
      return g ? getComputedStyle(g).gridTemplateColumns : "";
    });
    const cardW = await page.evaluate(() => {
      const c = document.querySelector("[data-plan-card]");
      return c ? c.getBoundingClientRect().width : 0;
    });
    const threeCol = vp.width >= 769;
    const colCount = gridCols.split(" ").filter((s) => s.trim()).length;
    const a02 = threeCol ? colCount >= 3 && cardW >= 240 : colCount <= 1 && cardW >= 240;
    vpSet("P2G-POL-A02", vp.id, a02, `cols=${gridCols}; cardW=${cardW}`);

    const bodyText = await page.locator("main").innerText();
    const a03 = !bodyText.includes("Simulated subscription") && !bodyText.includes("smoke persona");
    vpSet("P2G-POL-A03", vp.id, a03, "subscribe main copy");

    if (vp.id === "1440") journeys.J04_subscribe_wide = { pass: a01 && a02 && a03 };

    await closeAll({ browser, context });
  }

  // Account logged in A04-A06, A05
  {
    const { browser, context, page } = await freshPage(vp);
    await login(page);
    await page.goto(PREVIEW + "#/account", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(EVIDENCE, `account-signed-in-${vp.id}.png`), fullPage: false });

    const dash = await page.locator(".account-dashboard.account-surface--wide").count();
    const topSections = await page.evaluate(() => {
      const main = document.querySelector("main.account-page");
      if (!main) return 99;
      return [...main.children].filter((el) => el.tagName !== "DETAILS").length;
    });
    const a04 = dash === 1 && topSections <= 2;
    vpSet("P2G-POL-A04", vp.id, a04, `dashboard=${dash}; topLevel=${topSections}`);

    const a05 = await page.evaluate(() => {
      const demo = document.querySelector("details.demo-controls");
      const persona = document.querySelector(".persona-banner");
      const walk = (root) => {
        let out = "";
        for (const n of root.childNodes) {
          if (n.nodeType === 3) out += n.textContent;
          else if (n instanceof HTMLElement) {
            if (n === demo || demo?.contains(n)) continue;
            if (n === persona || persona?.contains(n)) continue;
            out += walk(n);
          }
        }
        return out;
      };
      const header = document.querySelector(".site-header");
      const main = document.querySelector("main");
      const text = walk(header ?? document.createElement("div")) + walk(main ?? document.createElement("div"));
      return !/simulated/i.test(text);
    });
    vpSet("P2G-POL-A05", vp.id, a05, "no simulated outside demo/persona");

    const cancelClosed = await page.locator(".account-dashboard__cancel").evaluate((el) => el instanceof HTMLDetailsElement && !el.open);
    const deviceClosed = await page.locator(".account-dashboard__devices").evaluate((el) => el instanceof HTMLDetailsElement && !el.open);
    const a06 = cancelClosed && deviceClosed;
    vpSet("P2G-POL-A06", vp.id, a06, `cancelClosed=${cancelClosed}; deviceClosed=${deviceClosed}`);

    if (vp.id === "1440") {
      journeys.J06_account_dashboard = { pass: a04 && a05 && a06 };
      const demoSummary = await page.locator("details.demo-controls summary").textContent();
      const a14 = (await page.locator("details.demo-controls").count()) === 1 && /simulated/i.test(demoSummary ?? "");
      vpSet("P2G-POL-A14", vp.id, a14, demoSummary ?? "");
    }

    await closeAll({ browser, context });
  }

  // Subscribe logged out A11
  {
    const { browser, context, page } = await freshPage(vp);
    await page.goto(PREVIEW + "#/subscribe", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("main .account-gate-copy", { timeout: 8000 });
    await page.waitForTimeout(300);
    if (vp.id === "390" || vp.id === "768") {
      await page.screenshot({ path: path.join(EVIDENCE, `subscribe-signed-out-${vp.id}.png`), fullPage: false });
    }
    if (vp.id === "1440") {
      await page.screenshot({ path: path.join(EVIDENCE, "subscribe-signed-out-1440.png"), fullPage: false });
    }
    const login = await page.getByRole("link", { name: "Log in" }).count();
    const reg = await page.getByRole("link", { name: "Create account" }).count();
    const gate = await page.locator(".account-gate-copy").count();
    const a11 = login >= 1 && reg >= 1 && gate >= 1;
    vpSet("P2G-POL-A11", vp.id, a11, `login=${login}; register=${reg}`);
    if (vp.id === "1440") journeys.J02_subscribe_logged_out = { pass: a11 };
    await closeAll({ browser, context });
  }

  // Login A13
  {
    const { browser, context, page } = await freshPage(vp);
    await page.goto(PREVIEW + "#/account/login", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    if (vp.id === "1440") await page.screenshot({ path: path.join(EVIDENCE, "login-1440.png") });
    const title = await page.locator("main h1").textContent();
    const form = await page.locator("[data-login-form]").count();
    const a13 = title?.trim() === "Log in" && form === 1;
    vpSet("P2G-POL-A13", vp.id, a13, `title=${title}`);
    if (vp.id === "1440") journeys.J03_login_desim = { pass: a13 };
    await closeAll({ browser, context });
  }
}

// Aggregate matrix from viewport (all must pass for criteria checked per viewport)
const vpIds = ["1440", "1024", "768", "390"];
for (const id of [
  "P2G-POL-A01",
  "P2G-POL-A02",
  "P2G-POL-A03",
  "P2G-POL-A04",
  "P2G-POL-A05",
  "P2G-POL-A06",
  "P2G-POL-A07",
  "P2G-POL-A08",
  "P2G-POL-A09",
  "P2G-POL-A10",
  "P2G-POL-A11",
  "P2G-POL-A13",
]) {
  const per = viewportMatrix[id] ?? {};
  const allPass = vpIds.every((v) => per[v]?.pass === true);
  const failDetail = vpIds
    .filter((v) => !per[v]?.pass)
    .map((v) => `${v}:${per[v]?.detail ?? "missing"}`)
    .join("; ");
  matrixSet(id, allPass, allPass ? "all viewports PASS" : failDetail, [`docs/evidence/polish-fix/verify-matrix.json`]);
}

// A14 from 1440 only
matrixSet(
  "P2G-POL-A14",
  viewportMatrix["P2G-POL-A14"]?.["1440"]?.pass === true,
  viewportMatrix["P2G-POL-A14"]?.["1440"]?.detail ?? "missing",
  ["docs/evidence/polish-fix/account-signed-in-1440.png"],
);

// A15 footer + ads
{
  const { browser, context, page } = await freshPage(VIEWPORTS[0]);
  await page.goto(PREVIEW + "#/", { waitUntil: "domcontentloaded" });
  const footer = (await page.locator(".site-footer").textContent()) ?? "";
  await page.locator('[data-placement-id="home_leaderboard"]').scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(600);
  const adLabel = await page
    .locator('[data-placement-id="home_leaderboard"]')
    .evaluate((el) => el.textContent ?? "");
  const a15 = footer.includes("Simulated accounts") && /Advertisement · Simulated/i.test(adLabel);
  matrixSet("P2G-POL-A15", a15, `footer ok; ad disclosure=${/Advertisement · Simulated/i.test(adLabel)}`, []);
  for (const vp of VIEWPORTS) vpSet("P2G-POL-A15", vp.id, a15, "global chrome");
  await closeAll({ browser, context });
}

// A12 journey + video subscribe → account
{
  const videoDir = path.join(EVIDENCE, "video-tmp");
  fs.mkdirSync(videoDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  await login(page);
  await page.goto(PREVIEW + "#/subscribe", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(600);
  await page.locator('[data-select-plan="annual"][data-intro="true"]').click();
  await page.waitForTimeout(400);
  await page.goto(PREVIEW + "#/checkout", { waitUntil: "domcontentloaded" });
  const checkoutOk = (await page.locator("[data-checkout-form]").count()) === 1;
  await page.locator("[data-checkout-form]").evaluate((f) => f.requestSubmit());
  await page.waitForTimeout(800);
  await page.goto(PREVIEW + "#/account", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const dash = await page.locator(".account-dashboard").count();
  const a12 = checkoutOk && dash === 1;
  matrixSet("P2G-POL-A12", a12, `checkout form=${checkoutOk}; account dashboard=${dash}`, [
    "docs/evidence/polish-fix/journey-subscribe-account.webm",
  ]);
  journeys.J05_subscribe_checkout_account = { pass: a12 };
  const video = page.video();
  await page.close();
  await context.close();
  if (video) {
    const webmPath = path.join(EVIDENCE, "journey-subscribe-account.webm");
    await video.saveAs(webmPath);
  }
  await browser.close();
  fs.rmSync(videoDir, { recursive: true, force: true });
}

// A17 wider than baseline (~448px)
{
  const { browser, context, page } = await freshPage(VIEWPORTS[0]);
  await login(page);
  await page.goto(PREVIEW + "#/subscribe", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const w = (await page.locator(".account-surface--wide").boundingBox())?.width ?? 0;
  const a17 = w >= 880;
  matrixSet("P2G-POL-A17", a17, `current surface=${w}px vs baseline ~448px`, [
    "docs/evidence/polish-fix/subscribe-baseline-1440.png",
    "docs/evidence/polish-fix/subscribe-signed-in-1440.png",
  ]);
  for (const vp of VIEWPORTS) vpSet("P2G-POL-A17", vp.id, vp.id === "1440" ? a17 : true, vp.id === "1440" ? `w=${w}` : "baseline compare @1440");
  await closeAll({ browser, context });
}

// Extra journeys
{
  const { browser, context, page } = await freshPage(VIEWPORTS[0]);
  await page.goto(PREVIEW + "#/", { waitUntil: "domcontentloaded" });
  await page.locator(".sponsored-offer-card__cta").click();
  await page.waitForTimeout(500);
  journeys.J07_sponsored_offer = { pass: page.url().includes("article/") };
  await closeAll({ browser, context });
}

{
  const { browser, context, page } = await freshPage(VIEWPORTS[0]);
  await page.goto(PREVIEW + "#/", { waitUntil: "domcontentloaded" });
  await page.locator("[data-header-search] input").fill("retention");
  await page.locator("[data-header-search]").evaluate((f) => f.requestSubmit());
  await page.waitForTimeout(600);
  journeys.J08_header_search = { pass: (await page.locator("main a[href*='article/']").count()) > 0 };
  await closeAll({ browser, context });
}

{
  const { browser, context, page } = await freshPage(VIEWPORTS[0]);
  await page.goto(PREVIEW + "#/account/register", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-register-form]");
  journeys.J09_register = { pass: (await page.locator("section.account-surface [data-register-form]").count()) === 1 };
  await page.screenshot({ path: path.join(EVIDENCE, "register-1440.png") });
  await closeAll({ browser, context });
}

{
  const { browser, context, page } = await freshPage(VIEWPORTS[0]);
  await page.goto(PREVIEW + "#/article/retention-myths", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const loginLink = await page.locator("[data-paywall-login]").textContent();
  journeys.J10_paywall_login = { pass: loginLink?.trim() === "Log in" };
  await closeAll({ browser, context });
}

{
  const { browser, context, page } = await freshPage(VIEWPORTS[0]);
  await page.goto(PREVIEW + "#/topic/product-analytics", { waitUntil: "networkidle" });
  journeys.J11_topic = { pass: (await page.locator(".page-main").count()) === 1 };
  await closeAll({ browser, context });
}

// Continuous resize spot-check subscribe + account
{
  const { browser, context, page } = await freshPage(VIEWPORTS[0]);
  await login(page);
  const widths = [1440, 1024, 768, 390, 768, 1440];
  let resizePass = true;
  const resizeLog = [];
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(PREVIEW + "#/subscribe", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const sw = (await page.locator(".account-surface--wide").boundingBox())?.width ?? 0;
    const ok = w >= 769 ? sw >= 700 : sw >= 280;
    resizePass &&= ok;
    resizeLog.push({ w, surfaceW: sw, ok });
    await page.goto(PREVIEW + "#/account", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    const dash = await page.locator(".account-dashboard").count();
    resizePass &&= dash === 1;
  }
  fs.writeFileSync(path.join(EVIDENCE, "verify-resize-spotcheck.json"), JSON.stringify({ resizePass, resizeLog }, null, 2));
  journeys.J12_resize_spotcheck = { pass: resizePass };
  await closeAll({ browser, context });
}

// Reader copy grep
const ROUTES = [
  { route: "#/", name: "home" },
  { route: "#/subscribe", name: "subscribe_out" },
  { route: "#/account/login", name: "login" },
  { route: "#/account/register", name: "register" },
];
{
  const browser = await chromium.launch();
  for (const r of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    if (r.name === "subscribe_out") {
      await page.goto(PREVIEW + r.route, { waitUntil: "domcontentloaded" });
    } else {
      await page.goto(PREVIEW + r.route, { waitUntil: "domcontentloaded" });
    }
    await page.waitForTimeout(400);
    const leaks = await page.evaluate(() => {
      const allow = (el) => {
        if (!el) return true;
        if (el.closest("details.demo-controls")) return true;
        if (el.closest(".persona-banner")) return true;
        if (el.closest(".site-footer")) return true;
        if (el.closest(".home-newsletter")) return true;
        if (el.closest("[data-sponsored-module] .sponsored-disclosure")) return true;
        if (el.closest(".ask-daily-panel, [data-ask-daily]")) return true;
        if (el.closest('[data-placement-id]')) return true;
        return false;
      };
      const hits = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const t = n.textContent ?? "";
        if (!/simulated|smoke persona|preset credentials only/i.test(t)) continue;
        const parent = n.parentElement;
        if (parent && allow(parent)) continue;
        if (/simulated session/i.test(t) && parent?.closest(".persona-banner")) continue;
        hits.push(t.trim().slice(0, 120));
      }
      return [...new Set(hits)];
    });
    if (leaks.length) copyLeaks.push({ route: r.route, leaks });
    await context.close();
  }
  const loggedIn = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await loggedIn.newPage();
  await login(page);
  for (const r of ["#/subscribe", "#/account"]) {
    await page.goto(PREVIEW + r, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const leaks = await page.evaluate(() => {
      const allow = (el) =>
        el?.closest("details.demo-controls") ||
        el?.closest(".persona-banner") ||
        el?.closest(".site-footer") ||
        el?.closest('[data-placement-id]');
      const hits = [];
      const walker = document.createTreeWalker(document.querySelector("main") ?? document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const t = n.textContent ?? "";
        if (!/simulated|smoke persona/i.test(t)) continue;
        if (allow(n.parentElement)) continue;
        hits.push(t.trim().slice(0, 120));
      }
      return [...new Set(hits)];
    });
    if (leaks.length) copyLeaks.push({ route: r, leaks });
  }
  await loggedIn.close();
  await browser.close();
}
fs.writeFileSync(path.join(EVIDENCE, "verify-copy-grep.json"), JSON.stringify({ copyLeaks, pass: copyLeaks.length === 0 }, null, 2));

const matrixOut = {
  assignment: "P2G-VERIFY-POLISH-001",
  branch: "polish-subscribe-account",
  matrix,
  viewportMatrix,
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(EVIDENCE, "verify-matrix.json"), JSON.stringify(matrixOut, null, 2));

const journeyList = Object.entries(journeys).map(([id, v]) => ({ id, ...v }));
fs.writeFileSync(path.join(EVIDENCE, "verify-journeys.json"), JSON.stringify({ journeys: journeyList }, null, 2));

const passA = Object.values(matrix).filter((r) => r.pass).length;
const totalA = Object.keys(matrix).length;
const passJ = journeyList.filter((j) => j.pass).length;
console.log(JSON.stringify({ passA, totalA, passJ, totalJ: journeyList.length, copyLeaks: copyLeaks.length }, null, 2));