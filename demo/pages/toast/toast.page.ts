import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../demo-tools";
import "../../demo-tools";
import "./toast-demo";

@customElement("demo-toast")
class ToastPage extends LitElement {
  static styles = [css`
    .description {
      margin: 1rem 0;
    }
  `];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <h2>Toast</h2>
      <div class="description">A notification toast which will stack upon itself and can be customized</div>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/toast/toast-demo.ts"}
        .documentation=${[]}
      >
        <toast-demo></toast-demo>
      </demo-section>
    `;
  }
}
