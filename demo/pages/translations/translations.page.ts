import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../demo-tools";
import "../../demo-tools";
import "./translations-demo";

@customElement("demo-translations")
class TranslationsPage extends LitElement {
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
        Accessing scoped translation files to render a string in different
        languages. By default the translation service will look for a
        /i18n/en.json at the root of your application. The
        TranslationController's loader can be overwritten to change this
        behavior.
      </div>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/translations/translations-demo.ts"}
        .documentation=${[]}
      >
        <translations-demo></translations-demo>
      </demo-section>
    `;
  }
}
