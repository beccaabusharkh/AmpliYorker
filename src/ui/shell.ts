import { getCurrentRoute, navigateToHash } from "../lib/router";

export function renderHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "site-header";
  const route = getCurrentRoute();
  const searchValue = route.name === "search" ? route.query : "";
  header.innerHTML = `
    <div class="site-header__inner site-header__layout">
      <div>
        <h1 class="site-brand"><a href="#/" data-internal-link>Amplitude Daily</a></h1>
        <p class="site-tagline">Fictional news for analytics and experimentation buyers</p>
      </div>
      <form class="header-search" data-header-search role="search">
        <label class="visually-hidden" for="header-search-input">Search articles</label>
        <input id="header-search-input" type="search" name="q" placeholder="Search headlines…" value="${escapeAttr(searchValue)}" />
        <button type="submit">Search</button>
      </form>
    </div>
  `;
  header.querySelector("[data-internal-link]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToHash("#/");
  });
  header.querySelector("[data-header-search]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector("input[name=q]");
    const value = input instanceof HTMLInputElement ? input.value.trim() : "";
    navigateToHash(value ? `#/search/${encodeURIComponent(value)}` : "#/search");
  });
  return header;
}

export function renderFooter(): HTMLElement {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="site-footer__inner">
      <p>© ${new Date().getFullYear()} Amplitude Daily · Demo scaffold · Phase 1</p>
    </div>
  `;
  return footer;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
