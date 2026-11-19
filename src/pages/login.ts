import { getRegisteredReaderPersona } from "../lib/personas";
import { navigateToHash } from "../lib/router";
import { ensureAmplitudeIdentity } from "../lib/amplitude/init";
import { syncStatsigIdentity } from "../lib/statsig/init";
import { trackDemoEvent } from "../lib/analytics/track";
import { loginWithCredentials } from "../lib/session";

export function renderLoginPage(): HTMLElement {
  const smokePersona = getRegisteredReaderPersona();
  const main = document.createElement("main");
  main.className = "page-main account-page";

  main.innerHTML = `
    <section class="form-panel account-surface">
      <h1>Log in</h1>
      <p class="simulation-label">Simulated sign-in — analytics identity is your email. Password is cosmetic (try <code>demo</code> or any non-empty value).</p>
      <form data-login-form class="stacked-form">
        <label for="login-email">Email</label>
        <input id="login-email" name="email" type="email" value="${smokePersona.presetEmail}" required autocomplete="username" />
        <p class="form-hint">Preset smoke email: <code>${smokePersona.presetEmail}</code> · declining profile: <code>lapsed@ampliyorker.test</code></p>
        <label for="login-password">Password (demo)</label>
        <input id="login-password" name="password" type="password" value="demo" required autocomplete="current-password" />
        <p class="form-hint">Not sent anywhere — required for UX only.</p>
        <p class="form-error" data-login-error hidden>Enter email and a non-empty password to continue.</p>
        <button type="submit">Continue</button>
      </form>
      <p>New here? <a href="#/account/register" data-register-link>Create account</a></p>
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