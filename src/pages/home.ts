import { getAllArticles, getFeaturedArticle } from "../lib/articles";

export function renderHomePage(): HTMLElement {
  const article = getFeaturedArticle();
  const others = getAllArticles().filter((item) => item.id !== article.id && !item.sponsored);
  const sponsored = getAllArticles().find((item) => item.sponsored);
  const podcast = getAllArticles().find((item) => item.podcast);

  const listItems = others
    .slice(0, 4)
    .map(
      (item) => `
        <li>
          <a href="#/article/${encodeURIComponent(item.id)}">${item.headline}</a>
          <span>${item.publishedAt}</span>
        </li>
      `,
    )
    .join("");

  const main = document.createElement("main");
  main.className = "page-main home-layout";
  main.innerHTML = `
    <div class="home-primary">
      <p class="article-meta">Featured · ${article.publishedAt}</p>
      <h2 class="hero-headline">${article.headline}</h2>
      <p class="hero-deck">${article.deck}</p>
      <section class="article-card" aria-labelledby="featured-link">
        <p id="featured-link">
          <a href="#/article/${encodeURIComponent(article.id)}">Read the full article</a>
        </p>
      </section>
      ${
        podcast
          ? `
      <section class="podcast-card">
        <p class="podcast-label">Podcast</p>
        <h3><a href="#/article/${encodeURIComponent(podcast.id)}">${podcast.headline}</a></h3>
        <p>${podcast.deck}</p>
      </section>`
          : ""
      }
      <section class="home-newsletter" data-newsletter>
        <h3>Daily briefing</h3>
        <p>Simulated newsletter signup — no email is sent.</p>
        <form data-newsletter-form>
          <label for="newsletter-email">Email</label>
          <input id="newsletter-email" type="email" name="email" placeholder="you@company.com" />
          <button type="submit">Subscribe</button>
        </form>
        <p class="newsletter-success" data-newsletter-success hidden>Simulated signup — no email sent</p>
      </section>
    </div>
    <aside class="home-rail" aria-label="More coverage">
      <section class="ad-unit">
        <p class="ad-label">Advertisement (simulated)</p>
        <p class="ad-copy">Promote your experimentation program with fictional display inventory.</p>
      </section>
      ${
        sponsored
          ? `
      <section class="sponsored-card">
        <p class="sponsored-label">Sponsored story</p>
        <h3><a href="#/article/${encodeURIComponent(sponsored.id)}">${sponsored.headline}</a></h3>
        <p>${sponsored.deck}</p>
      </section>`
          : ""
      }
      <section class="latest-list">
        <h3>Latest</h3>
        <ul>${listItems}</ul>
      </section>
    </aside>
  `;

  main.querySelector("[data-newsletter-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const success = main.querySelector("[data-newsletter-success]");
    if (success instanceof HTMLElement) {
      success.hidden = false;
    }
  });

  return main;
}
