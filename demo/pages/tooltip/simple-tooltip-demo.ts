import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../demo-tools";
import "../../demo-tools";

@customElement("simple-tooltip-demo")
class SimpleTooltipDemo extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  render() {
    return html`
        <lit-spa-tooltip .position=${"bottom"} .text=${"hello"}>
          Pre-styled demo
        </lit-spa-tooltip>
    `;
  }


}