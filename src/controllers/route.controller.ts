import { ReactiveControllerHost, noChange } from "lit";
import { ChildPart, DirectiveParameters, directive } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";
import { Route } from "../models/route.model";
import { routerService } from "../services";

class RouteDirective extends AsyncDirective {
  private currentRoute?: string;

  update(part: ChildPart, [route]: DirectiveParameters<this>) {
    // target element can be accessed from part
    return this.render(route);
  }

  render(route?: Route) {
    if (this.currentRoute === route?.name) {
      return noChange;
    }
    this.currentRoute = route?.name;
    route?.component().then((resolvedValue) => {
      // Rendered asynchronously:
      this.setValue(resolvedValue);
    });
    return noChange;
  }
}
const routeDirective = directive(RouteDirective);

export class RouteController {
  private host: ReactiveControllerHost;
  private routerId: string;

  activeRoute?: Route;
  pathParams: Record<string, any>;
  queryParams: Record<string, any>;


  navigation() {
    return routeDirective(this.activeRoute);
  }

  _changeRoute = (e: CustomEvent) => {
    this.activeRoute = e.detail;
    this.queryParams = routerService.parseQueryParams();
    if (this.activeRoute) {
      const uri = decodeURI(window.location.pathname);
      if (!Array.isArray(this.activeRoute.pattern)) {
        this.pathParams = routerService.parsePathParams(this.activeRoute.pattern, uri);
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
    window.addEventListener(
      routerService.ROUTE_EVENT + '_' + this.routerId,
      this._changeRoute as EventListener
    );
    routerService.refresh();
  }

  hostDisconnected() {
    window.removeEventListener(
      routerService.ROUTE_EVENT + '_' + this.routerId,
      this._changeRoute as EventListener
    );
    routerService.unregisterRoutes(this.routerId);
  }
}
