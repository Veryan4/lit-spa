import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
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
        border-top: 1px solid black;
        border-right: 1px solid black;
      }
      .doc {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        white-space: nowrap;
        padding: 0.5rem;
        border-left: 1px solid black;
        border-bottom: 1px solid black;
        min-height: 3rem;
      }
      .class {
        display: flex;
        color: rgb(111, 66, 193);
        font-weight: bold;
      }
      .attr {
        color: rgb(0, 92, 197);
      }
      .unset {
        display: flex;
        color: black;
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
