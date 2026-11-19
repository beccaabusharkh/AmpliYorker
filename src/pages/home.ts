import { getAdByPlacement, renderAdUnit } from "../lib/ads";
import {
  getAllArticles,
  getArticleThumbAlt,
  getFeaturedArticle,
  formatTopicLabel,
  type Article,
} from "../lib/articles";
import { getPageParams } from "../lib/statsig/page-params";
import { trackDemoEvent } from "../lib/analytics/track";
import { shouldShowRetentionOffer } from "../lib/session";
import { navigateToHash } from "../lib/router";
import { baseUrl } from "../lib/paths";

type HomeTab = "top" | "product-analytics" | "experimentation" | "podcasts";

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

function renderOpeningRailCard(item: Article): string {
  return `
    <article class="secondary-lead-card opening-rail-card">
      <a class="secondary-lead-link" href="#/article/${encodeURIComponent(item.id)}">
        <img class="secondary-lead-thumb" src="${baseUrl}${escapeAttr(item.heroImage?.src ?? "")}" alt="${escapeAttr(getArticleThumbAlt(item))}" loading="lazy" width="592" height="394" />
        <h2 class="rail-headline">${item.headline}</h2>
      </a>
      <p class="secondary-deck">${item.deck}</p>
    </article>`;
}

