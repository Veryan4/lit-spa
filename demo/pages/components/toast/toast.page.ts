import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../demo-tools";
import "../../../demo-tools";
import "./toast-demo";

@customElement("demo-toast")
class ToastPage extends LitElement {
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
        A notification toast which will stack upon itself and can be customized
      </div>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/components/toast/toast-demo.ts"}
        .documentation=${[]}
        .cssVariables=${[
          {
            name: "--toast-font-family",
            default: "--font-family or Roboto sans serif",
            description: "The font used for the toast.",
          },
          {
            name: "--toast-offset",
            default: "100px",
            description: "By how much off the Y axis the toast is lifted",
          },
          {
            name: "--toast-background",
            default: "#313131",
            description: "Background color of the default toast",
          },
          {
            name: "--toast-color",
            default: "#fff",
            description: "Color of the default toast",
          },
          {
            name: "--toast-border-radius",
            default: "0.5rem",
            description: "Amount of curve on the edges of the toast",
          },
          {
            name: "--toast-error-background",
            default: "crimson",
            description: "Background color of the error toast",
          },
          {
            name: "--toast-error-color",
            default: "#fff",
            description: "Color of the error toast",
          },
        ]}
      >
        <toast-demo></toast-demo>
      </demo-section>
    `;
  }
}
