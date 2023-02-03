const ROUTE_EVENT = "lit-spa-route-update";

window.onpopstate = () => {
  window.dispatchEvent(new CustomEvent(ROUTE_EVENT));
};

export const routerService = {
  parseQuery,
  parsePathParams,
  patternToRegExp,
  testRoute,
  navigate,
  parseQueryParams,
  ROUTE_EVENT,
};

function navigate(href: string): void {
  window.history.pushState({}, "", href);
  window.dispatchEvent(new CustomEvent(ROUTE_EVENT));
}

function parseQuery(querystring: string): any {
  return querystring
    ? JSON.parse(
        '{"' +
          querystring.substring(1).replace(/&/g, '","').replace(/=/g, '":"') +
          '"}'
      )
    : {};
}

function parsePathParams(pattern: string, uri: string): Record<string, string> {
  const params: Record<string, string> = {};

  const patternArray = pattern.split("/").filter((path) => {
    return path != "";
  });
  const uriArray = uri.split("/").filter((path) => {
    return path != "";
  });

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
          "([\\w\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff-]+)"
        ) +
        "(|/)$"
    );
  } else {
    return new RegExp("(^$|^/$)");
  }
}

function testRoute(uri: string, pattern: string): boolean | void {
  if (patternToRegExp(pattern).test(uri)) {
    return true;
  }
}
