import { getPlanById } from "../lib/plans";
import { getPageParams } from "../lib/statsig/page-params";
import { navigateToHash } from "../lib/router";
import { formatRenewalDate, hasActiveSubscription, loadSession } from "../lib/session";

export function renderCheckoutConfirmationPage(): HTMLElement {
  const p = getPageParams("checkout_confirmation");
  const main = document.createElement("main");
  main.className = "page-main account-page";
  const session = loadSession();
  const plan = session.subscription.planId ? getPlanById(session.subscription.planId) : undefined;
  const active = hasActiveSubscription();

  main.innerHTML = `
    <section class="form-panel">
      <h1>${p.page_title}</h1>
      <p class="simulation-label">${p.simulation_disclosure}</p>
      ${
        active && plan
          ? `
        <p class="status-active" data-subscriber-status><strong>${p.active_subscriber_template}</strong> — ${plan.name} plan</p>
        <p>Renewal date (simulated): <strong>${formatRenewalDate()}</strong></p>
        ${session.subscription.usedIntroOffer ? `<p>${p.intro_applied_note}</p>` : ""}
        <p><a href="#/article/retention-myths" data-premium-link>${p.premium_article_link_label}</a> · <a href="#/account" data-account-link>${p.account_hub_link_label}</a></p>
      `
          : `
        <p data-subscriber-status>${p.inactive_body}</p>
        <p><a href="#/subscribe" data-sub-link>Subscribe</a></p>
      `
      }
    </section>
  `;

  main.querySelectorAll("[data-premium-link], [data-account-link], [data-sub-link]").forEach((link) => {
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
