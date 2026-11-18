import { personas } from "../lib/personas";
import { navigateToHash } from "../lib/router";
import { ensureAmplitudeIdentity } from "../lib/amplitude/init";
import { syncStatsigIdentity } from "../lib/statsig/init";
import { trackDemoEvent } from "../lib/analytics/track";
import { loginWithPersona } from "../lib/session";

export function renderRegisterPage(): HTMLElement {
  const main = document.createElement("main");
  main.className = "page-main account-page";
  const personaOptions = personas
    .filter((persona) => persona.id !== "anonymous")
    .map((persona) => `<option value="${persona.id}">${persona.label} — ${persona.description}</option>`)
    .join("");

  main.innerHTML = `
    <section class="form-panel account-surface">
      <h1>Create account</h1>
      <p class="simulation-label">No passwords are collected. Pick a preset persona — values are demo-only.</p>
      <form data-register-form class="stacked-form">
        <label for="reg-persona">Preset persona</label>
        <select id="reg-persona" name="persona" required>${personaOptions}</select>
        <label for="reg-name">Display name (preset)</label>
        <input id="reg-name" name="name" type="text" value="Demo Reader" autocomplete="name" />
        <label for="reg-email">Email (preset)</label>
        <input id="reg-email" name="email" type="email" value="reader-demo@ampliyorker.test" autocomplete="email" />
        <button type="submit">Create account</button>
      </form>
      <p>Already registered? <a href="#/account/login" data-login-link>Log in</a></p>
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