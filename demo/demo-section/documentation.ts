import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TranslationController } from "../../src";

import "../../src";

export type Documentation = {
  property: string;
  default?: string;
  type?: string;
  description: string;
};

@customElement("app-documentation")
class DocumentationDemo extends LitElement {
  static styles = [
    css`
      .grid {
        grid-template-columns: 1fr 2fr;
        display: grid;
        border-top: 1px solid var(--secondary-color);
        border-right: 1px solid var(--secondary-color);
      }
      .doc {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        white-space: nowrap;
        padding: 0.5rem;
        border-left: 1px solid var(--secondary-color);
        border-bottom: 1px solid var(--secondary-color);
        min-height: 3rem;
        text-wrap: wrap;
      }
      .class {
        display: flex;
        color: var(--theme-accent-1);
        font-weight: bold;
      }
      .attr {
        color: var(--theme-very-dark);
      }
      .unset {
        display: flex;
        color: var(--secondary-color);
        font-weight: 400;
      }
    `,
  ];

  private i18n = new TranslationController(this);

  @property({ type: Array })
  documentation: Documentation[] = [];

  render() {
    return html`
      <div class="grid">
        ${this.documentation.map(
          (doc) => html`
            <div class="doc">
              <div class="property">
                Property:
                <div class="attr">${doc.property}</div>
              </div>
              <div class="type">
                Type:
                <div class="class">${this.renderType(doc.type)}</div>
              </div>
            </div>
            <div class="doc">
              <div>
                Description:
                <div>${doc.description}</div>
              </div>
              ${doc.default
                ? html` <div>
                    Default Value:
                    <div>${doc.default}</div>
                  </div>`
                : ""}
            </div>
          `,
        )}
      </div>
    `;
  }

  renderType(type?: string) {
    const found = type?.match(/<(.*?)>|\[(.*?)\]/g) as string[] | undefined;
    let start, end, subProperty;
    if (found?.length) {
      type = type?.replace(found[0], "");
      start = found[0].substring(0, 1);
      end = found[0].substring(found[0].length - 1);
      subProperty = found[0].substring(1).slice(0, -1);
    }
    return html`${type}${subProperty
      ? html`<div class="unset">
          ${start}${html`<div class="attr">${subProperty}</div>`}${end}
        </div>`
      : ""}`;
  }
}
