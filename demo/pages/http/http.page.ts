import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../demo-tools";
import "../../demo-tools";
import "./http-demo";

@customElement("demo-http")
class HttpPage extends LitElement {
  static styles = [css`
    .description {
      margin: 1rem 0;
    }
  `];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <h2>Http</h2>
      <div class="description">A service that simplifies the web browsers' fetch api. It has a 5 min cache by default which can be busted on command. The baseHttp function can be overwritten to apply interceptor functions to handle different http responses</div>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/http/http-demo.ts"}
        .documentation=${[]}
      >
        <http-demo></http-demo>
      </demo-section>
    `;
  }
}
