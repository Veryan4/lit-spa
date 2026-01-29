import { Route, State } from "../models";
import { hashService } from "./hash.service";

const ROUTE_ROOT = "root";

class RouterState<T> extends State<T> {
  override getValue(): T {
    return this.value;
  }
}

type PatternMatch = {
  params: Record<string, string>;
  remainder: string;
  complete: boolean;
  score: number;
};

type RouteSelection = {
  route: RouteMap;
  params: Record<string, string>;
  remainder: string;
};

class RouteMap extends Route {
  children?: { [routerId: string]: RouteMap[] };
}

const routerStateMap = new Map<string, RouterState<Route>>();
routerStateMap.set(ROUTE_ROOT, new RouterState<Route>());

const navigationGeneration = new Map<string, number>();

let routes: RouteMap[] = [];
let nextRouterId = 0;
let historyListenerInstalled = false;

export const routerService = {
  refresh,
  parseQueryString,
  parsePathParams,
  parseQueryParams,
  navigate,
  registerRoutes,
  unregisterRoutes,
  routerStateMap,
};

function ensureHistoryListener() {
  if (historyListenerInstalled || typeof window === "undefined") return;
  historyListenerInstalled = true;
  window.addEventListener("popstate", () => {
    refresh();
  });
}

function safeDecode(value: string): string {
  try {
    return decodeURI(value);
  } catch {
    return value;
  }
}

function splitPath(uri: string): string[] {
  return safeDecode(uri)
    .split("/")
    .filter((segment) => segment.length > 0);
}

function refresh() {
  changeRoute(routes, window.location.pathname);
}

function navigate(href: string): void {
  ensureHistoryListener();
  const next = normalizeHref(href);
  window.history.pushState({}, "", next);
  applyHash(next);
  refresh();
}

