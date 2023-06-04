import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { ThemeController, themeService } from "../../demo-tools";
import "../../demo-tools";

@customElement("theme-demo")
class ThemeDemo extends LitElement {
  styles = [
    css`
      .body {
        color: var(--color);
        background-color: var(--background-color);
      }
    `,
  ];

  private theme = new ThemeController(this);

  constructor() {
    super();

    this.registerThemes();
  }

  render() {
    return html`
      <div class="body" @click=${this.changeTheme}>
        Current theme : ${this.theme.value}
      </div>
    `;
  }

  registerThemes() {
    const root = document.querySelector(":root") as HTMLElement;
    themeService.registerThemes(root, {
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
