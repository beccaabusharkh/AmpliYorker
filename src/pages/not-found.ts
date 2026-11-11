import { navigateToHash } from "../lib/router";

export function renderNotFoundPage(): HTMLElement {
  const main = document.createElement("main");
  main.className = "page-main";
  main.innerHTML = `
    <section class="not-found">
      <h1>Page not found</h1>
      <p>That hash route is not implemented yet.</p>
      <p><a href="#/" data-home-link>Go to Amplitude Daily home</a></p>
    </section>
  `;
  main.querySelector("[data-home-link]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToHash("#/");
  });
  return main;
}
