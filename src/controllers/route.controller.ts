import { ReactiveControllerHost, noChange, html } from "lit";
import { ChildPart, DirectiveParameters, directive } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";
import { Route } from "../models/route.model";
import { routerService } from "../services";
import "../components/loader/loader";

class RouteDirective extends AsyncDirective {
  private currentRoute: string;

  update(part: ChildPart, [route]: DirectiveParameters<this>) {
    // target element can be accessed from part
    return this.render(route);
  }

  render(route: Route) {
    if (this.currentRoute === route.name) {
      return noChange;
    }
    this.currentRoute = route.name;
    route.component().then((resolvedValue) => {
      // Rendered asynchronously:
      this.setValue(resolvedValue);
    });
    return html`<lit-spa-loader></lit-spa-loader>`;
  }
}
const routeDirective = directive(RouteDirective);

export class RouteController {
  private host: ReactiveControllerHost;

  activeRoute: Route;
  pathParams: Record<string, any>;
  queryParams: Record<string, any>;

  routes: Route[] = [];

  navigation() {
    return routeDirective(this.activeRoute);
  }

  _changeRoute = (e?: CustomEvent) => {
    const uri = decodeURI(window.location.pathname);
    let nextRoute = this.routes.find((route) =>
      routerService.testRoute(uri, route.pattern)
    );
    if (!nextRoute) {
      nextRoute = this.routes.find((route) => route.pattern === "*");
    }
    if (!nextRoute) {
      return;
    }
    this.queryParams = routerService.parseQueryParams();
    if (typeof nextRoute.pattern == "string") {
      this.pathParams = routerService.parsePathParams(nextRoute.pattern, uri);
    }
    if (nextRoute.name === this.activeRoute.name) {
      return;
    }
    if (!nextRoute.guard) {
      this.activeRoute = nextRoute;
      this.host.requestUpdate();
      return;
    }
    nextRoute
      .guard()
      .then(() => {
        this.activeRoute = nextRoute!;
        this.host.requestUpdate();
      })
      .catch((errorRoute) => {
        const errRoute = this.routes.find(
          (route) => route.pattern === errorRoute
        );
        if (errRoute) {
          this.activeRoute = errRoute;
          window.history.pushState({}, "", errRoute.name);
          this.host.requestUpdate();
        }
      });
  };

  constructor(host: ReactiveControllerHost, routes: Route[]) {
    this.host = host;
    this.routes = routes;
    const homeRoute = this.routes.find((route) => route.pattern === "");
    if (homeRoute) {
      this.activeRoute = homeRoute;
    }
    host.addController(this);
    this._changeRoute();
  }

  hostConnected() {
    window.addEventListener(
      routerService.ROUTE_EVENT,
      this._changeRoute as EventListener
    );
  }

  hostDisconnected() {
    window.removeEventListener(
      routerService.ROUTE_EVENT,
      this._changeRoute as EventListener
    );
  }
}
