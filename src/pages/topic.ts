import { trackDemoEvent } from "../lib/analytics/track";
import { formatTopicLabel, getArticlesByTopic } from "../lib/articles";
import { getPageParams } from "../lib/statsig/page-params";
import { navigateToHash } from "../lib/router";

export function renderTopicPage(slug: string): HTMLElement {
  const p = getPageParams("topic");
  const main = document.createElement("main");
  main.className = "page-main";
  const articles = getArticlesByTopic(slug);

  if (articles.length === 0) {
    main.innerHTML = `
      <section class="listing-panel">
        <h1>${p.not_found_title}</h1>
        <p>${p.not_found_body}</p>
        <p><a href="#/" data-home-link>${p.return_home_label}</a></p>
      </section>
    `;
  } else {
    const items = articles
      .map(
        (article) => `
          <li class="listing-item">
            <a href="#/article/${encodeURIComponent(article.id)}" data-article-link>${article.headline}</a>
            <p>${article.deck}</p>
          </li>
        `,
      )
      .join("");
    main.innerHTML = `
      <section class="listing-panel">
        <h1>${formatTopicLabel(slug)}</h1>
        <ul class="listing-list">${items}</ul>
      </section>
    `;
    trackDemoEvent("Topic Filter Applied", {
      topic_id: slug,
      result_count: articles.length,
      discovery_surface: "topic_page",
    });
  }

  main.querySelector("[data-home-link]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToHash("#/");
  });
  main.querySelectorAll("[data-article-link]").forEach((link) => {
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
