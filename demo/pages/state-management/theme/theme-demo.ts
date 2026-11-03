import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { ThemeController, themeService } from "../../../demo-tools";
import { demoActionStyles } from "../../../demo-action.styles";
import "../../../demo-tools";

@customElement("theme-demo")
class ThemeDemo extends LitElement {
  static styles = [
    demoActionStyles,
    css`
      .swatch {
        margin-top: 0.75rem;
        padding: 0.75rem 1rem;
        width: fit-content;
        color: var(--primary-color);
        background: var(--secondary-background-color);
        border: 1px solid var(--outline-color);
        border-radius: 0.25rem;
      }
    `,
  ];

  private theme = new ThemeController(this);

  constructor() {
    super();
  }

  render() {
    return html`
      <button type="button" @click=${this.changeTheme}>Change theme</button>
      <div class="swatch">Current theme: ${this.theme.value}</div>
    `;
  }

  changeTheme() {
    if (this.theme.value == "light") {
      themeService.changeTheme("dark");
    } else {
      themeService.changeTheme("light");
    }
  }
}
