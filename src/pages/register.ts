import { navigateToHash } from "../lib/router";
import { ensureAmplitudeIdentity } from "../lib/amplitude/init";
import { syncStatsigIdentity } from "../lib/statsig/init";
import { trackDemoEvent } from "../lib/analytics/track";
import { loginWithCredentials } from "../lib/session";

export function renderRegisterPage(): HTMLElement {
  const main = document.createElement("main");
  main.className = "page-main account-page";

  main.innerHTML = `
    <section class="form-panel account-surface">
      <h1>Create account</h1>
      <p class="simulation-label">Simulated registration — your typed email becomes the analytics user id. Password is cosmetic only.</p>
      <form data-register-form class="stacked-form">
        <label for="reg-name">Display name</label>
        <input id="reg-name" name="name" type="text" value="Demo Reader" required autocomplete="name" />
        <label for="reg-email">Email</label>
        <input id="reg-email" name="email" type="email" value="reader-demo@ampliyorker.test" required autocomplete="email" />
        <label for="reg-password">Password (demo)</label>
        <input id="reg-password" name="password" type="password" value="demo" required autocomplete="new-password" />
        <p class="form-hint">Any non-empty password works. Preset emails map to demo engagement profiles (e.g. <code>lapsed@ampliyorker.test</code>).</p>
        <p class="form-error" data-register-error hidden>Enter name, email, and a non-empty password to continue.</p>
        <button type="submit">Create account</button>
      </form>
      <p>Already registered? <a href="#/account/login" data-login-link>Log in</a></p>
    </section>
  `;

  const errorEl = main.querySelector("[data-register-error]");
  main.querySelector("[data-register-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = main.querySelector("#reg-name");
    const emailInput = main.querySelector("#reg-email");
    const passwordInput = main.querySelector("#reg-password");
    const displayName = nameInput instanceof HTMLInputElement ? nameInput.value : "";
    const email = emailInput instanceof HTMLInputElement ? emailInput.value : "";
    const password = passwordInput instanceof HTMLInputElement ? passwordInput.value : "";
    const session = loginWithCredentials(email, password, { displayName });
    if (!session) {
      errorEl?.removeAttribute("hidden");
      return;
    }
    errorEl?.setAttribute("hidden", "");
    ensureAmplitudeIdentity();
    void syncStatsigIdentity();
    trackDemoEvent("Registration Completed", {
      registration_method: "demo_account",
      entry_point: "account_register",
    });
    navigateToHash("#/account");
  });

  main.querySelector("[data-login-link]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToHash("#/account/login");
  });

  return main;
}