function normalizeHref(href: string): string {
  if (!href) return "/";
  if (/^(https?:|\/|\.|#|\?)/.test(href)) return href;
  return `/${href}`;
}

function applyHash(href: string) {
  const url = new URL(href, window.location.href);
  const hash = url.hash.startsWith("#") ? url.hash.slice(1) : "";
  hashService.state.update(hash);
}

function parseQueryString(querystring: string): Record<string, string> {
  if (!querystring) return {};
  const query = querystring.startsWith("?") ? querystring.slice(1) : querystring;
  const params = new URLSearchParams(query);
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

function parsePathParams(
  pattern: string | string[],
  uri: string,
): Record<string, string> {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  let best: PatternMatch | undefined;
  for (const item of patterns) {
    if (!item || item === "*") continue;
    const match = matchPattern(item, uri);
    if (!match) continue;
    if (!best || match.score > best.score || (match.complete && !best.complete)) {
      best = match;
    }
  }
  return best?.params ?? {};
}

function parseQueryParams() {
  const urlSearchParams = new URLSearchParams(location.search);
  const queryParams: Record<string, string> = {};
  for (const [key, value] of urlSearchParams.entries()) {
    queryParams[key] = value;
  }
  return queryParams;
}

function matchPattern(pattern: string, uri: string): PatternMatch | null {
  if (pattern === "*") {
    return {
      params: {},
      remainder: splitPath(uri).join("/"),
      complete: true,
      score: 0,
    };
  }

  const patternParts = pattern.split("/").filter((part) => part.length > 0);
  const uriParts = splitPath(uri);
  const params: Record<string, string> = {};

  for (let index = 0; index < patternParts.length; index++) {
    const part = patternParts[index];
    if (part === "*") {
      return {
        params,
        remainder: uriParts.slice(index).join("/"),
        complete: true,
        score: index,
      };
    }
    const value = uriParts[index];
    if (value == null) return null;
    if (part.startsWith(":")) {
      params[part.slice(1)] = value;
      continue;
    }
    if (part !== value) return null;
  }

  const remainder = uriParts.slice(patternParts.length).join("/");
  return {
    params,
    remainder,
    complete: remainder.length === 0,
    score: patternParts.length,
  };
}

function patternsOf(route: RouteMap): string[] {
  if (Array.isArray(route.pattern)) return route.pattern;
  return [route.pattern];
}

function isCatchAll(route: RouteMap): boolean {
  const patterns = patternsOf(route);
  return patterns.length > 0 && patterns.every((pattern) => pattern === "*");
}

function bestMatchForRoute(route: RouteMap, uri: string): PatternMatch | null {
  let bestComplete: PatternMatch | null = null;
  let bestPartial: PatternMatch | null = null;
  for (const pattern of patternsOf(route)) {
    if (pattern === "*") continue;
    const match = matchPattern(pattern, uri);
    if (!match) continue;
    if (match.complete) {
      if (!bestComplete || match.score > bestComplete.score) bestComplete = match;
    } else if (!bestPartial || match.score > bestPartial.score) {
      bestPartial = match;
    }
  }
  return bestComplete ?? bestPartial;
}

function selectRoute(
  routeMap: RouteMap[],
  searchString: string,
): RouteSelection | undefined {
  let best: (RouteSelection & { score: number }) | undefined;
  for (const route of routeMap) {
    if (isCatchAll(route)) continue;
    const match = bestMatchForRoute(route, searchString);
    if (!match) continue;
    if (!match.complete && !childConsumes(route, match.remainder)) continue;
    if (!best || match.score > best.score) {
      best = {
        route,
        params: match.params,
        remainder: match.remainder,
        score: match.score,
      };
    }
  }
  if (best) {
    return { route: best.route, params: best.params, remainder: best.remainder };
  }
  const wildcard = routeMap.find((route) => isCatchAll(route));
  if (!wildcard) return undefined;
  return {
    route: wildcard,
    params: {},
    remainder: splitPath(searchString).join("/"),
  };
}

function childConsumes(route: RouteMap, remainder: string): boolean {
  if (!route.children) return false;
  return Object.values(route.children).some(
    (childRoutes) => selectRoute(childRoutes, remainder) != null,
  );
}

function registerRoutes(newRoutes: Route[]) {
  ensureHistoryListener();
  const uri = window.location.pathname;
  if (nextRouterId) {
    const parentRoute = findParentRoute(routes, uri);
    if (parentRoute) {
      const routerId = String(nextRouterId);
      nextRouterId += 1;
      parentRoute.children = {
        ...(parentRoute.children ?? {}),
        [routerId]: [...newRoutes],
      };
      routerStateMap.set(routerId, new RouterState<Route>());
      return routerId;
    }
  }
  nextRouterId += 1;
  routes = [...routes, ...newRoutes];
  return ROUTE_ROOT;
}

function unregisterRoutes(routerId: string, oldRoutes = routes): boolean {
  if (routerId === ROUTE_ROOT) {
    return false;
  }
  return oldRoutes.some((route) => {
    if (!route.children) return false;
    if (route.children[routerId]) {
      delete route.children[routerId];
      routerStateMap.delete(routerId);
      navigationGeneration.delete(routerId);
      return true;
    }
    return Object.keys(route.children).some((key) => {
      return unregisterRoutes(routerId, route.children![key]);
    });
  });
}

function findParentRoute(
  searchRoutes: RouteMap[],
  searchString: string,
): RouteMap | undefined {
  let best: { route: RouteMap; match: PatternMatch } | undefined;
  for (const route of searchRoutes) {
    if (isCatchAll(route)) continue;
    const match = bestMatchForRoute(route, searchString);
    if (!match) continue;
    if (!best || match.score > best.match.score) best = { route, match };
  }
  if (!best) return undefined;
  if (best.route.children && best.match.remainder) {
    for (const group of Object.values(best.route.children)) {
      const deeper = findParentRoute(group, best.match.remainder);
      if (deeper) return deeper;
    }
  }
  return best.route;
}

function bumpGeneration(routerId: string): number {
  const next = (navigationGeneration.get(routerId) ?? 0) + 1;
  navigationGeneration.set(routerId, next);
  return next;
}

function changeRoute(
  routeMap: RouteMap[],
  searchString: string,
  routerId = ROUTE_ROOT,
) {
  const generation = bumpGeneration(routerId);
  const selected = selectRoute(routeMap, searchString);
  if (!selected) return;

  const publish = () => {
    if (navigationGeneration.get(routerId) !== generation) return;
    const published: Route = { ...selected.route, params: selected.params };
    routerStateMap.get(routerId)?.update(published);
    triggerChildRouteChange(selected.route, selected.remainder);
  };

  if (!selected.route.guard) {
    publish();
    return;
  }

  selected.route
    .guard()
    .then(() => {
      publish();
    })
    .catch((errorRoute: unknown) => {
      if (navigationGeneration.get(routerId) !== generation) return;
      const target = typeof errorRoute === "string" ? errorRoute : "";
      const redirected =
        (target && selectRoute(routeMap, target)?.route) ||
        findRouteByName(routeMap, target);
      if (!redirected) return;
      const href = hrefForRoute(redirected, target);
      window.history.pushState({}, "", href);
      applyHash(href);
      refresh();
    });
}

function findRouteByName(
  routeMap: RouteMap[],
  name: string,
): RouteMap | undefined {
  for (const route of routeMap) {
    if (route.name === name) return route;
    if (!route.children) continue;
    for (const group of Object.values(route.children)) {
      const found = findRouteByName(group, name);
      if (found) return found;
    }
  }
  return undefined;
}

function hrefForRoute(route: RouteMap, requested: string): string {
  if (requested) {
    const match = bestMatchForRoute(route, requested);
    if (match?.complete || route.name === requested) {
      const concrete = requested.split("?")[0].split("#")[0];
      if (concrete && !concrete.includes(":")) {
        return concrete.startsWith("/") ? concrete : `/${concrete}`;
      }
    }
  }
  const pattern = patternsOf(route).find(
    (item) => item && item !== "*" && !item.includes("*") && !item.includes(":"),
  );
  if (!pattern) return "/";
  return pattern.startsWith("/") ? pattern : `/${pattern}`;
}

function triggerChildRouteChange(route: RouteMap, remainder: string) {
  if (!route.children) return;
  for (const [key, childRoutes] of Object.entries(route.children)) {
    changeRoute(childRoutes, remainder, key);
  }
}
