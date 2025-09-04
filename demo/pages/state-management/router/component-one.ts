import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../../src";
import "../../../demo-tools";
import "./router-demo";

@customElement("component-one")
class ComponentOne extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  render() {
    return html` <div>Component 1</div> `;
  }
}
