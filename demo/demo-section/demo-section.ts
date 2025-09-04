import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { TranslationController } from "../../src";
import { starSvg, codeSvg, dictionarySvg, cssSvg } from "./demo-svgs";
import { Documentation } from "./documentation";
import { CSSVar } from "./css-vars";
import "../../src";
import "../hl-js/hl-js";
import "./css-vars";
import "./documentation";

@customElement("demo-section")
class DemoSectionDemo extends LitElement {
  static styles = [
    css`
      .hide {
        display: none;
      }
      .btn.selected {
        color: var(--secondary-background-color);
        background-color: var(--secondary-color);
      }
      .btn-wrap {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .btn {
        padding: 0.5rem;
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-right: 1rem;
        border-radius: 0.25rem;
        background-color: var(--input-fill);
      }
      .btn:hover {
        color: var(--secondary-background-color);
        background-color: var(--secondary-color);
      }
      .btn .svg-wrap {
        display: flex;
        align-items: center;
        margin-left: 0.5rem;
        width: 1rem;
      }
      .section-wrap {
        max-height: 90dvh;
        max-width: 80dvw;
        min-height: 15dvh;
        overflow-y: scroll;
        border: 1px solid var(--theme-color);
        border-radius: 0.25rem;
        padding: 0.5rem;
      }
    `,
  ];

  private i18n = new TranslationController(this);

  @property({ type: String })
  url: string;

  @property({ type: Array })
  documentation: Documentation[] = [];

  @property({ type: Array })
  cssVariables: CSSVar[] = [];

  @state()
  show = "demo";

  render() {
    return html`
      <div class="btn-wrap">
        <div
          class="btn ${classMap({ selected: this.show === "demo" })}"
          title="See Demo"
          @click=${() => (this.show = "demo")}
        >
          <div>Demo</div>
          <div class="svg-wrap">${starSvg()}</div>
        </div>
        <div
          class="btn ${classMap({ selected: this.show === "code" })}"
          title="See Code"
          @click=${() => (this.show = "code")}
        >
          <div>Code</div>
          <div class="svg-wrap">${codeSvg()}</div>
        </div>
        ${this.documentation?.length
          ? html`<div
              class="btn ${classMap({ selected: this.show === "doc" })}"
              title="See Properties"
              @click=${() => (this.show = "doc")}
            >
              <div>Properties</div>
              <div class="svg-wrap">${dictionarySvg()}</div>
            </div>`
          : ""}
        ${this.cssVariables?.length
          ? html`<div
              class="btn ${classMap({ selected: this.show === "css" })}"
              title="See Style variables"
              @click=${() => (this.show = "css")}
            >
              <div>Style Vars</div>
              <div class="svg-wrap">${cssSvg()}</div>
            </div>`
          : ""}
      </div>
      <div class="section-wrap">
        <div class=${classMap({ hide: this.show !== "demo" })}>
          <slot></slot>
        </div>
        <hl-js
          class=${classMap({ hide: this.show !== "code" })}
          .url=${this.url}
        ></hl-js>
        ${this.documentation?.length
          ? html`<div class=${classMap({ hide: this.show !== "doc" })}>
              <app-documentation
                .documentation=${this.documentation}
              ></app-documentation>
            </div>`
          : ""}
        ${this.cssVariables?.length
          ? html`<div class=${classMap({ hide: this.show !== "css" })}>
              <app-css-vars .variables=${this.cssVariables}></app-css-vars>
            </div>`
          : ""}
      </div>
    `;
  }
}
