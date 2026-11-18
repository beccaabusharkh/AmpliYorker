import { formatEditionDate } from "../lib/articles";
import { getCurrentRoute, navigateToHash } from "../lib/router";
import { hasActiveSubscription, isLoggedIn, loadSession } from "../lib/session";

const SECTION_LINKS = [
  { href: "#/", label: "Home" },
  { href: "#/topic/product-analytics", label: "Product Analytics" },
  { href: "#/topic/experimentation", label: "Experimentation" },
  { href: "#/topic/podcast", label: "Podcasts" },
  { href: "#/subscribe", label: "Subscribe" },
];

export function renderSkipLink(): HTMLElement {
  const skip = document.createElement("a");
  skip.id = "skip-main";
  skip.className = "skip-link";
  skip.href = "#page-main";
  skip.textContent = "Skip to main content";
  return skip;
}

export function renderHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "site-header";
  header.dataset.component = "site-header";
  const route = getCurrentRoute();
  const searchValue = route.name === "search" ? route.query : "";
  const session = loadSession();
  const accountLabel = isLoggedIn()
    ? hasActiveSubscription()
      ? `Account${"\u00a0· Subscriber"}`
      : "Account"
    : "Log in";
  const accountHref = isLoggedIn() ? "#/account" : "#/account/login";
  const edition = formatEditionDate();

  header.innerHTML = `
    <div class="home-utility-bar site-utility-bar">
      <span class="utility-date">Today\u2019s edition \u00b7 ${edition}</span>
      <div class="utility-links">
        <a href="#home-newsletter" data-newsletter-link>Newsletter</a>
        <a href="${accountHref}" data-utility-account>${accountLabel}</a>
      </div>
    </div>
    <h1 class="home-masthead site-masthead">
      <a href="#/" data-internal-link>Amplitude Daily</a>
    </h1>
    <p class="home-masthead-tagline">Independent reporting on product analytics and experimentation</p>
    <div class="site-promo-band" data-subscribe-promo aria-label="Subscription promotion">
      <p class="site-promo-band__copy">Subscribe for full access to Amplitude Daily — simulated plans from $12/month.</p>
      <a class="promo-band__cta" href="#/subscribe" data-section-link>Subscribe</a>
    </div>
    <nav class="home-section-nav" aria-label="Sections">
      <ul class="section-nav-list">
        ${SECTION_LINKS.map(
          (link) => `<li><a href="${link.href}" data-section-link>${link.label}</a></li>`,
        ).join("")}
      </ul>
      <form class="header-search section-nav-search" data-header-search role="search">
        <label class="visually-hidden" for="header-search-input">Search articles</label>
        <input id="header-search-input" data-amplitude-mask type="search" name="q" placeholder="Search headlines\u2026" value="${escapeAttr(searchValue)}" />
        <button type="submit">Search</button>
      </form>
    </nav>
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
  header.querySelectorAll("[data-section-link], [data-utility-account]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = (link as HTMLAnchorElement).getAttribute("href");
      if (href) {
        navigateToHash(href.replace(/^#/, ""));
      }
    });
  });
  header.querySelector("[data-newsletter-link]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToHash("#/");
    window.requestAnimationFrame(() => {
      document.getElementById("home-newsletter")?.scrollIntoView({ behavior: "smooth" });
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
      <p>\u00a9 ${new Date().getFullYear()} Amplitude Daily \u00b7 Fictional demo publication \u00b7 Simulated accounts, payments, and advertising</p>
    </div>
  `;
  return footer;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}