import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { toastService } from "../../../demo-tools";
import "../../../demo-tools";

@customElement("toast-demo")
class ToastDemo extends LitElement {
  static styles = [
    css`
      button {
        cursor: pointer;
      }
    `,
  ];

  render() {
    return html`
      <div class="body">
        <button @click=${() => toastService.newToast("Simple toast")}>
          Simple toast
        </button>
        <button
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
