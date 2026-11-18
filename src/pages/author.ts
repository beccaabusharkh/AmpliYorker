import { trackDemoEvent } from "../lib/analytics/track";
import { getArticlesByAuthor } from "../lib/articles";
import { navigateToHash } from "../lib/router";
import { isAuthorFollowed, isLoggedIn, loadSession, toggleFollowAuthor } from "../lib/session";

export function renderAuthorPage(slug: string): HTMLElement {
  const main = document.createElement("main");
  main.className = "page-main";
  const articles = getArticlesByAuthor(slug);
  const displayName = articles[0]?.authorName ?? slug;
  const followed = isAuthorFollowed(slug);

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
    trackDemoEvent("Author Filter Applied", {
      author_id: slug,
      result_count: articles.length,
      discovery_surface: "author_page",
    });
    main.innerHTML = `
      <section class="listing-panel">
        <h1>${displayName}</h1>
        <p class="author-actions">
          <button type="button" data-follow-author>${followed ? "Following" : "Follow writer"}</button>
        </p>
        <ul class="listing-list">${items}</ul>
      </section>
    `;
  }

  main.querySelector("[data-follow-author]")?.addEventListener("click", () => {
    if (!isLoggedIn()) {
      navigateToHash("#/account/login");
      return;
    }
    const followedNow = toggleFollowAuthor(slug);
    const session = loadSession();
    trackDemoEvent(followedNow ? "Author Followed" : "Author Unfollowed", {
      author_id: slug,
      followed_author_count: session.followedAuthorSlugs.length,
    });
    navigateToHash(`#/author/${encodeURIComponent(slug)}`);
  });

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
