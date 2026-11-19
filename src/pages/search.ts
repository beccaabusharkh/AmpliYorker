import { trackDemoEvent } from "../lib/analytics/track";
import { searchArticles } from "../lib/articles";
import { getPageParams } from "../lib/statsig/page-params";
import { navigateToHash, type Route } from "../lib/router";

export function renderSearchPage(query: string): HTMLElement {
  const p = getPageParams("search");
  const main = document.createElement("main");
  main.className = "page-main";

  if (!query.trim()) {
    main.innerHTML = `
      <section class="search-panel">
        <h1>${p.empty_query_title}</h1>
        <p class="search-guidance">${p.empty_query_guidance}</p>
      </section>
    `;
    return main;
  }

  const results = searchArticles(query);
  trackDemoEvent("Search Completed", {
    search_id: crypto.randomUUID(),
    query_length: query.trim().length,
    result_count: results.length,
    search_scope: "articles",
  });
  if (results.length === 0) {
    main.innerHTML = `
      <section class="search-panel">
        <h1>${p.empty_results_title}</h1>
        <p class="search-empty">${p.no_results_template.replace("…", `<strong>${escapeHtml(query)}</strong>`)}</p>
      </section>
    `;
    return main;
  }

  const items = results
    .map(
      (article) => `
        <li class="search-result">
          <h2><a href="#/article/${encodeURIComponent(article.id)}" data-article-link>${escapeHtml(article.headline)}</a></h2>
          <p>${escapeHtml(article.deck)}</p>
        </li>
      `,
    )
    .join("");

  main.innerHTML = `
    <section class="search-panel">
      <h1>${p.results_title_prefix} “${escapeHtml(query)}”</h1>
      <ul class="search-results">${items}</ul>
    </section>
  `;

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

export function getSearchQueryFromRoute(route: Route): string {
  return route.name === "search" ? route.query : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
