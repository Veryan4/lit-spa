import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../demo-tools";
import "../../../demo-tools";
import "./router-demo";

@customElement("demo-router")
class RouterPage extends LitElement {
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
        Provides the ability to lazy-load components along with other typical
        routing features, such as guards, default routes, and collecting path
        parameters.
      </div>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/state-management/router/router-demo.ts"}
        .documentation=${[]}
      >
        <router-demo></router-demo>
      </demo-section>
    `;
  }
}
