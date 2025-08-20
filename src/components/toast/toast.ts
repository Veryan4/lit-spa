import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { asyncAppend } from "lit/directives/async-append.js";
import { until } from "lit/directives/until.js";
import { TranslationController } from "../../controllers";
import { toastService } from "../../services";
import { Toast } from "../../models";
import { styles } from "./toast.styles";

@customElement("lit-spa-toast")
export class ToastComponent extends LitElement {
  static styles = [styles];

  private i18n = new TranslationController(this);

  constructor() {
    super();
  }

  render() {
    return html`<div class="toast-container">
      ${asyncAppend(toastService.pop, (t) => {
        const toast = t as Toast;
        const classes = { error: toast?.type === "error" };
        return until(
          this.wait(toast.duration),
          html`<div class="toast ${classMap(classes)}">
            <div class="toast-wrap" style=${styleMap(toast?.styleInfo ?? {})}>
              ${this.i18n.t(toast.text, toast.properties)}
            </div>
          </div>`,
        );
      })}
    </div>`;
  }

  wait(duration: number) {
    return new Promise((res) => setTimeout(() => res(""), duration));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-toast": ToastComponent;
  }
}
