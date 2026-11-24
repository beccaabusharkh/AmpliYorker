import "./styles/tokens.css";
import "./styles/editorial.css";
import { syncReaderUserProperties } from "./lib/analytics/user-properties";
import { initAmplitude } from "./lib/amplitude/init";
import { initStatsig } from "./lib/statsig/init";
import { getCurrentRoute, onRouteChange, type Route } from "./lib/router";
import { recordVisit } from "./lib/session";
import { renderAccountPage } from "./pages/account";
import { renderArticlePage } from "./pages/article";
import { renderAuthorPage } from "./pages/author";
import { renderCheckoutConfirmationPage } from "./pages/checkout-confirmation";
import { renderCheckoutPage } from "./pages/checkout";
import { renderHomePage } from "./pages/home";
import { renderLoginPage } from "./pages/login";
import { renderNotFoundPage } from "./pages/not-found";
import { renderRegisterPage } from "./pages/register";
import { renderSearchPage } from "./pages/search";
import { renderSubscribePage } from "./pages/subscribe";
import { renderTopicPage } from "./pages/topic";
import { mountAccountSupportChat } from "./ui/account-support-chat";
import { renderFooter, renderHeader, renderSkipLink } from "./ui/shell";
import { mountDiscoveryChat } from "./ui/discovery-chat";
import { mountExposureInspector } from "./ui/exposure-inspector";

const rootEl = document.querySelector("#app");
if (!(rootEl instanceof HTMLElement)) {
  throw new Error("Missing #app mount point");
}
const appRoot: HTMLElement = rootEl;

recordVisit();

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
    case "accountRegister":
      return renderRegisterPage();
    case "accountLogin":
      return renderLoginPage();
    case "account":
      return renderAccountPage();
    case "subscribe":
      return renderSubscribePage();
    case "checkout":
      return renderCheckoutPage();
    case "checkoutConfirmation":
      return renderCheckoutConfirmationPage();
    default:
      return renderNotFoundPage();
  }
}

function renderApp(route: Route): void {
  const shell = document.createElement("div");
  shell.className = "app-shell";
  const content = renderContent(route);
  if (content.classList.contains("page-main") && !content.id) {
    content.id = "page-main";
  }
  shell.append(renderSkipLink(), renderHeader(), content, renderFooter());
  appRoot.replaceChildren(shell);
  mountDiscoveryChat(appRoot);
  mountAccountSupportChat(appRoot);
  mountExposureInspector(appRoot);
}

async function boot(): Promise<void> {
  await initAmplitude();
  await initStatsig();
  syncReaderUserProperties();
  const initialRoute = getCurrentRoute();
  if (!window.location.hash) {
    window.location.hash = "#/";
  }
  renderApp(initialRoute || getCurrentRoute());
  onRouteChange(renderApp);
}

void boot();
