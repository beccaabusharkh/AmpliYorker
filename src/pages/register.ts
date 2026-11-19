import { personas } from "../lib/personas";
import { getPageParams } from "../lib/statsig/page-params";
import { navigateToHash } from "../lib/router";
import { ensureAmplitudeIdentity } from "../lib/amplitude/init";
import { syncStatsigIdentity } from "../lib/statsig/init";
import { trackDemoEvent } from "../lib/analytics/track";
import { loginWithPersona } from "../lib/session";

export function renderRegisterPage(): HTMLElement {
  const p = getPageParams("account_register");
  const main = document.createElement("main");
  main.className = "page-main account-page";
  const personaOptions = personas
    .filter((persona) => persona.id !== "anonymous")
    .map((persona) => `<option value="${persona.id}">${persona.label} — ${persona.description}</option>`)
    .join("");

  main.innerHTML = `
    <section class="form-panel account-surface">
      <h1>${p.page_title}</h1>
      <p class="simulation-label">${p.simulation_disclosure}</p>
      <form data-register-form data-precision-event class="stacked-form">
        <label for="reg-persona">${p.persona_field_label}</label>
        <select id="reg-persona" name="persona" required>${personaOptions}</select>
        <label for="reg-name">${p.display_name_label}</label>
        <input id="reg-name" name="name" type="text" value="${escapeAttr(p.default_display_name)}" autocomplete="name" />
        <label for="reg-email">${p.email_label}</label>
        <input id="reg-email" name="email" type="email" value="${escapeAttr(p.default_email)}" autocomplete="email" />
        <button type="submit">${p.submit_label}</button>
      </form>
      <p>${p.login_prompt} <a href="#/account/login" data-login-link>${p.login_link_label}</a></p>
    </section>
  `;

  const personaSelect = main.querySelector("#reg-persona");
  const nameInput = main.querySelector("#reg-name");
  const emailInput = main.querySelector("#reg-email");

  personaSelect?.addEventListener("change", () => {
    const persona = personas.find((item) => item.id === (personaSelect as HTMLSelectElement).value);
    if (persona && nameInput instanceof HTMLInputElement) {
      nameInput.value = persona.presetDisplayName ?? persona.label;
    }
    if (persona && emailInput instanceof HTMLInputElement) {
      emailInput.value = persona.presetEmail ?? `${persona.id}@ampliyorker.test`;
    }
  });

  main.querySelector("[data-register-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const personaId = (personaSelect as HTMLSelectElement).value;
    loginWithPersona(personaId);
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

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}