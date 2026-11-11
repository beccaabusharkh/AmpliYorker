export type Route =
  | { name: "home" }
  | { name: "article"; id: string }
  | { name: "notFound" };

function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, "").trim();
  if (!path || path === "/") {
    return { name: "home" };
  }
  const segments = path.split("/").filter(Boolean);
  if (segments[0] === "article" && segments[1]) {
    return { name: "article", id: decodeURIComponent(segments[1]) };
  }
  return { name: "notFound" };
}

export function getCurrentRoute(): Route {
  return parseHash(window.location.hash);
}

export function navigateToHash(hash: string): void {
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}

export function onRouteChange(listener: (route: Route) => void): () => void {
  const handler = () => listener(getCurrentRoute());
  window.addEventListener("hashchange", handler);
  return () => window.removeEventListener("hashchange", handler);
}
