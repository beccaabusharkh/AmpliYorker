import "./styles/tokens.css";
import { getCurrentRoute, onRouteChange, type Route } from "./lib/router";
import { renderArticlePage } from "./pages/article";
import { renderAuthorPage } from "./pages/author";
import { renderHomePage } from "./pages/home";
import { renderNotFoundPage } from "./pages/not-found";
import { renderSearchPage } from "./pages/search";
import { renderTopicPage } from "./pages/topic";
import { renderFooter, renderHeader } from "./ui/shell";
import { mountDiscoveryChat } from "./ui/discovery-chat";

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
    case "search":
      return renderSearchPage(route.query);
    case "topic":
      return renderTopicPage(route.slug);
    case "author":
      return renderAuthorPage(route.slug);
    default:
      return renderNotFoundPage();
  }
}

function renderApp(route: Route): void {
  const shell = document.createElement("div");
  shell.className = "app-shell";
  shell.append(renderHeader(), renderContent(route), renderFooter());
  appRoot.replaceChildren(shell);
  mountDiscoveryChat(appRoot);
}

const initialRoute = getCurrentRoute();
if (!window.location.hash) {
  window.location.hash = "#/";
}
renderApp(initialRoute || getCurrentRoute());
onRouteChange(renderApp);
