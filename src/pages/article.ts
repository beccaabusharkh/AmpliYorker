import { getArticleById } from "../lib/articles";
import { navigateToHash } from "../lib/router";

export function renderArticlePage(id: string): HTMLElement {
  const article = getArticleById(id);
  const main = document.createElement("main");
  main.className = "page-main";

  if (!article) {
    main.innerHTML = `
      <section class="not-found">
        <h1>Article not found</h1>
        <p>This route is not seeded in Phase 0.</p>
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
  main.innerHTML = `
    <p class="article-meta">Published ${article.publishedAt} · <a href="#/" data-home-link>Amplitude Daily</a></p>
    <article class="article-body">
      <h1>${article.headline}</h1>
      ${bodyHtml}
    </article>
  `;
  main.querySelector("[data-home-link]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToHash("#/");
  });
  return main;
}
