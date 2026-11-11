import "./styles/tokens.css";
import { getCurrentRoute, onRouteChange, type Route } from "./lib/router";
import { renderArticlePage } from "./pages/article";
import { renderHomePage } from "./pages/home";
import { renderNotFoundPage } from "./pages/not-found";
import { renderFooter, renderHeader } from "./ui/shell";

const rootEl = document.querySelector("#app");
if (!(rootEl instanceof HTMLElement)) {
  throw new Error("Missing #app mount point");
}
const appRoot: HTMLElement = rootEl;

function renderContent(route: Route): HTMLElement {
  switch (route.name) {
    case "home":
      return renderHomePage();
    case "article":
      return renderArticlePage(route.id);
    default:
      return renderNotFoundPage();
  }
}

function renderApp(route: Route): void {
  const shell = document.createElement("div");
  shell.className = "app-shell";
  shell.append(renderHeader(), renderContent(route), renderFooter());
  appRoot.replaceChildren(shell);
}

const initialRoute = getCurrentRoute();
if (!window.location.hash) {
  window.location.hash = "#/";
}
renderApp(initialRoute || getCurrentRoute());
onRouteChange(renderApp);
