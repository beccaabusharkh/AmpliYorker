import { plans, getPlanById } from "../lib/plans";
import { getBillingPeriod, getPlanAmountUsd } from "../lib/plan-pricing";
import { getPlanFeatureBullets, SUBSCRIBE_PLAN_ORDER } from "../lib/subscribe-ui";
import { getPageParams } from "../lib/statsig/page-params";
import { navigateToHash } from "../lib/router";
import { trackDemoEvent } from "../lib/analytics/track";
import { getOrCreateCheckoutId } from "../lib/analytics/checkout";
import { isLoggedIn, setPendingCheckout } from "../lib/session";

export function renderSubscribePage(): HTMLElement {
  const p = getPageParams("subscribe");
  const main = document.createElement("main");
  main.className = "page-main account-page";

  if (!isLoggedIn()) {
    main.innerHTML = `
      <section class="form-panel account-surface">
        <h1>${p.gate_title}</h1>
        <p class="account-gate-copy">${p.gate_copy}</p>
        <p>
          <a href="#/account/login" data-login-link>Log in</a>
          · <a href="#/account/register" data-register-link>Create account</a>
        </p>
      </section>
    `;
    bindNav(main);
    return main;
  }

  const offerVariant = p.subscription_offer_variant === "intro_badge" ? "intro_badge" : "control";
  const orderedPlans = SUBSCRIBE_PLAN_ORDER.map((id) => getPlanById(id)).filter(
    (plan): plan is NonNullable<typeof plan> => plan != null,
  );

  const cards = orderedPlans
    .map((plan) => {
      const recommended = plan.id === p.recommended_plan_id;
      const features = getPlanFeatureBullets(plan.id)
        .map((line) => `<li>${line}</li>`)
        .join("");
      return `
      <article class="plan-card${recommended ? " plan-card--recommended" : ""}" data-plan-card="${plan.id}">
        ${recommended ? `<p class="plan-card__badge">${p.recommended_plan_badge}</p>` : ""}
        <h2>${plan.name}</h2>
        <p class="plan-card__price">${plan.priceLabel}</p>
        <p class="intro-offer">${offerVariant === "intro_badge" ? p.intro_offer_badge_prefix : ""}${plan.introOfferLabel}</p>
        <ul class="plan-card__features">${features}</ul>
        <button type="button" data-select-plan="${plan.id}" data-intro="true">${p.intro_cta_label}</button>
        <button type="button" class="secondary-button" data-select-plan="${plan.id}" data-intro="false">${p.standard_cta_label}</button>
      </article>
    `;
    })
    .join("");

  main.innerHTML = `
    <section class="form-panel account-surface account-surface--wide">
      <h1>${p.page_title}</h1>
      <p class="subscribe-deck">${p.page_deck}</p>
      <div class="plan-grid plan-grid--three">${cards}</div>
    </section>
  `;

  main.querySelectorAll("[data-select-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      const planId = button.getAttribute("data-select-plan");
      const intro = button.getAttribute("data-intro") === "true";
      if (planId && plans.some((p) => p.id === planId)) {
        setPendingCheckout(planId, intro);
        const checkoutId = getOrCreateCheckoutId();
        const amountDue = getPlanAmountUsd(planId, intro);
        trackDemoEvent("Subscription Added To Cart", {
          checkout_id: checkoutId,
          plan_id: planId,
          offer_id: intro ? `${planId}-intro` : `${planId}-standard`,
          offer_type: intro ? "introductory" : "standard",
          billing_period: getBillingPeriod(planId),
          amount_due_usd: amountDue,
          trial_days: 0,
        });
        navigateToHash("#/checkout");
      }
    });
  });

  return main;
}

function bindNav(main: HTMLElement): void {
  main.querySelectorAll("[data-login-link], [data-register-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = (link as HTMLAnchorElement).getAttribute("href");
      if (href) {
        navigateToHash(href.replace(/^#/, ""));
      }
    });
  });
}