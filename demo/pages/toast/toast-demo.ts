import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { ToastController, toastService } from "../../demo-tools";
import "../../demo-tools";

@customElement("toast-demo")
class ToastDemo extends LitElement {
  private toaster = new ToastController(this);

  render() {
    return html`
      <div class="body">
        <button @click=${() => toastService.newToast("Simple toast")}>
          Simple toast
        </button>
        <button
          @click=${() =>
            toastService.customToast({
              text: "Simple toast",
              duration: 5000,
              styleInfo: { backgroundColor: "purple" },
            })}
        >
          Custom toast
        </button>
        ${this.toaster.wait()}
      </div>
    `;
  }
}
