import { LitElement, ReactiveControllerHost, noChange } from "lit";
import { ChildPart, DirectiveParameters, directive } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";
import { Route } from "../models/route.model";
import { routerService } from "../services";

class RouteDirective extends AsyncDirective {
  private currentRoute?: string;

  update(_part: ChildPart, [route]: DirectiveParameters<this>) {
    return this.render(route);
  }

  render(route?: Route) {
    if (this.currentRoute === route?.name) {
      return noChange;
    }
    this.currentRoute = route?.name;
    route?.component().then((resolvedValue) => {
      this.setValue(resolvedValue);
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
  pathParams: Record<string, any>;
  queryParams: Record<string, any>;

  navigation() {
    return routeDirective(this.activeRoute);
  }

  _changeRoute = (route: Route) => {
    this.activeRoute = route;
    this.queryParams = routerService.parseQueryParams();
    if (this.activeRoute) {
      const uri = decodeURI(window.location.pathname);
      if (!Array.isArray(this.activeRoute.pattern)) {
        this.pathParams = routerService.parsePathParams(
          this.activeRoute.pattern,
          uri,
        );
      }
      this.host.requestUpdate();
    }
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
