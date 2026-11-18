import { getAdByPlacement, renderAdUnit } from "../lib/ads";
import { getAllArticles, getFeaturedArticle, formatTopicLabel } from "../lib/articles";
import { RETENTION_COPY } from "../lib/statsig/catalog";
import { getHomeRecommendationVariant, getRetentionTreatmentVariant } from "../lib/statsig/evaluate";
import { trackDemoEvent } from "../lib/analytics/track";
import { shouldShowRetentionOffer } from "../lib/session";
import { navigateToHash } from "../lib/router";
import { baseUrl } from "../lib/paths";

type HomeTab = "top" | "product-analytics" | "experimentation" | "podcasts";

const TAB_LABELS: Record<HomeTab, string> = {
  top: "Top Stories",
  "product-analytics": "Product Analytics",
  experimentation: "Experimentation",
  podcasts: "Podcasts",
};

function filterForTab(tab: HomeTab) {
  const all = getAllArticles().filter((item) => !item.sponsored);
  switch (tab) {
    case "product-analytics":
      return all.filter((item) => item.topic === "product-analytics");
    case "experimentation":
      return all.filter((item) => item.topic === "experimentation");
    case "podcasts":
      return all.filter((item) => item.podcast);
    default:
      return all;
  }
}

export function renderHomePage(): HTMLElement {
  const article = getFeaturedArticle();
  const secondary = getAllArticles()
    .filter((item) => item.id !== article.id && !item.sponsored)
    .slice(0, 3);
  const sponsoredStories = getAllArticles().filter((item) => item.sponsored);
  const podcastFeature =
    getAllArticles().find((item) => item.podcast && item.id !== article.id) ??
    getAllArticles().find((item) => item.podcast);

  const recVariant = getHomeRecommendationVariant("home-latest");
  const retentionOffer = shouldShowRetentionOffer();
  const retentionVariant = getRetentionTreatmentVariant("home-retention");
  const retentionCopy = RETENTION_COPY[retentionVariant];

  const main = document.createElement("main");
  main.className = "page-main home-editorial";
  const heroSrc = article.heroImage
    ? `${baseUrl}${article.heroImage.src}`
    : `${baseUrl}images/editorial/hero-placeholder.svg`;

  main.innerHTML = `
    <div class="home-leaderboard-wrap" data-leaderboard-slot></div>
    <div class="home-editorial-grid">
      <div class="home-primary-column">
        ${
          retentionOffer
            ? `<section class="retention-module home-retention">
          <h3>${retentionCopy.title}</h3>
          <p>${retentionCopy.body}</p>
          <p><a href="#/subscribe" data-retention-sub>View simulated introductory offers</a></p>
        </section>`
            : ""
        }
        <section class="home-lead-package" data-component="home-lead">
          ${article.kicker ? `<p class="home-kicker">${article.kicker}</p>` : ""}
          <div class="lead-grid">
            <a class="lead-hero-link" href="#/article/${encodeURIComponent(article.id)}" data-lead-link>
              <img class="lead-hero-image" src="${heroSrc}" alt="${escapeAttr(article.headline)}" width="960" height="640" />
            </a>
            <div class="lead-copy">
              <h2 class="lead-headline"><a href="#/article/${encodeURIComponent(article.id)}" data-lead-link>${article.headline}</a></h2>
              <p class="lead-deck">${article.deck}</p>
            </div>
          </div>
        </section>
        <div class="home-secondary-leads">
          ${secondary
            .map(
              (item) => `
            <article class="secondary-lead-card">
              <h3><a href="#/article/${encodeURIComponent(item.id)}">${item.headline}</a></h3>
              <p class="secondary-deck">${item.deck}</p>
            </article>`,
            )
            .join("")}
        </div>
        <section class="home-tabbed-feed" data-home-tabs>
          <div role="tablist" aria-label="Home sections" class="home-tablist">
            ${(Object.keys(TAB_LABELS) as HomeTab[])
              .map(
                (key) =>
                  `<button type="button" role="tab" data-tab="${key}" aria-selected="${key === "top" ? "true" : "false"}" id="tab-${key}">${TAB_LABELS[key]}</button>`,
              )
              .join("")}
          </div>
          <ul class="home-feed-list" data-feed-list role="tabpanel" aria-labelledby="tab-top"></ul>
          <p class="feed-empty" data-feed-empty hidden>No stories in this section yet.</p>
        </section>
        <section class="home-topic-ribbon">
          <h3>Topics</h3>
          <div class="topic-chip-row" aria-label="Topics">
            <a href="#/topic/product-analytics">Product Analytics</a>
            <a href="#/topic/experimentation">Experimentation</a>
            <a href="#/topic/podcast">Podcasts</a>
          </div>
        </section>
        ${
          podcastFeature
            ? `<section class="home-podcast-spotlight podcast-card">
          <p class="podcast-label">Podcast</p>
          <h3><a href="#/article/${encodeURIComponent(podcastFeature.id)}">${podcastFeature.headline}</a></h3>
          <p>${podcastFeature.deck}</p>
        </section>`
            : ""
        }
        <section class="home-newsletter" id="home-newsletter" data-newsletter>
          <h3>The Daily Briefing</h3>
          <p>Simulated newsletter signup — no email is sent.</p>
          <form data-newsletter-form>
            <label for="newsletter-email">Work email</label>
            <input id="newsletter-email" type="email" name="email" placeholder="you@company.com" />
            <button type="submit">Sign up</button>
          </form>
          <p class="newsletter-success" data-newsletter-success hidden>Simulated signup — no email sent</p>
        </section>
      </div>
      <aside class="home-rail" aria-label="Marketplace and latest">
        <section class="home-sponsored-module sponsored-card" data-sponsored-module>
          <h3>Sponsored insight</h3>
          <p class="sponsored-disclosure">Paid post · Simulated sponsor</p>
        </section>
        <section class="latest-list">
          <h3>${recVariant === "editors_picks" ? "Editor's picks" : "Latest"}</h3>
          <ul data-latest-list></ul>
        </section>
        <div class="home-rail-ad-slot" data-rail-ad-slot></div>
      </aside>
    </div>
  `;

  const leaderboard = getAdByPlacement("home_leaderboard");
  const railAd = getAdByPlacement("home_rail");
  const leaderboardSlot = main.querySelector(".home-leaderboard-wrap");
  const railSlot = main.querySelector("[data-rail-ad-slot]");
  if (leaderboard && leaderboardSlot) {
    leaderboardSlot.append(renderAdUnit(leaderboard, "ad-slot--leaderboard"));
  }
  if (railAd && railSlot) {
    railSlot.append(renderAdUnit(railAd, "ad-slot--rail"));
  }

  const sponsoredModule = main.querySelector("[data-sponsored-module]");
  sponsoredStories.slice(0, 2).forEach((story) => {
    const block = document.createElement("article");
    block.innerHTML = `
      <h4><a href="#/article/${encodeURIComponent(story.id)}">${story.headline}</a></h4>
      <p>${story.deck}</p>
    `;
    sponsoredModule?.append(block);
  });

  const latestList = main.querySelector("[data-latest-list]");
  getAllArticles()
    .filter((item) => !item.sponsored)
    .slice(0, 6)
    .forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#/article/${encodeURIComponent(item.id)}">${item.headline}</a><span>${item.publishedAt}</span>`;
      latestList?.append(li);
    });

  let activeTab: HomeTab = "top";
  const renderFeed = (): void => {
    const items = filterForTab(activeTab);
    const list = main.querySelector("[data-feed-list]");
    const empty = main.querySelector("[data-feed-empty]");
    if (!(list instanceof HTMLElement)) {
      return;
    }
    list.innerHTML = items
      .slice(0, 8)
      .map(
        (item) => `
        <li>
          <a href="#/article/${encodeURIComponent(item.id)}">${item.headline}</a>
          <span>${formatTopicLabel(item.topic)} · ${item.publishedAt}</span>
        </li>`,
      )
      .join("");
    if (empty instanceof HTMLElement) {
      empty.hidden = items.length > 0;
    }
  };
  renderFeed();

  main.querySelectorAll("[data-home-tabs] [role=tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-tab") as HomeTab;
      activeTab = key;
      main.querySelectorAll("[data-home-tabs] [role=tab]").forEach((btn) => {
        const selected = btn.getAttribute("data-tab") === key;
        btn.setAttribute("aria-selected", selected ? "true" : "false");
      });
      renderFeed();
    });
    tab.addEventListener("keydown", (event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }
      const keys = Object.keys(TAB_LABELS) as HomeTab[];
      const idx = keys.indexOf(activeTab);
      if (event.key === "ArrowRight") {
        activeTab = keys[(idx + 1) % keys.length];
        (main.querySelector(`[data-tab="${activeTab}"]`) as HTMLButtonElement | null)?.click();
      }
      if (event.key === "ArrowLeft") {
        activeTab = keys[(idx - 1 + keys.length) % keys.length];
        (main.querySelector(`[data-tab="${activeTab}"]`) as HTMLButtonElement | null)?.click();
      }
    });
  });

  main.querySelectorAll("[data-lead-link], [data-retention-sub]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = (link as HTMLAnchorElement).getAttribute("href");
      if (href) {
        navigateToHash(href.replace(/^#/, ""));
      }
    });
  });

  if (retentionOffer) {
    trackDemoEvent("Retention Treatment Presented", {
      treatment_id: "home-retention-reminder",
      treatment_type: "reminder",
      engagement_segment: "declining",
      placement: "home",
    });
  }

  main.querySelector("[data-newsletter-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const success = main.querySelector("[data-newsletter-success]");
    if (success instanceof HTMLElement) {
      success.hidden = false;
    }
    trackDemoEvent("Newsletter Subscription Completed", {
      newsletter_id: "daily-briefing",
      entry_point: "home",
    });
  });

  return main;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}