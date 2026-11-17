export type Route =
  | { name: "home" }
  | { name: "article"; id: string }
  | { name: "search"; query: string }
  | { name: "topic"; slug: string }
  | { name: "author"; slug: string }
  | { name: "accountRegister" }
  | { name: "accountLogin" }
  | { name: "account" }
  | { name: "subscribe" }
  | { name: "checkout" }
  | { name: "checkoutConfirmation" }
  | { name: "notFound" };

function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, "").trim();
  if (!path || path === "/") {
    return { name: "home" };
  }
  const segments = path.split("/").filter(Boolean);
  const root = segments[0];
  if (root === "article" && segments[1]) {
    return { name: "article", id: decodeURIComponent(segments[1]) };
  }
  if (root === "search") {
    return { name: "search", query: segments[1] ? decodeURIComponent(segments[1]) : "" };
  }
  if (root === "topic" && segments[1]) {
    return { name: "topic", slug: decodeURIComponent(segments[1]) };
  }
  if (root === "author" && segments[1]) {
    return { name: "author", slug: decodeURIComponent(segments[1]) };
  }
  if (root === "account") {
    if (segments[1] === "register") {
      return { name: "accountRegister" };
    }
    if (segments[1] === "login") {
      return { name: "accountLogin" };
    }
    return { name: "account" };
  }
  if (root === "subscribe") {
    return { name: "subscribe" };
  }
  if (root === "checkout") {
    if (segments[1] === "confirmation") {
      return { name: "checkoutConfirmation" };
    }
    return { name: "checkout" };
  }
  return { name: "notFound" };
}

export function getCurrentRoute(): Route {
  return parseHash(window.location.hash);
}

export function navigateToHash(hash: string): void {
  const normalized = hash.startsWith("#") ? hash : `#/${hash.replace(/^\//, "")}`;
  if (window.location.hash !== normalized) {
    window.location.hash = normalized;
  }
}

export function onRouteChange(listener: (route: Route) => void): () => void {
  const handler = () => listener(getCurrentRoute());
  window.addEventListener("hashchange", handler);
  return () => window.removeEventListener("hashchange", handler);
}
