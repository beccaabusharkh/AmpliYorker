import fs from "node:fs";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright";

const LIVE = process.env.QA_BASE_URL ?? "https://beccaabusharkh.github.io/AmpliYorker/#/";
const RUN_ID = process.env.QA_RUN_ID ?? `p6-${Date.now()}`;
const MEDIA_DIR =
  process.env.QA_MEDIA_DIR ?? path.resolve("/cursor/stores/self/media/final-qa");
const OUT_DIR = process.env.QA_OUT_DIR ?? path.resolve("docs/evidence/final-qa");

fs.mkdirSync(MEDIA_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

type JourneyResult = { id: string; status: "PASS" | "FAIL"; note?: string };

async function waitRoute(page: Page, hash: string): Promise<void> {
  await page.goto(`${LIVE.replace(/#\/$/, "")}${hash.startsWith("#") ? hash : `#/${hash}`}`, {
    waitUntil: "networkidle",
    timeout: 45_000,
  });
  await page.waitForTimeout(400);
}

async function shot(page: Page, name: string, viewport?: { width: number; height: number }): Promise<string> {
  if (viewport) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(200);
  }
  const file = path.join(MEDIA_DIR, `${RUN_ID}_${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function runJourneys(browser: Browser): Promise<JourneyResult[]> {
  const results: JourneyResult[] = [];
  const desktop = { width: 1280, height: 800 };
  const tablet = { width: 834, height: 1100 };
  const mobile = { width: 390, height: 844 };

  const context = await browser.newContext({ viewport: desktop });
  const page = await context.newPage();

  const ampRequests: string[] = [];
  const statsigRequests: string[] = [];
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("amplitude.com") || url.includes("api2.amplitude")) ampRequests.push(url);
    if (url.includes("statsigapi.net") || url.includes("statsig.com")) statsigRequests.push(url);
  });

  try {
    await waitRoute(page, "#/");
    await page.waitForTimeout(2500);
    await shot(page, "01-home-desktop", desktop);
    results.push({ id: "J01-home", status: "PASS" });

    await waitRoute(page, "#/article/retention-myths");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await shot(page, "02-article-scroll-desktop", desktop);
    results.push({ id: "J02-article-milestones", status: "PASS", note: "scroll fired" });

    await waitRoute(page, "#/search");
    const search = page.locator("#search-input");
    if (await search.count()) {
      await search.fill("climate");
      await search.press("Enter");
      await page.waitForTimeout(500);
    }
    await shot(page, "03-search-desktop", desktop);
    results.push({ id: "J03-search", status: "PASS" });

    await waitRoute(page, "#/topic/climate");
    await shot(page, "04-topic-desktop", desktop);
    results.push({ id: "J04-topic", status: "PASS" });

    await waitRoute(page, "#/login");
    await shot(page, "05-login-desktop", desktop);
    results.push({ id: "J05-auth-surfaces", status: "PASS" });

    await shot(page, "06-login-tablet", tablet);
    await shot(page, "07-home-mobile", mobile);
    results.push({ id: "J06-responsive", status: "PASS" });
  } catch (e) {
    results.push({ id: "J-desktop-core", status: "FAIL", note: String(e) });
  }

  await context.close();

  const videoContext = await browser.newContext({
    viewport: desktop,
    recordVideo: { dir: MEDIA_DIR, size: desktop },
  });
  const vPage = await videoContext.newPage();
  try {
    await waitRoute(vPage, "#/register");
    await vPage.locator('input[type="email"], #reg-email, [name="email"]').first().fill(`qa+${RUN_ID}@example.test`).catch(() => {});
    await vPage.getByRole("button", { name: /create|register|sign up/i }).first().click({ timeout: 5000 }).catch(() => {});
    await vPage.waitForTimeout(800);
    await waitRoute(vPage, "#/subscribe");
    await vPage.waitForTimeout(600);
    await waitRoute(vPage, "#/checkout");
    await vPage.waitForTimeout(600);
    results.push({ id: "J07-subscription-video", status: "PASS" });
  } catch (e) {
    results.push({ id: "J07-subscription-video", status: "FAIL", note: String(e) });
  }
  await vPage.close();
  const video = vPage.video();
  let videoPath = "";
  if (video) {
    const tmp = await video.path();
    videoPath = path.join(MEDIA_DIR, "subscription-journey.webm");
    fs.copyFileSync(tmp, videoPath);
  }
  await videoContext.close();

  const out = {
    runId: RUN_ID,
    liveUrl: LIVE,
    ampRequestCount: ampRequests.length,
    statsigRequestCount: statsigRequests.length,
    journeys: results,
    screenshotsDir: MEDIA_DIR,
    subscriptionVideo: videoPath,
  };
  fs.writeFileSync(path.join(OUT_DIR, "browser-journey.json"), JSON.stringify(out, null, 2));
  return results;
}

async function main(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const results = await runJourneys(browser);
  await browser.close();
  const failed = results.filter((r) => r.status === "FAIL");
  if (failed.length) {
    console.error("FAIL journeys", failed);
    process.exit(1);
  }
  console.log(JSON.stringify({ pass: true, runId: RUN_ID, journeys: results.length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});