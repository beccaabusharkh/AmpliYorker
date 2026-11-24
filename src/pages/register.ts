import { getPageParams } from "../lib/statsig/page-params";
import { navigateToHash } from "../lib/router";
import { syncReaderUserProperties } from "../lib/analytics/user-properties";
import { trackDemoEvent } from "../lib/analytics/track";
import { loginWithCredentials } from "../lib/session";

export function renderRegisterPage(): HTMLElement {
  const p = getPageParams("account_register");
  const main = document.createElement("main");
  main.className = "page-main account-page";

  main.innerHTML = `
    <section class="form-panel account-surface">
      <h1>${p.page_title}</h1>
      <p class="simulation-label">${p.simulation_disclosure}</p>
      <form data-register-form data-precision-event class="stacked-form">
        <label for="reg-name">${p.display_name_label}</label>
        <input id="reg-name" name="name" type="text" value="${escapeAttr(p.default_display_name)}" required autocomplete="name" />
        <label for="reg-email">${p.email_label}</label>
        <input id="reg-email" name="email" type="email" value="${escapeAttr(p.default_email)}" required autocomplete="email" />
        <label for="reg-password">${p.password_label}</label>
        <input id="reg-password" name="password" type="password" value="demo" required autocomplete="new-password" />
        <p class="form-hint">${p.password_hint}</p>
        <p class="form-error" data-register-error hidden>Enter name, email, and a non-empty password to continue.</p>
        <button type="submit">${p.submit_label}</button>
      </form>
      <p>${p.login_prompt} <a href="#/account/login" data-login-link>${p.login_link_label}</a></p>
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
    syncReaderUserProperties();
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

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}