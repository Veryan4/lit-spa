import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../demo-tools";
import "../../../demo-tools";
import "./theme-demo";

@customElement("demo-theme")
class ThemePage extends LitElement {
  static styles = [
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
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/state-management/theme/theme-demo.ts"}
        .documentation=${[]}
      >
        <theme-demo></theme-demo>
      </demo-section>
    `;
  }
}
