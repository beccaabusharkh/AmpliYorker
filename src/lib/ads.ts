import adsData from "../data/ads.json";
import { trackDemoEvent } from "./analytics/track";
import { showToast } from "../ui/toast";

export type AdCampaign = {
  id: string;
  placementId: string;
  label: string;
  body: string;
  cta: string;
};

const campaigns = adsData as AdCampaign[];

export function getAdByPlacement(placementId: string): AdCampaign | undefined {
  return campaigns.find((ad) => ad.placementId === placementId);
}

export function renderAdUnit(ad: AdCampaign, extraClass = ""): HTMLElement {
  const el = document.createElement("aside");
  el.className = `ad-slot ${extraClass}`.trim();
  el.dataset.placementId = ad.placementId;
  el.dataset.adId = ad.id;
  el.innerHTML = `
    <p class="ad-slot__label">${escapeHtml(ad.label)}</p>
    <p class="ad-slot__body">${escapeHtml(ad.body)}</p>
    <button type="button" class="ad-slot__cta" data-ad-cta>${escapeHtml(ad.cta)}</button>
  `;
  el.querySelector("[data-ad-cta]")?.addEventListener("click", () => {
    showToast("Simulated ad engagement");
    const impressionId = crypto.randomUUID();
    trackDemoEvent("Ad Revenue Recorded", {
      revenue_record_id: crypto.randomUUID(),
      ad_impression_id: impressionId,
      ad_id: ad.id,
      placement_id: ad.placementId,
      revenue_usd: 0.12,
      currency: "USD",
      revenue_basis: "simulated_engagement",
    });
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          trackDemoEvent("Advertisement Viewable", {
            ad_impression_id: crypto.randomUUID(),
            ad_id: ad.id,
            placement_id: ad.placementId,
            article_id: null,
          });
          observer.disconnect();
        }
      });
    },
    { threshold: [0.5] },
  );
  observer.observe(el);
  return el;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}