import { getFeaturedArticle } from "../lib/articles";

export function renderHomePage(): HTMLElement {
  const article = getFeaturedArticle();
  const main = document.createElement("main");
  main.className = "page-main";
  main.innerHTML = `
    <p class="article-meta">Featured · ${article.publishedAt}</p>
    <h2 class="hero-headline">${article.headline}</h2>
    <p class="hero-deck">${article.deck}</p>
    <section class="article-card" aria-labelledby="featured-link">
      <p id="featured-link">
        <a href="#/article/${encodeURIComponent(article.id)}" data-article-link>Read the full article</a>
      </p>
    </section>
  `;
  return main;
}
