import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import {
  Route,
  RouteController,
  TranslationController,
  hashService,
  routerService,
} from "./demo-tools";
import { routes } from "./app.routes";
import { styles } from "./app.styles";

@customElement("my-app")
class LitApp extends LitElement {
  static styles = [styles];

  @query("#nav-background")
  backgroundElement: HTMLElement;

  private router = new RouteController(this, routes);
  private i18n = new TranslationController(this, {
    supportedLanguages: ["en", "fr"],
  });

  render() {
    this.handleLater();
    const formattedHash = location.hash.substring(1);
    return html`
      <div class="app">
        <div class="side-nav">
          <div class="logo"></div>
          <div id="nav-background"></div>
          ${routes.map(
            (route) =>
              html`<div
                  class="nav-item ${classMap({
                    selected:
                      this.router.activeRoute?.name == route.name &&
                      !formattedHash,
                  })}"
                  @click=${(e: Event) => this.selectedNavItem(e, route)}
                >
                  ${this.formatRouteName(route.name)}
                </div>
                ${route.hashes?.length
                  ? html`
                      <div
                        class="hash-list ${classMap({
                          hidden: this.router.activeRoute?.name != route.name,
                        })}"
                      >
                        ${route.hashes.map(
                          (hash) =>
                            html`<div
                              class="nav-item nav-hash ${classMap({
                                selected: formattedHash == hash,
                              })}"
                              @click=${(e: Event) =>
                                this.selectedHashItem(e, route, hash)}
                            >
                              ${this.formatRouteName(hash)}
                            </div>`,
                        )}
                      </div>
                    `
                  : ""} `,
          )}
        </div>
        <div class="main">${this.router.navigation()}</div>
      </div>
      <lit-spa-toast></lit-spa-toast>
    `;
  }

  protected shouldUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): boolean {
    return this.i18n.hasLoadedTranslations;
  }

  formatRouteName(routeName: string) {
    return routeName
      .split("-")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" ");
  }

  selectedNavItem(e: Event, route: Route) {
    this.selectItem(e);
    routerService.navigate(route.name);
  }

  selectedHashItem(e: Event, route: Route, hash: string) {
    this.selectItem(e);
    if (this.router.activeRoute?.name == route.name) {
      hashService.updateHash(hash);
      return;
    }
    routerService.navigate(route.name + "#" + hash);
  }

  selectItem(e: Event) {
    const rect = (<HTMLElement>e.target).getBoundingClientRect();
    Object.assign(this.backgroundElement.style, {
      left: `${rect.x}px`,
      top: `${rect.y}px`,
      width: `${rect.width + 16}px`,
    });
    this.requestUpdate();
  }

  handleLater(): void {
    setTimeout(() => {
      const element =
        this.shadowRoot?.querySelector(".selected.nav-hash") ??
        this.shadowRoot?.querySelector(".selected");
      const rect = element?.getBoundingClientRect();
      if (rect) {
        Object.assign(this.backgroundElement.style, {
          left: `${rect.x}px`,
          top: `${rect.y}px`,
          width: `${rect.width + 16}px`,
        });
      }
    });
  }
}
