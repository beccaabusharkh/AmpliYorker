import { chromium } from "playwright";

const LIVE = process.env.QA_BASE_URL ?? "https://beccaabusharkh.github.io/AmpliYorker/#/";
const MIN_REQUESTS = Number(process.env.STATSIG_MIN_REQUESTS ?? "1");

async function main(): Promise<void> {
  const statsigUrls: string[] = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("request", (req) => {
    const url = req.url();
    if (/statsig(api)?\.(net|com)/i.test(url)) {
      statsigUrls.push(url);
    }
  });
  await page.goto(LIVE, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(3000);
  await page.goto(LIVE.replace("#/", "#/article/retention-myths"), { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(2000);
  await browser.close();

  if (statsigUrls.length < MIN_REQUESTS) {
    const payload = { pass: false, statsigRequestCount: statsigUrls.length, min: MIN_REQUESTS, live: LIVE };
    if (process.env.STATSIG_NETWORK_SMOKE_ALLOW_ZERO === "true") {
      console.log(JSON.stringify({ ...payload, pass: true, note: "ALLOW_ZERO override" }, null, 2));
      return;
    }
    console.error(JSON.stringify(payload, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ pass: true, statsigRequestCount: statsigUrls.length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});