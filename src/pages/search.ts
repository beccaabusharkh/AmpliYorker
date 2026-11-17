import { searchArticles } from "../lib/articles";
import { navigateToHash, type Route } from "../lib/router";

export function renderSearchPage(query: string): HTMLElement {
  const main = document.createElement("main");
  main.className = "page-main";

  if (!query.trim()) {
    main.innerHTML = `
      <section class="search-panel">
        <h1>Search Amplitude Daily</h1>
        <p class="search-guidance">Enter a headline or keyword in the header search field to see matching articles.</p>
      </section>
    `;
    return main;
  }

  const results = searchArticles(query);
  if (results.length === 0) {
    main.innerHTML = `
      <section class="search-panel">
        <h1>Search results</h1>
        <p class="search-empty">No articles match <strong>${escapeHtml(query)}</strong>. Try another keyword such as “retention” or “experiment”.</p>
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
      <h1>Search results for “${escapeHtml(query)}”</h1>
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
