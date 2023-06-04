import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit-html/directives/class-map.js";
import { styleMap } from "lit-html/directives/style-map.js";
import { until } from "lit/directives/until.js";
import { Toast } from "../../models";
import { TranslationController } from "../../controllers";
import { styles } from "./toast.styles";

@customElement("lit-spa-toast")
export class ToastComponent extends LitElement {
  static styles = [styles];

  private i18n = new TranslationController(this);

  @property({ type: Object })
  toast: Toast;

  constructor() {
    super();
  }

  render() {
    const wait = new Promise((res) =>
      setTimeout(() => res(""), this.toast.duration)
    );
    const classes = { error: this.toast?.type === "error" };
    return until(
      wait,
      html` <div class="toast-container">
        <div class="toast ${classMap(classes)}">
          <div class="toast-wrap" style=${styleMap(this.toast?.styleInfo ?? {})}>
            ${this.i18n.t(this.toast.text, this.toast.properties)}
          </div>
        </div>
      </div>`
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-toast": ToastComponent;
  }
}
