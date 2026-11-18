import { getArticleById, getRecommendations, formatTopicLabel } from "../lib/articles";
import { canAccessArticle, isPremiumArticle, paywallMessage, paywallMessageExperimentId } from "../lib/paywall";
import { STATSIG_GATES } from "../lib/statsig/catalog";
import { getGateValue, getSubscriptionMessageVariant } from "../lib/statsig/evaluate";
import { attachReadingProgress } from "../lib/reading-progress";
import { navigateToHash } from "../lib/router";
import { baseUrl } from "../lib/paths";
import { attachArticleReadTracking } from "../lib/analytics/article-reading";
import { trackDemoEvent } from "../lib/analytics/track";
import { hasActiveSubscription, incrementArticlesRead, isArticleSaved, isLoggedIn, loadSession, toggleSaveArticle } from "../lib/session";

export function renderArticlePage(id: string): HTMLElement {
  const article = getArticleById(id);
  const main = document.createElement("main");
  main.className = "page-main";

  if (!article) {
    main.innerHTML = `
      <section class="not-found">
        <h1>Article not found</h1>
        <p>This article is not in the demo corpus.</p>
        <p><a href="#/" data-home-link>Return home</a></p>
      </section>
    `;
    main.querySelector("[data-home-link]")?.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToHash("#/");
    });
    return main;
  }

  const premium = isPremiumArticle(id);
  const scrollGate = premium ? getGateValue(STATSIG_GATES.premiumPaywallScroll, "article-paywall") : false;
  const allowed = canAccessArticle(id);
  const saved = isArticleSaved(id);
  const paywallCopy = paywallMessage("article-paywall");
  const messageVariant = getSubscriptionMessageVariant("article-paywall");

  const bodyHtml = allowed
    ? article.body.map((paragraph) => `<p>${paragraph}</p>`).join("")
    : `<p class="paywall-block" data-paywall-message>${paywallCopy}</p>
       <p><a href="#/account/login" data-paywall-login>Simulated login</a> · <a href="#/subscribe" data-paywall-sub>Subscribe</a></p>`;

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
      <p class="narrated-label">Listen</p>
      <audio controls src="${baseUrl}audio/narration-demo.wav">
        Your browser does not support audio playback.
      </audio>
    </section>`
      : "";

  const premiumBadge = premium
    ? `<span class="premium-badge">${hasActiveSubscription() ? "Premium · unlocked" : "Premium · paywalled"}</span>`
    : "";

  main.innerHTML = `
    <div class="reading-progress" aria-hidden="true"><span data-progress-bar></span></div>
    <p class="article-meta">
      Published ${article.publishedAt} ·
      <a href="#/topic/${encodeURIComponent(article.topic)}">${formatTopicLabel(article.topic)}</a> ·
      <a href="#/author/${encodeURIComponent(article.author)}">${article.authorName}</a>
      ${premiumBadge}
    </p>
    <p class="article-actions">
      <button type="button" data-save-article>${saved ? "Saved" : "Save article"}</button>
    </p>
    <article class="article-body" data-article-root>
      <h1>${article.headline}</h1>
      <p class="hero-deck">${article.deck}</p>
      ${narratedBlock}
      ${bodyHtml}
    </article>
    <section class="recommendations">
      <h2>More for you</h2>
      <ul>${recs}</ul>
    </section>
  `;

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
      const articleRoot = main.querySelector("[data-article-root]");
      if (articleRoot instanceof HTMLElement) {
        const onScroll = (): void => {
          if (articleRoot.scrollTop > 48) {
            emitPaywall();
            articleRoot.removeEventListener("scroll", onScroll);
          }
        };
        articleRoot.addEventListener("scroll", onScroll);
      } else {
        emitPaywall();
      }
    } else {
      emitPaywall();
    }
  }

  if (allowed) {
    incrementArticlesRead();
    const articleRoot = main.querySelector("[data-article-root]");
    const progressBar = main.querySelector("[data-progress-bar]");
    if (articleRoot instanceof HTMLElement && progressBar instanceof HTMLElement) {
      attachReadingProgress(article.id, articleRoot, progressBar);
      attachArticleReadTracking(article.id, articleRoot);
    }
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
