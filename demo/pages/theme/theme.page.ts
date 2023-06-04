import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../src";
import "../../demo-tools";
import "./theme-demo";

@customElement("demo-theme")
class ThemePage extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <h2>Router</h2>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/theme/theme-demo.ts"}
        .documentation=${[]}
      >
        <theme-demo></theme-demo>
      </demo-section>
    `;
  }
}
