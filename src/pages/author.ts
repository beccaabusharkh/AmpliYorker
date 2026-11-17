import { getArticlesByAuthor } from "../lib/articles";
import { navigateToHash } from "../lib/router";

export function renderAuthorPage(slug: string): HTMLElement {
  const main = document.createElement("main");
  main.className = "page-main";
  const articles = getArticlesByAuthor(slug);
  const displayName = articles[0]?.authorName ?? slug;

  if (articles.length === 0) {
    main.innerHTML = `
      <section class="listing-panel">
        <h1>Author not found</h1>
        <p>No articles are attributed to this author.</p>
        <p><a href="#/" data-home-link>Return home</a></p>
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
        <h1>${displayName}</h1>
        <ul class="listing-list">${items}</ul>
      </section>
    `;
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
