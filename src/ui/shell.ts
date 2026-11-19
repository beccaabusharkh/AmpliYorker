import { formatEditionDate } from "../lib/articles";
import { getCurrentRoute, navigateToHash } from "../lib/router";
import { getPageParams } from "../lib/statsig/page-params";
import { hasActiveSubscription, isLoggedIn, loadSession } from "../lib/session";

function routeUsesContentHeading(route: ReturnType<typeof getCurrentRoute>): boolean {
  return (
    route.name === "subscribe" ||
    route.name === "account" ||
    route.name === "accountLogin" ||
    route.name === "accountRegister" ||
    route.name === "checkout" ||
    route.name === "checkoutConfirmation"
  );
}

export function renderSkipLink(): HTMLElement {
  const shell = getPageParams("shell");
  const skip = document.createElement("a");
  skip.id = "skip-main";
  skip.className = "skip-link";
  skip.href = "#page-main";
  skip.textContent = shell.skip_link_label;
  return skip;
}

export function renderHeader(): HTMLElement {
  const shell = getPageParams("shell");
  const sectionLinks = [...shell.section_nav_links] as { href: string; label: string }[];
  const header = document.createElement("header");
  header.className = "site-header site-header--fidelity";
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
  const useContentHeading = routeUsesContentHeading(route);
  const mastheadTag = useContentHeading ? "p" : "h1";

  header.innerHTML = `
    <div class="site-header-chrome" data-fidelity-chrome>
      <div class="site-chrome-brand-row">
        <div class="site-chrome-brand-center">
          <${mastheadTag} class="home-masthead site-masthead">
            <a href="#/" data-internal-link>${escapeAttr(shell.site_name)}</a>
          </${mastheadTag}>
          <p class="site-masthead-edition site-masthead-edition--chrome">${escapeAttr(shell.edition_label_prefix)} ${edition}</p>
        </div>
        <div class="site-chrome-actions">
          <a href="#home-newsletter" data-newsletter-link>${shell.newsletter_utility_link}</a>
          <a href="${accountHref}" data-utility-account>${accountLabel}</a>
          <a class="site-chrome-subscribe" href="#/subscribe" data-section-link>${shell.promo_band_cta}</a>
        </div>
      </div>
      <nav class="home-section-nav" aria-label="Sections">
        <div class="section-nav-spacer" aria-hidden="true"></div>
        <ul class="section-nav-list">
          ${sectionLinks
            .map((link) => `<li><a href="${link.href}" data-section-link>${link.label}</a></li>`)
            .join("")}
        </ul>
        <form class="header-search section-nav-search" data-header-search data-precision-event role="search">
          <label class="visually-hidden" for="header-search-input">Search articles</label>
          <input id="header-search-input" data-amplitude-mask type="search" name="q" placeholder="${escapeAttr(shell.search_placeholder)}" value="${escapeAttr(searchValue)}" />
          <button type="submit">${shell.search_submit_label}</button>
        </form>
      </nav>
    </div>
    <div class="site-promo-band site-promo-band--slim" data-subscribe-promo aria-label="Subscription promotion">
      <p class="site-promo-band__copy">${shell.promo_band_copy}</p>
      <a class="promo-band__cta" href="#/subscribe" data-section-link>${shell.promo_band_cta}</a>
    </div>
    <p class="home-masthead-tagline">${shell.masthead_tagline}</p>
    ${
      isLoggedIn() && session.email
        ? `<p class="persona-banner simulation-label">Simulated session: <strong>${escapeAttr(session.displayName ?? "Reader")}</strong> · <code>${escapeAttr(session.email)}</code> (demo preset <code>${escapeAttr(session.activePersonaId)}</code>)</p>`
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
  const shell = getPageParams("shell");
  const disclosure = shell.footer_disclosure.replace("{year}", String(new Date().getFullYear()));
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="site-footer__inner">
      <p>${disclosure}</p>
    </div>
  `;
  return footer;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}