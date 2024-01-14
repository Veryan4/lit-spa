import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";
import { classMap } from "lit-html/directives/class-map.js";
import {
  RouteController,
  ToastController,
  TranslationController,
  routerService,
  themeService,
} from "../src";
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
      @media only screen and (max-width: 752px) {
        .main {
          padding: 1rem;
        }
      }
    `,
  ];

  private router = new RouteController(this, routes);
  private toaster = new ToastController(this);
  private i18n = new TranslationController(this);

  render() {
    return html`
      <div class="app">
        <div class="side-nav">
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
      ${this.toaster.wait()}
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

  connectedCallback(): void {
    super.connectedCallback();
    this.registerThemes();
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params && params.game) {
      sessionStorage.setItem("game", params.game);
    }
  }

  registerThemes() {
    const root = document.querySelector(":root") as HTMLElement;
    const primaryWhite = "#fafafa";
    const secondaryWhite = "white";
    const primaryBlack = "#2c2c2c";
    const secondaryBlack = "black";
    const imageColor = "unset";
    const invertedImageColor = "invert(100%)";
    const inputBackgroundColor = "#E8E8E8";
    const invertedInputBackgroundColor = "#696969";
    const outlineColor = "#b0bec5";
    const invertedOutlineColor = "#2c2c2c";
    const toastBackground = "#313131";
    const chipBackground = "#696969";
    themeService.registerThemes(root, {
      light: {
        "--primary-color": primaryBlack,
        "--primary-background-color": primaryWhite,
        "--secondary-background-color": secondaryWhite,
        "--image-color": imageColor,
        "--input-fill": inputBackgroundColor,
        "--outline-color": outlineColor,
        "--toast-background": toastBackground,
        "--chip-background": inputBackgroundColor,
      },
      dark: {
        "--primary-color": primaryWhite,
        "--primary-background-color": primaryBlack,
        "--secondary-background-color": secondaryBlack,
        "--image-color": invertedImageColor,
        "--input-fill": invertedInputBackgroundColor,
        "--outline-color": invertedOutlineColor,
        "--toast-background": secondaryBlack,
        "--chip-background": chipBackground,
      },
    } as any);
  }
}
