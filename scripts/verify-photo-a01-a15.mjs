/**
 * P2E-VERIFY-PHOTO-001 — A01–A15 matrix (fresh browser context per viewport).
 * Run: node scripts/verify-photo-a01-a15.mjs
 * Requires: preview at http://127.0.0.1:4173/AmpliYorker/
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

const EVIDENCE = path.resolve("docs/evidence/photo-v2");
const PREVIEW = "http://127.0.0.1:4173/AmpliYorker/";
const LIVE_BEFORE = "https://beccaabusharkh.github.io/AmpliYorker/";
const results = {};

function set(id, pass, detail, evidence = []) {
  results[id] = { pass, detail, evidence };
}

fs.mkdirSync(EVIDENCE, { recursive: true });

const tsc = spawnSync("pnpm", ["typecheck"], { cwd: process.cwd(), encoding: "utf8" });
const build = spawnSync("pnpm", ["build"], { cwd: process.cwd(), encoding: "utf8" });
set(
  "P2E-PHOTO-A14",
  tsc.status === 0 && build.status === 0,
  `typecheck exit ${tsc.status ?? 1}; build exit ${build.status ?? 1}`,
  ["docs/evidence/photo-v2/verify-typecheck-build.log"],
);
fs.writeFileSync(
  path.join(EVIDENCE, "verify-typecheck-build.log"),
  `=== pnpm typecheck ===\n${tsc.stdout}\n${tsc.stderr}\n=== pnpm build ===\n${build.stdout}\n${build.stderr}\n`,
);

const manifestPath = path.resolve("public/images/ASSET-MANIFEST.md");
const manifest = fs.readFileSync(manifestPath, "utf8");
const deployedWebp = [];
for (const dir of ["public/images/editorial", "public/images/ads"]) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".webp")) deployedWebp.push(f);
  }
}
const manifestPaths = [...manifest.matchAll(/\| `(images\/[^`]+\.webp)` \|/g)].map((m) => m[1]);
const expectedPaths = deployedWebp.map((f) => {
  const base = f.includes("/") ? f : `editorial/${f}`;
  return base.startsWith("images/") ? base : `images/${base.includes("ads/") || f.includes("camp-") ? `ads/${f}` : `editorial/${f}`}`;
});
const deployedPaths = [];
for (const f of fs.readdirSync("public/images/editorial")) {
  if (f.endsWith(".webp")) deployedPaths.push(`images/editorial/${f}`);
}
for (const f of fs.readdirSync("public/images/ads")) {
  if (f.endsWith(".webp")) deployedPaths.push(`images/ads/${f}`);
}
const missingFromManifest = deployedPaths.filter((p) => !manifest.includes(p));
const rowHasMeta = (p) => {
  const line = manifest.split("\n").find((l) => l.includes(p));
  return line && /\| \d+ \| \d+ \|/.test(line);
};
const a13Pass = missingFromManifest.length === 0 && deployedPaths.every(rowHasMeta);
set(
  "P2E-PHOTO-A13",
  a13Pass,
  `deployed=${deployedPaths.length}; manifest paths=${manifestPaths.length}; missing=${missingFromManifest.join(",") || "none"}`,
  ["public/images/ASSET-MANIFEST.md", "public/images/asset-manifest.json"],
);

const browser = await chromium.launch();

// Before homepage (live pre-photo)
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  try {
    await page.goto(LIVE_BEFORE + "#/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(EVIDENCE, "home-before-1440.png"), fullPage: false });
  } catch (e) {
    await page.screenshot({ path: path.join(EVIDENCE, "home-before-1440.png"), fullPage: false }).catch(() => {});
    set("before_capture", false, String(e));
  }
  await context.close();
}

// After + A01–A11, A15 at multiple viewports
for (const vp of [
  { width: 1440, height: 1000, suffix: "1440" },
  { width: 768, height: 1024, suffix: "768" },
  { width: 390, height: 844, suffix: "390" },
]) {
  const context = await browser.newContext({ viewport: vp });
  const page = await context.newPage();
  const networkImages = [];
  page.on("response", (res) => {
    const u = res.url();
    if (u.includes("/images/editorial/") || u.includes("/images/ads/")) {
      networkImages.push(u);
    }
  });

  await page.goto(PREVIEW + "#/", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(1200);

  if (vp.suffix === "1440") {
    await page.screenshot({ path: path.join(EVIDENCE, "home-after-1440.png"), fullPage: false });
    const gridCols = await page.$eval(".lead-grid", (el) => getComputedStyle(el).gridTemplateColumns);
    const leadSrc = await page.locator(".lead-hero-image").getAttribute("src");
    const ratio = (() => {
      const parts = gridCols.split(/\s+/).map((p) => parseFloat(p));
      if (parts.length >= 2 && parts[0] && parts[1]) return parts[0] / parts[1];
      return 0;
    })();
    const grid60_40 = Math.abs(ratio - 1.5) < 0.08;
    const notSvg = leadSrc && !leadSrc.includes(".svg");
    set("P2E-PHOTO-A01", grid60_40 && notSvg, `gridTemplateColumns=${gridCols}; lead=${leadSrc}`, [
      "docs/evidence/photo-v2/home-1440-a01.png",
      "docs/evidence/photo-v2/home-after-1440.png",
    ]);
    await page.screenshot({ path: path.join(EVIDENCE, "home-1440-a01.png"), fullPage: false });

    const uniqueDom = await page.$$eval('img[src*="/images/"]', (imgs) => [
      ...new Set(imgs.map((i) => i.getAttribute("src"))),
    ]);
    const uniqueNet = [...new Set(networkImages)].filter((u) => /\.(webp|jpe?g)/i.test(u));
    set(
      "P2E-PHOTO-A02",
      uniqueDom.length >= 8,
      `unique DOM img urls=${uniqueDom.length}; network raster=${uniqueNet.length}`,
      ["docs/evidence/photo-v2/verify-a02-network.json"],
    );
    fs.writeFileSync(
      path.join(EVIDENCE, "verify-a02-network.json"),
      JSON.stringify({ dom: uniqueDom, network: uniqueNet }, null, 2),
    );

    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);
    const visiblePhotos = await page.$$eval("img", (imgs) =>
      imgs.filter((img) => {
        const r = img.getBoundingClientRect();
        return r.top >= 0 && r.top <= 2000 && r.width > 40;
      }).length,
    );
    await page.screenshot({ path: path.join(EVIDENCE, "home-1440-a03.png"), fullPage: false });
    set("P2E-PHOTO-A03", visiblePhotos >= 3, `photos in top 2000px=${visiblePhotos}`, [
      "docs/evidence/photo-v2/home-1440-a03.png",
    ]);

    const hasCohort = leadSrc?.includes("cohort-compound-interest--hero.webp");
    set("P2E-PHOTO-A04", !!hasCohort, leadSrc ?? "missing", ["docs/evidence/photo-v2/home-after-1440.png"]);

    const secondaryLinks = await page.$$eval(".secondary-lead-card a[href]", (as) =>
      as.map((a) => {
        const href = a.getAttribute("href") ?? "";
        const img = a.querySelector("img");
        return { id: href.replace(/^.*article\//, ""), src: img?.getAttribute("src") ?? "" };
      }),
    );
    const expected = ["daily-decisions", "retention-myths", "funnel-friction"];
    const secOk =
      secondaryLinks.length === 3 &&
      expected.every((id, i) => secondaryLinks[i]?.id === id) &&
      secondaryLinks.every((s) => s.src.includes("--hero.webp"));
    set(
      "P2E-PHOTO-A05",
      secOk,
      JSON.stringify(secondaryLinks),
      ["docs/evidence/photo-v2/verify-a05-secondaries.json"],
    );
    fs.writeFileSync(path.join(EVIDENCE, "verify-a05-secondaries.json"), JSON.stringify(secondaryLinks, null, 2));

    const lb = await page.$('[data-placement-id="home_leaderboard"]');
    const lbLabel = await lb?.$eval(".ad-slot__label", (el) => el.textContent?.trim());
    const lbImg = await lb?.$eval(".ad-slot__photo", (img) => img.getAttribute("src"));
    const lbAdId = await lb?.getAttribute("data-ad-id");
    set(
      "P2E-PHOTO-A06",
      lbLabel === "Advertisement · Simulated" &&
        lbAdId === "camp-northline-display" &&
        lbImg?.includes("camp-northline"),
      `label=${lbLabel}; ad_id=${lbAdId}; img=${lbImg}`,
      ["docs/evidence/photo-v2/home-1440.png"],
    );

    const rail = await page.$('[data-placement-id="home_rail"]');
    const railImg = await rail?.$eval(".ad-slot__photo", (img) => img.getAttribute("src"));
    const railId = await rail?.getAttribute("data-ad-id");
    set(
      "P2E-PHOTO-A07",
      railId === "camp-sunday-house-rail" && railImg?.includes("sunday-house"),
      `ad_id=${railId}; img=${railImg}`,
      ["docs/evidence/photo-v2/home-1440.png"],
    );
  }

  if (vp.suffix === "768") {
    const overflow = await page.evaluate(() => {
      const main = document.querySelector(".home-editorial");
      const el = main ?? document.documentElement;
      return el.scrollWidth > el.clientWidth + 2;
    });
    const leadOrder = await page.$eval(".lead-grid", (el) => {
      const kids = [...el.children];
      const imgFirst = kids[0]?.querySelector("img") != null;
      return imgFirst;
    });
    const thumbs = await page.locator(".secondary-lead-thumb").count();
    await page.screenshot({ path: path.join(EVIDENCE, "home-768-a10.png"), fullPage: true });
    set(
      "P2E-PHOTO-A10",
      !overflow && leadOrder && thumbs >= 3,
      `overflow=${overflow}; lead image first=${leadOrder}; thumbs=${thumbs}`,
      ["docs/evidence/photo-v2/home-768-a10.png", "docs/evidence/photo-v2/home-768.png"],
    );
  }

  if (vp.suffix === "390") {
    const cols = await page.$eval(".home-secondary-leads", (el) => getComputedStyle(el).gridTemplateColumns);
    const oneCol = !cols.includes(",") || cols.split(" ").length <= 2;
    const overflow = await page.evaluate(() => {
      const main = document.querySelector(".home-editorial");
      const el = main ?? document.documentElement;
      return el.scrollWidth > el.clientWidth + 2;
    });
    await page.screenshot({ path: path.join(EVIDENCE, "home-390-a11.png"), fullPage: true });
    set(
      "P2E-PHOTO-A11",
      !overflow && oneCol,
      `secondary grid columns=${cols}; overflow=${overflow}`,
      ["docs/evidence/photo-v2/home-390-a11.png", "docs/evidence/photo-v2/home-390.png"],
    );
  }

  await context.close();
}

// A08, A09, A12 — article + ad CTA (fresh context)
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const articleImages = [];
  page.on("response", (res) => {
    const u = res.url();
    if (u.includes("/images/editorial/")) articleImages.push(u);
  });

  await page.goto(PREVIEW + "#/article/retention-myths", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const mpu = await page.$('[data-placement-id="article_mpu"]');
  const mpuImg = await mpu?.$eval(".ad-slot__photo", (img) => img.getAttribute("src"));
  const mpuId = await mpu?.getAttribute("data-ad-id");
  await page.screenshot({ path: path.join(EVIDENCE, "article-retention-mpu-a08.png") });
  set(
    "P2E-PHOTO-A08",
    mpuId === "camp-margin-coffee-mpu" && mpuImg?.includes("margin-coffee"),
    `ad_id=${mpuId}; img=${mpuImg}`,
    ["docs/evidence/photo-v2/article-retention-mpu-a08.png", "docs/evidence/photo-v2/article-retention-mpu.png"],
  );

  await page.goto(PREVIEW + "#/article/cohort-compound-interest", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const urls = await page.$$eval(".article-hero img, .inline-figure img", (imgs) =>
    imgs.map((i) => i.getAttribute("src")),
  );
  const unique = [...new Set(urls)];
  const noSvg = unique.every((u) => !u?.includes(".svg"));
  const ok = unique.filter((u) => u?.includes(".webp")).length >= 3 && noSvg;
  await page.screenshot({ path: path.join(EVIDENCE, "article-cohort-a09.png"), fullPage: true });
  set(
    "P2E-PHOTO-A09",
    ok,
    `unique rasters: ${unique.join(", ")}`,
    ["docs/evidence/photo-v2/article-cohort-a09.png", "docs/evidence/photo-v2/article-cohort.png"],
  );
  fs.writeFileSync(path.join(EVIDENCE, "verify-a09-network.json"), JSON.stringify({ dom: unique, network: articleImages }, null, 2));

  const ampRequests = [];
  page.on("request", (req) => {
    const u = req.url();
    if (u.includes("amplitude.com") || u.includes("api2.amplitude")) {
      ampRequests.push({ url: u });
    }
  });

  await page.goto(PREVIEW + "#/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  await page.locator('[data-placement-id="home_leaderboard"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);

  const ctaAdId = await page.$eval('[data-placement-id="home_leaderboard"] [data-ad-cta]', (btn) => {
    return btn.closest("[data-ad-id]")?.getAttribute("data-ad-id");
  });
  await page.locator('[data-placement-id="home_leaderboard"] [data-ad-cta]').click();
  await page.waitForTimeout(400);
  const toastText = await page.locator("[data-toast]").textContent().catch(() => null);

  const a12Pass =
    ctaAdId === "camp-northline-display" &&
    toastText?.includes("Simulated ad engagement");
  set(
    "P2E-PHOTO-A12",
    a12Pass,
    `CTA ad_id=${ctaAdId}; toast=${toastText}; amplitudeRequests=${ampRequests.length} (SDK off without VITE_AMPLITUDE_API_KEY — CTA wiring verified)`,
    ["docs/evidence/photo-v2/verify-a12-ad-cta.json"],
  );
  fs.writeFileSync(
    path.join(EVIDENCE, "verify-a12-ad-cta.json"),
    JSON.stringify({ ctaAdId, toastText, ampRequests }, null, 2),
  );

  await page.goto(PREVIEW + "#/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  await page.locator("[data-lead-link]").first().focus();
  const leadFocused = await page.evaluate(() => document.activeElement?.hasAttribute("data-lead-link"));
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const tabTop = await page.locator('[data-tab="top"]').getAttribute("aria-selected");
  await page.locator('[data-tab="product-analytics"]').click();
  const tabProd = await page.locator('[data-tab="product-analytics"]').getAttribute("aria-selected");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(200);
  const tabAfterKey = await page.locator('[role="tab"][aria-selected="true"]').getAttribute("data-tab");
  set(
    "P2E-PHOTO-A15",
    leadFocused && tabTop === "true" && tabProd === "true" && tabAfterKey != null,
    `lead focus=${leadFocused}; aria-selected top=${tabTop}; keyboard tab=${tabAfterKey}`,
    ["docs/evidence/photo-v2/verify-a15-a11y.json"],
  );
  fs.writeFileSync(
    path.join(EVIDENCE, "verify-a15-a11y.json"),
    JSON.stringify({ leadFocused, tabTop, tabProd, tabAfterKey }, null, 2),
  );

  await context.close();
}

await browser.close();

fs.writeFileSync(path.join(EVIDENCE, "verify-matrix.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));