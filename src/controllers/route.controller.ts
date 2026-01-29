import { ReactiveControllerHost, noChange } from "lit";
import { ChildPart, DirectiveParameters, directive } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";
import { Route } from "../models/route.model";
import { routerService } from "../services";

class RouteDirective extends AsyncDirective {
  private currentRoute?: string;
  private requestId = 0;

  update(_part: ChildPart, [route]: DirectiveParameters<this>) {
    return this.render(route);
  }

  render(route?: Route) {
    if (this.currentRoute === route?.name) {
      return noChange;
    }
    this.currentRoute = route?.name;
    const requestId = ++this.requestId;
    const requested = route?.name;
    route
      ?.component()
      .then((resolvedValue) => {
        if (this.requestId !== requestId || this.currentRoute !== requested) {
          return;
        }
        this.setValue(resolvedValue);
      })
      .catch(() => {
        // A newer navigation owns the outlet. Ignore the stale failure.
      });
    return noChange;
  }
}
const routeDirective = directive(RouteDirective);

export class RouteController {
  private host: ReactiveControllerHost;
  private routerId: string;
  private unsubscribe?: () => boolean;

  activeRoute?: Route;
  pathParams: Record<string, string> = {};
  queryParams: Record<string, string> = {};

  navigation() {
    return routeDirective(this.activeRoute);
  }

  _changeRoute = (route: Route) => {
    this.activeRoute = route;
    this.queryParams = routerService.parseQueryParams();
    if (!this.activeRoute) return;
    this.pathParams =
      route.params ??
      routerService.parsePathParams(
        this.activeRoute.pattern,
        window.location.pathname,
      );
    this.host.requestUpdate();
  };

  constructor(host: ReactiveControllerHost, routes: Route[]) {
    this.routerId = routerService.registerRoutes(routes);
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    this.unsubscribe = routerService.routerStateMap
      .get(this.routerId)
      ?.subscribe(this._changeRoute);
    routerService.refresh();
  }

  hostDisconnected() {
    this.unsubscribe?.();
    routerService.unregisterRoutes(this.routerId);
  }
}
