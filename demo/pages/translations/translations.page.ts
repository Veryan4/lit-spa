import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../src";
import "../../demo-tools";
import "./translations-demo";

@customElement("demo-translations")
class TranslationsPage extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <h2>Translations</h2>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/translations/translations-demo.ts"}
        .documentation=${[]}
      >
        <translations-demo></translations-demo>
      </demo-section>
    `;
  }
}
