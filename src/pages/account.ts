import { getAllArticles } from "../lib/articles";
import { plans } from "../lib/plans";
import { navigateToHash } from "../lib/router";
import {
  advanceDemoTime,
  applySecondaryDeviceLabel,
  cancelSubscription,
  changePlan,
  exportPersonaSnapshot,
  formatRenewalDate,
  hasActiveSubscription,
  isLoggedIn,
  loadSession,
  logout,
  resetDemoData,
  saveSession,
  shouldShowRetentionOffer,
  updateBillingProfile,
  type CancellationReason,
  CANCELLATION_REASONS,
  cancellationReasonLabels,
} from "../lib/session";
import { resetAmplitudeIdentity, ensureAmplitudeIdentity } from "../lib/amplitude/init";
import { trackDemoEvent } from "../lib/analytics/track";
import { resolveAccountState } from "../lib/analytics/context";
import { showToast } from "../ui/toast";

export function renderAccountPage(): HTMLElement {
  const main = document.createElement("main");
  main.className = "page-main account-page";

  if (!isLoggedIn()) {
    main.innerHTML = `
      <section class="form-panel">
        <h1>Account</h1>
        <p class="simulation-label">Simulated account hub — log in with preset persona credentials.</p>
        <p><a href="#/account/login" data-login-link>Simulated login</a> · <a href="#/account/register" data-register-link>Register</a></p>
      </section>
    `;
    bindNav(main);
    return main;
  }

  const session = loadSession();
  const active = hasActiveSubscription();
  const saved = session.savedArticleIds
    .map((id) => getAllArticles().find((article) => article.id === id)?.headline ?? id)
    .join(", ");
  const followed = session.followedAuthorSlugs.join(", ") || "—";
  const planLabel = session.subscription.planId
    ? plans.find((plan) => plan.id === session.subscription.planId)?.name ?? session.subscription.planId
    : "None";
  const statusLabel =
    session.subscription.status === "active" && active
      ? "Active"
      : session.subscription.status === "canceled"
        ? "Canceled (simulated)"
        : session.subscription.status === "expired"
          ? "Expired (simulated)"
          : "No subscription";

  const retentionOffer = shouldShowRetentionOffer();
  const retentionBlock = retentionOffer
    ? `
    <section class="retention-module">
      <h2>Simulated renewal reminder</h2>
      <p>We noticed lighter reading lately — here's an introductory-style offer if you resubscribe.</p>
      <p><a href="#/subscribe" data-sub-link>View simulated plans</a></p>
    </section>`
    : "";

  const cancelReasons = CANCELLATION_REASONS.map(
    (reason) => `<option value="${reason}">${cancellationReasonLabels()[reason as CancellationReason]}</option>`,
  ).join("");

  main.innerHTML = `
    <section class="form-panel">
      <h1>Account hub</h1>
      <p class="simulation-label">Simulated account management — ${session.displayName} (<code>${session.loggedInUserId}</code>)</p>
      <dl class="status-dl">
        <div><dt>Subscription</dt><dd data-account-status>${statusLabel} · ${planLabel}</dd></div>
        <div><dt>Renewal (simulated)</dt><dd>${formatRenewalDate()}</dd></div>
        <div><dt>Device</dt><dd>${session.deviceLabel}${session.secondaryDeviceLabel ? ` · ${session.secondaryDeviceLabel}` : ""}</dd></div>
        <div><dt>Saved articles</dt><dd>${saved || "—"}</dd></div>
        <div><dt>Followed writers</dt><dd>${followed}</dd></div>
      </dl>
      ${retentionBlock}
      <nav class="account-actions" aria-label="Account actions">
        ${active ? "" : `<a href="#/subscribe" data-sub-link>Subscribe</a>`}
        <a href="#/article/retention-myths" data-premium-link>Premium article</a>
        <button type="button" data-logout>Log out (simulated)</button>
      </nav>
    </section>

    <section class="form-panel">
      <h2>Simulated billing profile</h2>
      <form data-billing-form class="stacked-form">
        <label for="bill-name">Name (preset)</label>
        <input id="bill-name" name="name" type="text" value="${escapeAttr(session.billingProfile.name)}" />
        <label for="bill-email">Email (preset)</label>
        <input id="bill-email" name="email" type="email" value="${escapeAttr(session.billingProfile.email)}" />
        <label for="bill-card">Card last four (preset)</label>
        <input id="bill-card" name="card" type="text" value="${escapeAttr(session.billingProfile.cardLast4)}" maxlength="4" />
        <button type="submit">Save billing (simulated)</button>
      </form>
    </section>

    <section class="form-panel">
      <h2>Change plan (simulated)</h2>
      <form data-plan-form class="stacked-form">
        <label for="plan-switch">Plan</label>
        <select id="plan-switch" name="plan">
          ${plans.map((plan) => `<option value="${plan.id}" ${plan.id === session.subscription.planId ? "selected" : ""}>${plan.name}</option>`).join("")}
        </select>
        <button type="submit">Update plan (simulated)</button>
      </form>
    </section>

    <section class="form-panel">
      <h2>Cancel subscription (simulated)</h2>
      <form data-cancel-form class="stacked-form">
        <label for="cancel-reason">Reason</label>
        <select id="cancel-reason" name="reason">${cancelReasons}</select>
        <button type="submit">Confirm cancellation</button>
      </form>
      ${session.subscription.status === "canceled" ? `<p class="canceled-label">Simulated cancellation recorded${session.subscription.cancellationReason ? `: ${session.subscription.cancellationReason}` : ""}.</p>` : ""}
    </section>

    <section class="form-panel">
      <h2>Simulated device switch</h2>
      <p>Copy persona snapshot for a second device label (local simulation only).</p>
      <button type="button" data-export-snapshot>Export persona snapshot</button>
      <button type="button" data-apply-device>Apply secondary device label</button>
      <pre class="snapshot-pre" data-snapshot-output hidden></pre>
    </section>

    <section class="form-panel demo-controls">
      <h2>Demo reset & time</h2>
      <p class="simulation-label">Controls shift simulated renewal dates and subscription expiry.</p>
      <p>Demo time offset: <strong data-time-offset>${session.demoTimeOffsetDays}</strong> days</p>
      <button type="button" data-advance-time="+7">Advance +7 days</button>
      <button type="button" data-advance-time="+30">Advance +30 days</button>
      <button type="button" data-reset-demo>Reset demo data</button>
    </section>
  `;

  if (retentionOffer) {
    trackDemoEvent("Retention Treatment Presented", {
      treatment_id: "account-renewal-reminder",
      treatment_type: "renewal_offer",
      engagement_segment: "declining",
      placement: "account",
    });
  }

  main.querySelector("[data-logout]")?.addEventListener("click", () => {
    trackDemoEvent("Sign Out Completed", {
      previous_account_state: resolveAccountState(),
    });
    logout();
    resetAmplitudeIdentity();
    navigateToHash("#/");
  });

  main.querySelector("[data-billing-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    updateBillingProfile({
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      cardLast4: (form.elements.namedItem("card") as HTMLInputElement).value,
    });
    trackDemoEvent("Billing Details Updated", {
      subscription_id: session.subscription.planId ? `sub-${session.loggedInUserId}` : "none",
      updated_fields: ["demo_payment_method", "billing_frequency"],
    });
    showToast("Simulated billing profile saved.");
  });

  main.querySelector("[data-plan-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const planId = (main.querySelector("#plan-switch") as HTMLSelectElement).value;
    const previousPlan = session.subscription.planId ?? "none";
    changePlan(planId);
    trackDemoEvent("Subscription Plan Changed", {
      subscription_id: `sub-${session.loggedInUserId}`,
      previous_plan_id: previousPlan,
      new_plan_id: planId,
      effective_at: new Date().toISOString(),
    });
    ensureAmplitudeIdentity();
    showToast("Simulated plan updated.");
    navigateToHash("#/account");
  });

  main.querySelector("[data-cancel-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const reason = (main.querySelector("#cancel-reason") as HTMLSelectElement).value as CancellationReason;
    trackDemoEvent("Cancellation Started", {
      subscription_id: `sub-${session.loggedInUserId}`,
      plan_id: session.subscription.planId ?? "none",
    });
    cancelSubscription(reason);
    const canceled = loadSession();
    trackDemoEvent("Subscription Canceled", {
      subscription_id: `sub-${session.loggedInUserId}`,
      plan_id: canceled.subscription.planId ?? "none",
      reason_code: mapCancelReason(reason),
      access_ends_at: canceled.subscription.renewalDate ?? new Date().toISOString(),
    });
    showToast("Simulated cancellation recorded.");
    navigateToHash("#/account");
  });

  main.querySelector("[data-export-snapshot]")?.addEventListener("click", () => {
    const output = main.querySelector("[data-snapshot-output]");
    const text = exportPersonaSnapshot();
    if (output instanceof HTMLElement) {
      output.hidden = false;
      output.textContent = text;
    }
    void navigator.clipboard?.writeText(text);
    showToast("Persona snapshot copied (simulated export).");
  });

  main.querySelector("[data-apply-device]")?.addEventListener("click", () => {
    applySecondaryDeviceLabel();
    showToast("Secondary device label applied.");
    navigateToHash("#/account");
  });

  main.querySelectorAll("[data-advance-time]").forEach((button) => {
    button.addEventListener("click", () => {
      const delta = button.getAttribute("data-advance-time") === "+30" ? 30 : 7;
      advanceDemoTime(delta);
      navigateToHash("#/account");
    });
  });

  main.querySelector("[data-reset-demo]")?.addEventListener("click", () => {
    const fresh = resetDemoData();
    saveSession(fresh);
    navigateToHash("#/");
  });

  bindNav(main);
  return main;
}

function bindNav(main: HTMLElement): void {
  main.querySelectorAll("[data-login-link], [data-register-link], [data-sub-link], [data-premium-link]").forEach(
    (link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const href = (link as HTMLAnchorElement).getAttribute("href");
        if (href) {
          navigateToHash(href.replace(/^#/, ""));
        }
      });
    },
  );
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function mapCancelReason(reason: CancellationReason): string {
  const map: Record<CancellationReason, string> = {
    too_expensive: "price",
    not_reading_enough: "low_usage",
    temporary_break: "other",
    switching_tool: "content_fit",
    other: "other",
  };
  return map[reason];
}
