import { getCurrentRoute, navigateToHash } from "../lib/router";
import { hasActiveSubscription, isLoggedIn, loadSession } from "../lib/session";

export function renderHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "site-header";
  const route = getCurrentRoute();
  const searchValue = route.name === "search" ? route.query : "";
  const session = loadSession();
  const accountLabel = isLoggedIn()
    ? hasActiveSubscription()
      ? "Account \u00b7 subscriber"
      : "Account"
    : "Log in";

  header.innerHTML = `
    <div class="site-header__inner site-header__layout">
      <div>
        <h1 class="site-brand"><a href="#/" data-internal-link>Amplitude Daily</a></h1>
        <p class="site-tagline">Fictional news for analytics and experimentation buyers</p>
      </div>
      <nav class="header-nav" aria-label="Primary">
        <a href="#/subscribe" data-nav-link>Subscribe</a>
        <a href="${isLoggedIn() ? "#/account" : "#/account/login"}" data-nav-link>${accountLabel}</a>
      </nav>
      <form class="header-search" data-header-search role="search">
        <label class="visually-hidden" for="header-search-input">Search articles</label>
        <input id="header-search-input" data-amplitude-mask type="search" name="q" placeholder="Search headlines\u2026" value="${escapeAttr(searchValue)}" />
        <button type="submit">Search</button>
      </form>
    </div>
    ${
      session.activePersonaId !== "anonymous"
        ? `<p class="persona-banner simulation-label">Persona: <strong>${session.displayName ?? session.activePersonaId}</strong> (<code>${session.activePersonaId}</code>) \u00b7 simulated session</p>`
        : ""
    }
  `;
  header.querySelector("[data-internal-link]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToHash("#/");
  });
  header.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = (link as HTMLAnchorElement).getAttribute("href");
      if (href) {
        navigateToHash(href);
      }
    });
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
      <p>\u00a9 ${new Date().getFullYear()} Amplitude Daily \u00b7 Demo scaffold \u00b7 Phase 2</p>
    </div>
  `;
  return footer;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
