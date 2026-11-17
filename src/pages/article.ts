import { getArticleById, getRecommendations, formatTopicLabel } from "../lib/articles";
import { attachReadingProgress } from "../lib/reading-progress";
import { navigateToHash } from "../lib/router";
import { baseUrl } from "../lib/paths";

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

  const bodyHtml = article.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
  const recs = getRecommendations(article)
    .map(
      (rec) =>
        `<li><a href="#/article/${encodeURIComponent(rec.id)}" data-rec-link>${rec.headline}</a></li>`,
    )
    .join("");

  const narratedBlock = article.narrated
    ? `
    <section class="narrated-block" aria-label="Narrated article">
      <p class="narrated-label">Listen</p>
      <audio controls src="${baseUrl}audio/narration-demo.wav">
        Your browser does not support audio playback.
      </audio>
    </section>`
    : "";

  main.innerHTML = `
    <div class="reading-progress" aria-hidden="true"><span data-progress-bar></span></div>
    <p class="article-meta">
      Published ${article.publishedAt} ·
      <a href="#/topic/${encodeURIComponent(article.topic)}">${formatTopicLabel(article.topic)}</a> ·
      <a href="#/author/${encodeURIComponent(article.author)}">${article.authorName}</a>
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

  const articleRoot = main.querySelector("[data-article-root]");
  const progressBar = main.querySelector("[data-progress-bar]");
  if (articleRoot instanceof HTMLElement && progressBar instanceof HTMLElement) {
    attachReadingProgress(article.id, articleRoot, progressBar);
  }

  main.querySelectorAll("[data-rec-link]").forEach((link) => {
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
