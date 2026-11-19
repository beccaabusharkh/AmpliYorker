import { navigateToHash } from "../lib/router";
import { getPageParams } from "../lib/statsig/page-params";

export function renderNotFoundPage(): HTMLElement {
  const p = getPageParams("not_found");
  const main = document.createElement("main");
  main.className = "page-main";
  main.innerHTML = `
    <section class="not-found">
      <h1>${p.page_title}</h1>
      <p>${p.body_copy}</p>
      <p><a href="#/" data-home-link>${p.home_link_label}</a></p>
    </section>
  `;
  main.querySelector("[data-home-link]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToHash("#/");
  });
  return main;
}
