import { getPlanById } from "../lib/plans";
import { navigateToHash } from "../lib/router";
import { completeCheckout, isLoggedIn, loadSession } from "../lib/session";

export function renderCheckoutPage(): HTMLElement {
  const main = document.createElement("main");
  main.className = "page-main account-page";
  const session = loadSession();
  const plan = session.pendingCheckoutPlanId ? getPlanById(session.pendingCheckoutPlanId) : undefined;

  if (!isLoggedIn() || !plan) {
    main.innerHTML = `
      <section class="form-panel">
        <h1>Checkout</h1>
        <p>Select a plan on <a href="#/subscribe" data-sub-link>Subscribe</a> first.</p>
      </section>
    `;
    main.querySelector("[data-sub-link]")?.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToHash("#/subscribe");
    });
    return main;
  }

  const offerCopy = session.pendingIntroOffer ? plan.introOfferLabel : plan.priceLabel;

  main.innerHTML = `
    <section class="form-panel">
      <h1>Simulated checkout</h1>
      <p class="simulation-label">Simulated payment — preset values only; nothing is charged.</p>
      <p><strong>Plan:</strong> ${plan.name} · ${offerCopy}</p>
      <form data-checkout-form class="stacked-form">
        <label for="pay-name">Name on card (preset)</label>
        <input id="pay-name" name="name" type="text" value="Demo Reader" />
        <label for="pay-card">Card number (preset)</label>
        <input id="pay-card" name="card" type="text" value="4242 4242 4242 4242" inputmode="numeric" />
        <label for="pay-exp">Expiry (preset)</label>
        <input id="pay-exp" name="exp" type="text" value="12/30" />
        <button type="submit">Submit simulated payment</button>
      </form>
    </section>
  `;

  main.querySelector("[data-checkout-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    completeCheckout();
    navigateToHash("#/checkout/confirmation");
  });

  return main;
}
