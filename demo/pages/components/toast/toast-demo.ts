import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { toastService } from "../../../demo-tools";
import { demoActionStyles } from "../../../demo-action.styles";
import "../../../demo-tools";

@customElement("toast-demo")
class ToastDemo extends LitElement {
  static styles = [demoActionStyles];

  render() {
    return html`
      <div class="actions">
        <button type="button" @click=${() => toastService.newToast("Simple toast")}>
          Simple toast
        </button>
        <button
          type="button"
          @click=${() =>
            toastService.customToast({
              text: "Custom toast",
              duration: 5000,
              styleInfo: { backgroundColor: "purple" },
            })}
        >
          Custom toast
        </button>
      </div>
    `;
  }
}
