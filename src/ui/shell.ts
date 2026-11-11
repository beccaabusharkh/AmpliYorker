import { navigateToHash } from "../lib/router";

export function renderHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="site-header__inner">
      <h1 class="site-brand"><a href="#/" data-internal-link>Amplitude Daily</a></h1>
      <p class="site-tagline">Fictional news for analytics and experimentation buyers</p>
    </div>
  `;
  header.querySelector("[data-internal-link]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToHash("#/");
  });
  return header;
}

export function renderFooter(): HTMLElement {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="site-footer__inner">
      <p>© ${new Date().getFullYear()} Amplitude Daily · Demo scaffold · Phase 0</p>
    </div>
  `;
  return footer;
}
