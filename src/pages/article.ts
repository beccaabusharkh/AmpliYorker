import { getArticleById, getRecommendations, formatTopicLabel } from "../lib/articles";
import { renderArticleBodyContent, renderArticleHero } from "../lib/article-render";
import { getAdByPlacement, renderAdUnit } from "../lib/ads";
import { canAccessArticle, isPremiumArticle, paywallMessage, paywallMessageExperimentId } from "../lib/paywall";
import { getSubscriptionMessageVariant } from "../lib/statsig/evaluate";
import { getPageParams } from "../lib/statsig/page-params";
import { attachReadingProgress } from "../lib/reading-progress";
import { navigateToHash } from "../lib/router";
import { baseUrl } from "../lib/paths";
import { attachArticleReadTracking } from "../lib/analytics/article-reading";
import { trackDemoEvent } from "../lib/analytics/track";
import {
  hasActiveSubscription,
  incrementArticlesRead,
  isArticleSaved,
  isLoggedIn,
  loadSession,
  toggleSaveArticle,
} from "../lib/session";

export function renderArticlePage(id: string): HTMLElement {
  const p = getPageParams("article");
  const article = getArticleById(id);
  const main = document.createElement("main");
  main.className = "page-main article-page";
  if (!article) {
    main.innerHTML = `
      <section class="not-found">
        <h1>${p.not_found_title}</h1>
        <p>${p.not_found_body}</p>
        <p><a href="#/" data-home-link>${p.return_home_label}</a></p>
      </section>
    `;
    main.querySelector("[data-home-link]")?.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToHash("#/");
    });
    return main;
  }

  const premium = isPremiumArticle(id);
  const scrollGate = premium ? p.premium_paywall_scroll_enabled : false;
  const allowed = canAccessArticle(id);
  const saved = isArticleSaved(id);
  const paywallCopy = paywallMessage("article-paywall");
  const messageVariant = getSubscriptionMessageVariant("article-paywall");
  const previewCount = article.previewParagraphCount ?? p.default_preview_paragraphs;

  const fullBody = renderArticleBodyContent(article);
  let bodySection = "";
  if (allowed) {
    bodySection = `<div class="article-body" data-article-body>${fullBody}</div>`;
  } else if (premium) {
    const previewArticle = { ...article, body: article.body.slice(0, previewCount) };
    bodySection = `
      <section class="article-paywall-preview" data-paywall-preview>
        <span class="visually-hidden">Article preview — subscribe for full text</span>
        <div class="article-body article-body--preview" data-article-body>${renderArticleBodyContent(previewArticle)}</div>
        <div class="preview-fade" aria-hidden="true"></div>
      </section>
      <section class="paywall-panel">
        <p class="paywall-block" data-paywall-message>${paywallCopy}</p>
        <p class="paywall-actions">
          <a href="#/account/login" data-paywall-login>${p.paywall_login_label}</a>
          <a class="paywall-subscribe-btn" href="#/subscribe" data-paywall-sub>${p.paywall_subscribe_label}</a>
        </p>
      </section>`;
  } else {
    bodySection = `<div class="article-body" data-article-body>${fullBody}</div>`;
  }

  const recs = getRecommendations(article)
    .map(
      (rec) =>
        `<li><a href="#/article/${encodeURIComponent(rec.id)}" data-rec-link>${rec.headline}</a></li>`,
    )
    .join("");

  const narratedBlock =
    allowed && article.narrated
      ? `
    <section class="narrated-block" aria-label="Narrated article">
      <p class="narrated-label">${p.narrated_section_label}</p>
      <audio controls src="${baseUrl}audio/narration-demo.wav">
        Your browser does not support audio playback.
      </audio>
    </section>`
      : "";

  const premiumBadge = premium
    ? `<span class="premium-badge">${hasActiveSubscription() ? p.premium_badge_subscriber : p.premium_badge_preview}</span>`
    : "";

  const kicker = article.kicker ? `<p class="article-kicker">${article.kicker}</p>` : "";

  main.innerHTML = `
    <div class="article-layout">
      <div class="article-main-column">
        <div class="reading-progress" aria-hidden="true"><span data-progress-bar></span></div>
        <header class="article-masthead">
          ${kicker}
          <h1>${article.headline}</h1>
          <p class="hero-deck">${article.deck}</p>
          <p class="article-meta">
            Published ${article.publishedAt} ·
            <a href="#/topic/${encodeURIComponent(article.topic)}">${formatTopicLabel(article.topic)}</a> ·
            <a href="#/author/${encodeURIComponent(article.author)}">${article.authorName}</a>
            ${premiumBadge}
          </p>
          <p class="article-actions">
            <button type="button" data-save-article data-precision-event>${saved ? p.saved_article_label : p.save_article_label}</button>
          </p>
        </header>
        ${renderArticleHero(article)}
        ${narratedBlock}
        <article class="article-article-root" data-article-root>
          ${bodySection}
        </article>
        <section class="article-end-signoff">
          <hr class="end-rule" />
          <p>${p.article_end_signoff}</p>
        </section>
        <section class="recommendations">
          <h2>${p.recommendations_heading}</h2>
          <ul>${recs}</ul>
        </section>
      </div>
      <aside class="article-rail" aria-label="Article sidebar" data-article-rail></aside>
    </div>
  `;

  const rail = main.querySelector("[data-article-rail]");
  const mpu = getAdByPlacement("article_mpu");
  if (mpu && rail) {
    rail.append(renderAdUnit(mpu, "ad-slot--mpu"));
  }

  const progressTarget =
    (main.querySelector("[data-article-root]") as HTMLElement | null) ??
    main.querySelector(".article-main-column");
  const articleBody = main.querySelector("[data-article-body]");
  const progressBar = main.querySelector("[data-progress-bar]");

  if (progressTarget instanceof HTMLElement && progressBar instanceof HTMLElement) {
    attachReadingProgress(article.id, progressTarget, progressBar);
  }

  if (!allowed && premium) {
    const emitPaywall = (): void => {
      trackDemoEvent("Paywall Presented", {
        paywall_id: `paywall-${article.id}`,
        article_id: article.id,
        trigger_reason: isLoggedIn() ? "subscription_required" : "registration_required",
        message_id: `${paywallMessageExperimentId()}:${messageVariant}`,
        articles_read_in_window: loadSession().engagement.articlesRead,
      });
    };
    if (scrollGate) {
      const onScroll = (): void => {
        if (window.scrollY > p.paywall_scroll_threshold_px) {
          emitPaywall();
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      emitPaywall();
    }
  }

  if (allowed && articleBody instanceof HTMLElement) {
    incrementArticlesRead();
    attachArticleReadTracking(article.id, articleBody);
    const audio = main.querySelector("audio");
    if (audio instanceof HTMLAudioElement) {
      let started = false;
      audio.addEventListener("play", () => {
        if (started) {
          return;
        }
        started = true;
        trackDemoEvent("Media Playback Started", {
          media_id: `narration-${article.id}`,
          media_type: "article_narration",
          article_id: article.id,
          duration_seconds: Number.isFinite(audio.duration) ? audio.duration : 0,
        });
      });
      audio.addEventListener("ended", () => {
        trackDemoEvent("Media Playback Completed", {
          media_id: `narration-${article.id}`,
          media_type: "article_narration",
          listened_seconds: Number.isFinite(audio.duration) ? audio.duration : 0,
          duration_seconds: Number.isFinite(audio.duration) ? audio.duration : 0,
        });
      });
    }
  }

  main.querySelector("[data-save-article]")?.addEventListener("click", () => {
    if (!isLoggedIn()) {
      navigateToHash("#/account/login");
      return;
    }
    const savedNow = toggleSaveArticle(article.id);
    trackDemoEvent(savedNow ? "Article Saved" : "Article Unsaved", {
      article_id: article.id,
      entry_point: "article_page",
      saved_article_count: loadSession().savedArticleIds.length,
    });
    navigateToHash(`#/article/${encodeURIComponent(article.id)}`);
  });

  main.querySelectorAll("[data-rec-link], [data-paywall-login], [data-paywall-sub]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = (link as HTMLAnchorElement).getAttribute("href");
      if (href) {
        navigateToHash(href.replace(/^#/, ""));
      }
    });
  });

  return main;
}