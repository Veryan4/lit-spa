import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../demo-tools";
import { docStyles } from "../../../doc.styles";
import "../../../demo-tools";
import "./theme-demo";

const usage = `import { themeService } from "@veryan/lit-spa";

const next = themeService.getTheme() === "light" ? "dark" : "light";
themeService.changeTheme(next);`;

@customElement("demo-theme")
class ThemePage extends LitElement {
  static styles = [
    docStyles,
    css`
      .description {
        margin: 1rem 0;
      }
    `,
  ];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <div class="description">
        Leveraging css variables in order to have a theme remain consistent
        across isolated components.
      </div>
      <demo-section
        .usage=${usage}
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/state-management/theme/theme-demo.ts"}
        .documentation=${[]}
      >
        <theme-demo></theme-demo>
      </demo-section>
    `;
  }
}
