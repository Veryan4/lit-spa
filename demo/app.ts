import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";
import { classMap } from "lit-html/directives/class-map.js";
import {
  RouteController,
  TranslationController,
  routerService
} from "./demo-tools";
import { routes } from "./app.routes";

@customElement("my-app")
class LitApp extends LitElement {
  static styles = [
    css`
      .app {
        display: flex;
      }
      .side-nav {
        position: fixed;
        min-width: 10rem;
        width: 10rem;
        display: flex;
        flex-direction: column;
        background-color: #b0bec5;
        justify-content: center;
        gap: 0.25rem;
        min-height: 100dvh;
        max-height: 100dvh;
      }
      .nav-item {
        height: 2rem;
        font-size: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        cursor: pointer;
        background-color: #e8e8e8;
      }
      .nav-item.selected,
      .nav-item:hover {
        background-color: #2c2c2c;
        color: #fafafa;
        font-weight: bold;
      }
      .main {
        position: absolute;
        left: 10rem;
        padding: 1rem 2rem;
        display: flex;
        justify-content: center;
      }
      .logo {
        position: fixed;
        top: 1rem;
        left: 3rem;
        height: 5.1rem;
        width: 4rem;
        background-image: url(/lit-spa.png);
        background-size: cover;
        background-repeat: no-repeat;
      }
      @media only screen and (max-width: 752px) {
        .main {
          padding: 1rem;
        }
      }
    `,
  ];

  private router = new RouteController(this, routes);
  private i18n = new TranslationController(this);

  render() {
    return html`
      <div class="app">
        <div class="side-nav">
          <div class="logo"></div>
          ${routes.map(
            (route) =>
              html`<div
                class="nav-item ${classMap({
                  selected: this.router.activeRoute?.name == route.name,
                })}"
                @click=${() => routerService.navigate(route.name)}
              >
                ${this.formatRouteName(route.name)}
              </div>`
          )}
        </div>
        <div class="main">${this.router.navigation()}</div>
      </div>
      <lit-spa-toast></lit-spa-toast>
    `;
  }

  protected shouldUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): boolean {
    return this.i18n.hasLoadedTranslations;
  }

  formatRouteName(routeName: string) {
    return routeName
      .split("-")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" ");
  }

}
