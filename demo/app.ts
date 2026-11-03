import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import {
  Route,
  RouteController,
  ThemeController,
  TranslationController,
  routerService,
  themeService,
} from "./demo-tools";
import { routes } from "./app.routes";
import { styles } from "./app.styles";

@customElement("my-app")
class LitApp extends LitElement {
  static styles = [styles];

  @state()
  private menuOpen = false;

  private router = new RouteController(this, routes);
  private theme = new ThemeController(this);
  private i18n = new TranslationController(this, {
    supportedLanguages: ["en", "fr"],
  });

  render() {
    const hash = location.hash.replace(/^#/, "");
    return html`
      <div class="app">
        <header class="topbar">
          <button
            class="menu-btn"
            type="button"
            aria-expanded=${this.menuOpen ? "true" : "false"}
            aria-controls="site-nav"
            @click=${() => (this.menuOpen = !this.menuOpen)}
          >
            ${this.menuOpen ? "Close" : "Menu"}
          </button>
          <a
            class="logo"
            href="/"
            aria-label="lit-spa home"
            @click=${(event: MouseEvent) => this.follow(event, "/")}
          >
            <img src="/lit-spa.png" alt="" />
          </a>
          ${this.themeControl()}
        </header>
        <nav
          id="site-nav"
          class="side-nav ${classMap({ open: this.menuOpen })}"
          aria-label="Primary"
        >
          <a
            class="logo"
            href="/"
            aria-label="lit-spa home"
            @click=${(event: MouseEvent) => this.follow(event, "/")}
          >
            <img src="/lit-spa.png" alt="" />
          </a>
          ${this.themeControl("sidebar-theme")}
          ${routes.map((route) => this.routeLinks(route, hash))}
        </nav>
        <main class="main">${this.router.navigation()}</main>
      </div>
      <lit-spa-toast></lit-spa-toast>
    `;
  }

  constructor() {
    super();
    themeService.registerThemes();
    void this.i18n;
  }

  private themeControl(className = "") {
    const next = this.theme.value === "dark" ? "light" : "dark";
    return html`<div class="theme-control ${className}">
      <span class="theme-label">Theme</span>
      <button
        class="text-btn"
        type="button"
        aria-label="Switch to ${next} theme"
        @click=${() => themeService.changeTheme(next)}
      >
        ${next === "light" ? "Light" : "Dark"}
      </button>
    </div>`;
  }

  private routeLinks(route: Route, hash: string) {
    const href = route.name === "home" ? "/" : `/${route.name}`;
    const active = this.router.activeRoute?.name === route.name;
    return html`
      <a
        class="nav-item"
        href=${href}
        aria-current=${active && !hash ? "page" : nothing}
        @click=${(event: MouseEvent) => this.follow(event, href)}
      >
        ${this.formatRouteName(route.name)}
      </a>
      ${
        route.hashes?.length
          ? html`<div class="nav-group ${classMap({ open: active })}">
              ${route.hashes.map((item) => {
                const itemHref = `${href}#${item}`;
                return html`<a
                  class="nav-item sub"
                  href=${itemHref}
                  aria-current=${active && hash === item ? "page" : nothing}
                  @click=${(event: MouseEvent) => this.follow(event, itemHref)}
                >
                  ${this.formatRouteName(item)}
                </a>`;
              })}
            </div>`
          : nothing
      }
    `;
  }

  private formatRouteName(routeName: string) {
    const labels: Record<string, string> = {
      http: "HTTP",
      class: "State Class",
    };
    if (labels[routeName]) return labels[routeName];
    return routeName
      .split("-")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" ");
  }

  private follow(event: MouseEvent, href: string) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    this.menuOpen = false;
    routerService.navigate(href);
  }
}
