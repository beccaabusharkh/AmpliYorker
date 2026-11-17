import { plans } from "../lib/plans";
import { navigateToHash } from "../lib/router";
import { getRegisteredReaderPersona } from "../lib/personas";
import { isLoggedIn, setPendingCheckout } from "../lib/session";

export function renderSubscribePage(): HTMLElement {
  const main = document.createElement("main");
  main.className = "page-main account-page";
  const smokePersona = getRegisteredReaderPersona();

  if (!isLoggedIn()) {
    main.innerHTML = `
      <section class="form-panel">
        <h1>Subscribe</h1>
        <p class="simulation-label">Simulated plans — log in first with preset credentials.</p>
        <p><a href="#/account/login" data-login-link>Simulated login</a></p>
      </section>
    `;
    main.querySelector("[data-login-link]")?.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToHash("#/account/login");
    });
    return main;
  }

  const cards = plans
    .map(
      (plan) => `
      <article class="plan-card" data-plan-card="${plan.id}">
        <h2>${plan.name}</h2>
        <p>${plan.priceLabel}</p>
        <p class="intro-offer">${plan.introOfferLabel}</p>
        <button type="button" data-select-plan="${plan.id}" data-intro="true">Choose introductory offer</button>
        <button type="button" class="secondary-button" data-select-plan="${plan.id}" data-intro="false">Choose standard price</button>
      </article>
    `,
    )
    .join("");

  main.innerHTML = `
    <section class="form-panel">
      <h1>Simulated subscription plans</h1>
      <p class="simulation-label">Registered-reader smoke persona (<code>${smokePersona.id}</code>): use <strong>introductory offer</strong> on any plan for P2-D3 checkout smoke.</p>
      <div class="plan-grid">${cards}</div>
    </section>
  `;

  main.querySelectorAll("[data-select-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      const planId = button.getAttribute("data-select-plan");
      const intro = button.getAttribute("data-intro") === "true";
      if (planId) {
        setPendingCheckout(planId, intro);
        navigateToHash("#/checkout");
      }
    });
  });

  return main;
}