export function renderHomePage(): HTMLElement {
  const p = getPageParams("home");
  const article = getFeaturedArticle();
  const secondary = getAllArticles()
    .filter((item) => item.id !== article.id && !item.sponsored)
    .slice(0, p.secondary_lead_count);
  const sponsoredStories = getAllArticles().filter((item) => item.sponsored);
  const podcastFeature =
    getAllArticles().find((item) => item.podcast && item.id !== article.id) ??
    getAllArticles().find((item) => item.podcast);

  const tabLabels = p.tab_labels as Record<HomeTab, string>;
  const recVariant = p.home_recommendation_variant === "editors_picks" ? "editors_picks" : "control";
  const retentionOffer = shouldShowRetentionOffer();

  const main = document.createElement("main");
  main.className = "page-main home-editorial";
  const heroSrc = article.heroImage ? `${baseUrl}${article.heroImage.src}` : "";
  const heroAlt = article.heroImage?.alt ?? article.headline;
  const leftRail = secondary[0];
  const rightRail = secondary.slice(1, 3);

  main.innerHTML = `
    <div class="home-leaderboard-wrap" data-leaderboard-slot></div>
    <section class="opening-mosaic" data-opening-mosaic>
      <div class="opening-rail opening-rail--left" aria-label="Opening stories left">
        ${leftRail ? renderOpeningRailCard(leftRail) : ""}
      </div>
      <section class="home-lead-package opening-lead" data-component="home-lead">
        ${article.kicker ? `<p class="home-kicker">${article.kicker}</p>` : ""}
        <div class="lead-grid">
          <a class="lead-hero-link" href="#/article/${encodeURIComponent(article.id)}" data-lead-link>
            <img class="lead-hero-image" src="${heroSrc}" alt="${escapeAttr(heroAlt)}" width="1248" height="832" />
          </a>
          <div class="lead-copy">
            <h2 class="lead-headline"><a href="#/article/${encodeURIComponent(article.id)}" data-lead-link>${article.headline}</a></h2>
            <p class="lead-deck">${article.deck}</p>
          </div>
        </div>
      </section>
      <div class="opening-rail opening-rail--right" aria-label="Opening stories right">
        ${rightRail.map((item) => renderOpeningRailCard(item)).join("")}
      </div>
    </section>
    <div class="home-content-grid">
      <div class="home-primary-column">
        ${
          retentionOffer
            ? `<section class="retention-module home-retention home-fidelity-band">
          <h3>${p.retention_title}</h3>
          <p>${p.retention_body}</p>
          <p><a href="#/subscribe" data-retention-sub>${p.retention_cta_text}</a></p>
        </section>`
            : ""
        }
        <section class="home-tabbed-feed home-fidelity-band" data-home-tabs>
          <div role="tablist" aria-label="Home sections" class="home-tablist">
            ${(Object.keys(tabLabels) as HomeTab[])
              .map(
                (key) =>
                  `<button type="button" role="tab" data-tab="${key}" aria-selected="${key === p.default_tab ? "true" : "false"}" id="tab-${key}">${tabLabels[key]}</button>`,
              )
              .join("")}
          </div>
          <ul class="home-feed-list" data-feed-list role="tabpanel" aria-labelledby="tab-top"></ul>
          <p class="feed-empty" data-feed-empty hidden>${p.feed_empty_message}</p>
        </section>
        <section class="home-topic-ribbon home-fidelity-band">
          <h3>${p.topics_heading}</h3>
          <div class="topic-chip-row" aria-label="Topics">
            <a href="#/topic/product-analytics">Product Analytics</a>
            <a href="#/topic/experimentation">Experimentation</a>
            <a href="#/topic/podcast">Podcasts</a>
          </div>
        </section>
        ${
          podcastFeature
            ? `<section class="home-podcast-spotlight podcast-card home-fidelity-band">
          <p class="podcast-label">${p.podcast_spotlight_label}</p>
          ${
            podcastFeature.heroImage
              ? `<a href="#/article/${encodeURIComponent(podcastFeature.id)}"><img class="podcast-spotlight-thumb" src="${baseUrl}${escapeAttr(podcastFeature.heroImage.src)}" alt="${escapeAttr(getArticleThumbAlt(podcastFeature))}" loading="lazy" width="800" height="600" /></a>`
              : ""
          }
          <h3><a href="#/article/${encodeURIComponent(podcastFeature.id)}">${podcastFeature.headline}</a></h3>
          <p>${podcastFeature.deck}</p>
        </section>`
            : ""
        }
        <section class="home-newsletter home-fidelity-band" id="home-newsletter" data-newsletter>
          <h3>${p.newsletter_title}</h3>
          <p>${p.newsletter_subcopy}</p>
          <form data-newsletter-form data-precision-event>
            <label for="newsletter-email">${p.newsletter_email_label}</label>
            <input id="newsletter-email" type="email" name="email" placeholder="${escapeAttr(p.newsletter_placeholder)}" />
            <button type="submit">${p.newsletter_submit_label}</button>
          </form>
          <p class="newsletter-success" data-newsletter-success hidden>${p.newsletter_success_message}</p>
        </section>
      </div>
      <aside class="home-rail" aria-label="Marketplace and latest">
        <section class="home-sponsored-module sponsored-card home-fidelity-band" data-sponsored-module>
          <h3>${p.sponsored_module_title}</h3>
          <p class="sponsored-disclosure">${p.sponsored_disclosure}</p>
        </section>
        <section class="latest-list home-fidelity-band">
          <h3>${recVariant === "editors_picks" ? p.editors_picks_rail_heading : p.latest_rail_heading}</h3>
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
  const featured = sponsoredStories[0];
  const secondaryStory = sponsoredStories[1];
  if (featured && sponsoredModule) {
    const articleHref = `#/article/${encodeURIComponent(featured.id)}`;
    const heroSrc = featured.heroImage ? `${baseUrl}${featured.heroImage.src}` : "";
    const heroAlt = featured.heroImage?.alt ?? featured.headline;
    const offer = document.createElement("article");
    offer.className = "sponsored-offer-card";
    offer.dataset.sponsoredOffer = "";
    offer.innerHTML = `
      ${
        heroSrc
          ? `<a class="sponsored-offer-card__thumb" href="${articleHref}"><img src="${escapeAttr(heroSrc)}" alt="${escapeAttr(heroAlt)}" loading="lazy" width="640" height="360" /></a>`
          : ""
      }
      <h4 class="sponsored-offer-card__title"><a href="${articleHref}">${featured.headline}</a></h4>
      <p class="sponsored-offer-card__deck">${featured.deck}</p>
      <a class="sponsored-offer-card__cta" href="${articleHref}">${p.sponsored_cta_label}</a>
    `;
    sponsoredModule.append(offer);
  }
  if (secondaryStory && sponsoredModule) {
    const block = document.createElement("p");
    block.className = "sponsored-secondary-link";
    block.innerHTML = `<a href="#/article/${encodeURIComponent(secondaryStory.id)}">${secondaryStory.headline}</a>`;
    sponsoredModule.append(block);
  }

  const latestList = main.querySelector("[data-latest-list]");
  getAllArticles()
    .filter((item) => !item.sponsored)
    .slice(0, p.latest_list_limit)
    .forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#/article/${encodeURIComponent(item.id)}">${item.headline}</a><span>${item.publishedAt}</span>`;
      latestList?.append(li);
    });

  let activeTab: HomeTab = (p.default_tab as HomeTab) ?? "top";
  const renderFeed = (): void => {
    const items = filterForTab(activeTab);
    const list = main.querySelector("[data-feed-list]");
    const empty = main.querySelector("[data-feed-empty]");
    if (!(list instanceof HTMLElement)) {
      return;
    }
    list.innerHTML = items
      .slice(0, p.feed_item_limit)
      .map((item, index) => renderFeedRow(item, index))
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
      const keys = Object.keys(tabLabels) as HomeTab[];
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

function renderFeedRow(item: Article, index: number): string {
  // Rows 4–5 (HP-P08–P09): feed thumbs after secondary leads so URLs stay distinct from HP-P03–P05.
  const thumb =
    index >= 3 && index < 5 && item.heroImage
      ? `<img class="feed-thumb" src="${baseUrl}${escapeAttr(item.heroImage.src)}" alt="${escapeAttr(getArticleThumbAlt(item))}" loading="lazy" width="64" height="48" />`
      : "";
  return `
        <li class="home-feed-item">
          <a class="feed-row-link" href="#/article/${encodeURIComponent(item.id)}">
            ${thumb}
            <span class="feed-row-copy">
              <span class="feed-headline">${item.headline}</span>
              <span class="feed-meta">${formatTopicLabel(item.topic)} · ${item.publishedAt}</span>
            </span>
          </a>
        </li>`;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}