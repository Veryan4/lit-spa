import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../src";
import "../../demo-tools";
import "./toast-demo";

@customElement("toast-loader")
class ToastPage extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <h2>Loader</h2>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/toast/toast-demo.ts"}
        .documentation=${[]}
      >
        <loader-demo></loader-demo>
      </demo-section>
    `;
  }
}
