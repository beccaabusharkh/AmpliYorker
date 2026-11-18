import { getRegisteredReaderPersona, personas } from "../lib/personas";
import { navigateToHash } from "../lib/router";
import { ensureAmplitudeIdentity } from "../lib/amplitude/init";
import { syncStatsigIdentity } from "../lib/statsig/init";
import { trackDemoEvent } from "../lib/analytics/track";
import { loginWithPersona } from "../lib/session";

export function renderLoginPage(): HTMLElement {
  const smokePersona = getRegisteredReaderPersona();
  const main = document.createElement("main");
  main.className = "page-main account-page";

  main.innerHTML = `
    <section class="form-panel">
      <h1>Simulated login</h1>
      <p class="simulation-label">Preset demo credentials only — no real authentication.</p>
      <form data-login-form class="stacked-form">
        <label for="login-email">Email (preset)</label>
        <input id="login-email" name="email" type="email" value="${smokePersona.presetEmail}" autocomplete="username" />
        <label for="login-persona">Persona</label>
        <select id="login-persona" name="persona">
          ${personas
            .filter((p) => p.id !== "anonymous")
            .map((p) => `<option value="${p.id}" ${p.id === smokePersona.id ? "selected" : ""}>${p.label}</option>`)
            .join("")}
        </select>
        <p class="form-hint">Smoke persona id: <code>${smokePersona.id}</code></p>
        <button type="submit">Log in (simulated)</button>
      </form>
      <p>New here? <a href="#/account/register" data-register-link>Simulated registration</a></p>
    </section>
  `;

  const personaSelect = main.querySelector("#login-persona");
  const emailInput = main.querySelector("#login-email");

  personaSelect?.addEventListener("change", () => {
    const persona = personas.find((item) => item.id === (personaSelect as HTMLSelectElement).value);
    if (persona && emailInput instanceof HTMLInputElement && persona.presetEmail) {
      emailInput.value = persona.presetEmail;
    }
  });

  main.querySelector("[data-login-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const personaId = (personaSelect as HTMLSelectElement).value;
    loginWithPersona(personaId);
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
