import { getPlanById } from "../lib/plans";
import { navigateToHash } from "../lib/router";
import { trackDemoEvent } from "../lib/analytics/track";
import { clearCheckoutId, getOrCreateCheckoutId } from "../lib/analytics/checkout";
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
  const amountDue = session.pendingIntroOffer ? (plan.id === "annual" ? 79 : 1) : plan.id === "annual" ? 99 : 12;

  main.innerHTML = `
    <section class="form-panel">
      <h1>Simulated checkout</h1>
      <p class="simulation-label">Simulated payment — preset values only; nothing is charged.</p>
      <p><strong>Plan:</strong> ${plan.name} · ${offerCopy}</p>
      <form data-checkout-form class="stacked-form">
        <label for="pay-name">Name on card (preset)</label>
        <input id="pay-name" data-amplitude-mask name="name" type="text" value="Demo Reader" />
        <label for="pay-card">Card number (preset)</label>
        <input id="pay-card" data-amplitude-mask name="card" type="text" value="4242 4242 4242 4242" inputmode="numeric" />
        <label for="pay-exp">Expiry (preset)</label>
        <input id="pay-exp" data-amplitude-mask name="exp" type="text" value="12/30" />
        <button type="submit">Submit simulated payment</button>
      </form>
    </section>
  `;

  const checkoutId = getOrCreateCheckoutId();
  trackDemoEvent("Checkout Started", {
    checkout_id: checkoutId,
    plan_id: plan.id,
    offer_id: session.pendingIntroOffer ? `${plan.id}-intro` : `${plan.id}-standard`,
    amount_due_usd: amountDue,
  });

  main.querySelector("[data-checkout-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = completeCheckout();
    trackDemoEvent("Checkout Completed", {
      checkout_id: checkoutId,
      subscription_id: next.loggedInUserId ? `sub-${next.loggedInUserId}` : checkoutId,
      plan_id: plan.id,
      offer_id: session.pendingIntroOffer ? `${plan.id}-intro` : `${plan.id}-standard`,
      amount_due_usd: amountDue,
    });
    trackDemoEvent("Subscription Activated", {
      subscription_id: next.loggedInUserId ? `sub-${next.loggedInUserId}` : checkoutId,
      checkout_id: checkoutId,
      plan_id: plan.id,
      activation_type: session.pendingIntroOffer ? "trial" : "paid",
    });
  if (session.pendingIntroOffer) {
      trackDemoEvent("Trial Started", {
        subscription_id: next.loggedInUserId ? `sub-${next.loggedInUserId}` : checkoutId,
        offer_id: `${plan.id}-intro`,
        trial_days: 7,
        trial_ends_at: next.subscription.renewalDate ?? new Date().toISOString(),
      });
    }
    trackDemoEvent("Subscription Payment Completed", {
      transaction_id: crypto.randomUUID(),
      subscription_id: next.loggedInUserId ? `sub-${next.loggedInUserId}` : checkoutId,
      checkout_id: checkoutId,
      plan_id: plan.id,
      payment_reason: "initial_purchase",
      revenue_usd: amountDue,
      currency: "USD",
    });
    clearCheckoutId();
    navigateToHash("#/checkout/confirmation");
  });

  return main;
}
