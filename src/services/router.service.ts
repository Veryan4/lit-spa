import { Route, State } from "../models";

const ROUTE_ROOT = "root";

const routerStateMap = new Map<string, State<Route>>();
routerStateMap.set(ROUTE_ROOT, new State<Route>(undefined, true));

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

class RouteMap extends Route {
  children?: { [routerId: string]: RouteMap[] };
}
let routes: RouteMap[] = [];
let nextRouterId = 0;

window.onpopstate = () => {
  refresh();
};

function refresh() {
  const uri = decodeURI(window.location.pathname);
  changeRoute(routes, uri);
}

function navigate(href: string): void {
  window.history.pushState({}, "", href);
  refresh();
}

function parseQueryString(querystring: string): any {
  return querystring
    ? JSON.parse(
        '{"' +
          querystring.substring(1).replace(/&/g, '","').replace(/=/g, '":"') +
          '"}',
      )
    : {};
}

function parsePathParams(pattern: string, uri: string): Record<string, string> {
  const params: Record<string, string> = {};
  const patternArray = pattern.split("/").filter((path) => path != "");
  const uriArray = uri.split("/").filter((path) => path != "");
  patternArray.map((pattern: string, i: number) => {
    if (/^:/.test(pattern)) {
      params[pattern.substring(1)] = uriArray[i];
    }
  });
  return params;
}

function parseQueryParams() {
  const urlSearchParams = new URLSearchParams(location.search);
  const queryParams: Record<string, any> = {};
  for (const [key, value] of urlSearchParams.entries()) {
    queryParams[key] = value;
  }
  return queryParams;
}

function patternToRegExp(pattern: string): RegExp {
  if (pattern) {
    return new RegExp(
      "^(|/)" +
        pattern.replace(
          /:[^\s/]+/g,
          "([\\w\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff-]+)",
        ) +
        "(|/)",
    );
  } else {
    return new RegExp("(^$|^/$)");
  }
}

function testRoute(uri: string, patterns: string | string[]): boolean | void {
  if (typeof patterns == "string") {
    patterns = [patterns];
  }
  return patterns.some((pattern) => patternToRegExp(pattern).test(uri));
}

function registerRoutes(newRoutes: Route[]) {
  const uri = decodeURI(window.location.pathname);
  if (nextRouterId) {
    const parentRoute = findParentRouteInRouteMap(routes, uri);
    if (parentRoute) {
      const routerId = nextRouterId;
      parentRoute.children = {
        [routerId]: [...newRoutes],
      };
      routerStateMap.set(String(routerId), new State<Route>(undefined, true));
      nextRouterId += 1;
      return String(routerId);
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
    if (route.children) {
      if (route.children[routerId]) {
        delete route.children[routerId];
        routerStateMap.delete(routerId);
        return true;
      }
      return Object.keys(route.children).some((key) => {
        return unregisterRoutes(routerId, route.children![key]);
      });
    }
    return false;
  });
}

function findParentRouteInRouteMap(
  searchRoutes: RouteMap[],
  searchString: string,
) {
  const parentRoute = findRoute(searchRoutes, searchString);
  if (parentRoute?.children) {
    let newParent: RouteMap | undefined;
    if (Array.isArray(parentRoute.pattern)) {
      parentRoute.pattern.forEach((p) => searchString.replace(p, ""));
    } else {
      searchString.replace(parentRoute.pattern, "");
    }
    Object.keys(parentRoute.children).find((key) => {
      const childRoutes = parentRoute.children![key];
      const found = findParentRouteInRouteMap(childRoutes, searchString);
      if (found) {
        newParent = found;
        return true;
      }
      return false;
    });
    if (newParent) {
      return newParent;
    }
  }
  return parentRoute;
}

function findRoute(searchRoutes: RouteMap[], searchString: string) {
  return searchRoutes.find((route) => {
    if (Array.isArray(route.pattern)) {
      return route.pattern.some((p) => testRoute(searchString, p));
    } else {
      return testRoute(searchString, route.pattern);
    }
  });
}

function changeRoute(
  routeMap: RouteMap[],
  searchString: string,
  routerId = ROUTE_ROOT,
) {
  let nextRoute = findRoute(routeMap, searchString);
  if (!nextRoute) {
    nextRoute = findRoute(routeMap, "*");
  }
  if (!nextRoute) {
    return;
  }
  if (!nextRoute.guard) {
    routerStateMap.get(routerId)?.update(nextRoute);
    triggerChildRouteChange(nextRoute!, searchString);
    return;
  }
  nextRoute
    .guard()
    .then(() => {
      routerStateMap.get(routerId)?.update(nextRoute);
      triggerChildRouteChange(nextRoute!, searchString);
    })
    .catch((errorRoute) => {
      const errRoute = findRoute(routeMap, errorRoute);
      if (errRoute) {
        window.history.pushState({}, "", errRoute.name);
        routerStateMap.get(routerId)?.update(errRoute);
      }
    });
}

function triggerChildRouteChange(route: RouteMap, searchString: string) {
  if (route?.children) {
    if (Array.isArray(route.pattern)) {
      route.pattern.forEach(
        (p) =>
          (searchString = searchString.replace(new RegExp("^(|/)" + p), "")),
      );
    } else {
      searchString = searchString.replace(
        new RegExp("^(|/)" + route.pattern),
        "",
      );
    }
    Object.keys(route.children).find((key) => {
      const childRoutes = route!.children![key];
      const found = findRoute(childRoutes, searchString);
      if (found) {
        changeRoute(childRoutes, searchString, key);
        return true;
      }
      return false;
    });
  }
}
