import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { ThemeController, themeService } from "../../demo-tools";
import "../../demo-tools";

@customElement("theme-demo")
class ThemeDemo extends LitElement {
  static styles = [
    css`
      .themed {
        color: var(--color);
        background-color: var(--background-color);
      }
    `,
  ];

  private theme = new ThemeController(this);

  constructor() {
    super();
  }

  render() {
    return html`
      <button @click=${this.changeTheme}>Change Theme</button>
      <div class="themed">Current theme : ${this.theme.value}</div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.registerThemes();
  }

  registerThemes() {
    themeService.registerThemes({
      light: {
        "--color": "#2c2c2c",
        "--background-color": "#fafafa",
      },
      dark: {
        "--color": "#fafafa",
        "--background-color": "#2c2c2c",
      },
    });
  }

  changeTheme() {
    if (this.theme.value == "light") {
      themeService.changeTheme("dark");
    } else {
      themeService.changeTheme("light");
    }
  }
}
