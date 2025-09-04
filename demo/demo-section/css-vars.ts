import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TranslationController } from "../../src";
import "../../src";

export type CSSVar = {
  name: string;
  default: string;
  description: string;
};

@customElement("app-css-vars")
class CSSVarsDemo extends LitElement {
  static styles = [
    css`
      .grid {
        grid-template-columns: 1fr 1fr 2fr;
        display: grid;
        border-top: 1px solid var(--secondary-color);
        border-right: 1px solid var(--secondary-color);
      }
      .var {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        white-space: nowrap;
        padding: 0.5rem;
        border-left: 1px solid var(--secondary-color);
        border-bottom: 1px solid var(--secondary-color);
        min-height: 2rem;
        text-wrap: wrap;
      }
      .var.title {
        background-color: var(--input-fill);
      }
    `,
  ];

  private i18n = new TranslationController(this);

  @property({ type: Array })
  variables: CSSVar[] = [];

  render() {
    return html`
      <div class="grid">
        <div class="var title">Name</div>
        <div class="var title">Default</div>
        <div class="var title">Description</div>
        ${this.variables.map(
          (v) => html`
            <div class="var">${v.name}</div>
            <div class="var">${v.default}</div>
            <div class="var">${v.description}</div>
          `,
        )}
      </div>
    `;
  }
}
