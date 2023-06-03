import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../..";
import "../../..";

@customElement("demo-tooltip")
class TablePage extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <div>
        <lit-spa-tooltip .position=${"bottom"} .text=${"hello"}>
          Hover me!
        </lit-spa-tooltip>
        <lit-spa-tooltip .position=${"bottom"} .mode=${"click"}>
          <div slot="reference">Click me!</div>
          <div slot="floating">I am Open</div>
        </lit-spa-tooltip>
      </div>
    `;
  }
}
