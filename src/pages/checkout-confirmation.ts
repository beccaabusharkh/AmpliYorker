import { getPlanById } from "../lib/plans";
import { navigateToHash } from "../lib/router";
import { formatRenewalDate, hasActiveSubscription, loadSession } from "../lib/session";

export function renderCheckoutConfirmationPage(): HTMLElement {
  const main = document.createElement("main");
  main.className = "page-main account-page";
  const session = loadSession();
  const plan = session.subscription.planId ? getPlanById(session.subscription.planId) : undefined;
  const active = hasActiveSubscription();

  main.innerHTML = `
    <section class="form-panel">
      <h1>Simulated confirmation</h1>
      <p class="simulation-label">Simulated payment succeeded — subscription stored in local browser state only.</p>
      ${
        active && plan
          ? `
        <p class="status-active" data-subscriber-status><strong>Active subscriber</strong> — ${plan.name} plan</p>
        <p>Renewal date (simulated): <strong>${formatRenewalDate()}</strong></p>
        ${session.subscription.usedIntroOffer ? `<p>Introductory offer applied (simulated).</p>` : ""}
        <p><a href="#/article/retention-myths" data-premium-link>Open premium article</a> · <a href="#/account" data-account-link>Account hub</a></p>
      `
          : `
        <p data-subscriber-status>No active subscription in local state. Complete checkout from Subscribe.</p>
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
