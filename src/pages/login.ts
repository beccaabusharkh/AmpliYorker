import { getRegisteredReaderPersona } from "../lib/personas";
import { getPageParams } from "../lib/statsig/page-params";
import { navigateToHash } from "../lib/router";
import { ensureAmplitudeIdentity } from "../lib/amplitude/init";
import { syncStatsigIdentity } from "../lib/statsig/init";
import { trackDemoEvent } from "../lib/analytics/track";
import { loginWithCredentials } from "../lib/session";

export function renderLoginPage(): HTMLElement {
  const p = getPageParams("account_login");
  const smokePersona = getRegisteredReaderPersona();
  const main = document.createElement("main");
  main.className = "page-main account-page";

  main.innerHTML = `
    <section class="form-panel account-surface">
      <h1>${p.page_title}</h1>
      <p class="simulation-label">${p.simulation_disclosure}</p>
      <form data-login-form data-precision-event class="stacked-form">
        <label for="login-email">${p.email_label}</label>
        <input id="login-email" name="email" type="email" value="${smokePersona.presetEmail}" required autocomplete="username" />
        <label for="login-password">${p.password_label}</label>
        <input id="login-password" name="password" type="password" value="demo" required autocomplete="current-password" />
        <p class="form-error" data-login-error hidden>Enter email and a non-empty password to continue.</p>
        <button type="submit">${p.submit_label}</button>
      </form>
      <p>${p.register_prompt} <a href="#/account/register" data-register-link>${p.register_link_label}</a></p>
    </section>
  `;

  const errorEl = main.querySelector("[data-login-error]");
  main.querySelector("[data-login-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailInput = main.querySelector("#login-email");
    const passwordInput = main.querySelector("#login-password");
    const email = emailInput instanceof HTMLInputElement ? emailInput.value : "";
    const password = passwordInput instanceof HTMLInputElement ? passwordInput.value : "";
    const session = loginWithCredentials(email, password);
    if (!session) {
      errorEl?.removeAttribute("hidden");
      return;
    }
    errorEl?.setAttribute("hidden", "");
    ensureAmplitudeIdentity();
    void syncStatsigIdentity();
    trackDemoEvent("Sign In Completed", {
      sign_in_method: "demo_account",
      entry_point: "account_login",
    });
    navigateToHash("#/account");
  });

  main.querySelector("[data-register-link]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToHash("#/account/register");
  });

  return main;
}