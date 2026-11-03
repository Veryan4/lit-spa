import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { TranslationController } from "../../src";
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
      :host {
        display: block;
        max-width: 100%;
        min-width: 0;
      }
      .btn-wrap {
        display: inline-flex;
        align-items: stretch;
        margin-bottom: 0.75rem;
        border: 1px solid var(--outline-color);
        border-radius: 0.25rem;
      }
      .btn {
        font: inherit;
        font-size: 0.875rem;
        color: inherit;
        border: none;
        border-radius: 0;
        padding: 0.4rem 0.85rem;
        background: transparent;
        cursor: pointer;
      }
      .btn + .btn {
        border-left: 1px solid var(--outline-color);
      }
      .btn:first-of-type {
        border-radius: 0.2rem 0 0 0.2rem;
      }
      .btn:last-of-type {
        border-radius: 0 0.2rem 0.2rem 0;
      }
      .btn:hover {
        background: var(--input-fill);
      }
      .btn.selected,
      .btn.selected:hover {
        background: var(--theme-color);
        color: #1a1a1a;
        font-weight: 600;
      }
      .btn:focus-visible,
      button.copy:focus-visible {
        outline: 2px solid var(--theme-very-dark);
        outline-offset: 2px;
      }
      .usage {
        margin-bottom: 1rem;
        max-width: 48rem;
        min-width: 0;
      }
      .usage-bar {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 0.35rem;
      }
      .usage-label {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      button.copy {
        font: inherit;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--theme-very-dark);
        background: transparent;
        border: none;
        padding: 0.15rem 0;
        cursor: pointer;
      }
      button.copy:hover {
        text-decoration: underline;
        text-underline-offset: 0.15em;
      }
      .usage hl-js {
        display: block;
      }
      .section-wrap {
        max-height: 70dvh;
        max-width: 100%;
        min-width: 0;
        overflow: auto;
        border: 1px solid var(--outline-color);
        border-radius: 0.25rem;
        padding: 0.75rem;
      }
    `,
  ];

  private i18n = new TranslationController(this);

  @property({ type: String })
  url: string;

  @property({ type: String })
  usage = "";

  @property({ type: Array })
  documentation: Documentation[] = [];

  @property({ type: Array })
  cssVariables: CSSVar[] = [];

  @state()
  show = "demo";

  @state()
  private copied = false;

  render() {
    return html`
      ${
        this.usage
          ? html`<div class="usage">
              <div class="usage-bar">
                <span class="usage-label">Usage</span>
                <button type="button" class="copy" @click=${this.copyUsage}>
                  ${this.copied ? "Copied" : "Copy"}
                </button>
              </div>
              <hl-js .code=${this.usage}></hl-js>
            </div>`
          : nothing
      }
      <div class="btn-wrap">
        <button
          type="button"
          class="btn ${classMap({ selected: this.show === "demo" })}"
          title="See Demo"
          @click=${() => (this.show = "demo")}
        >
          Demo
        </button>
        <button
          type="button"
          class="btn ${classMap({ selected: this.show === "code" })}"
          title="See source"
          @click=${() => (this.show = "code")}
        >
          Source
        </button>
        ${
          this.documentation?.length
            ? html`<button
                type="button"
                class="btn ${classMap({ selected: this.show === "doc" })}"
                title="See Properties"
                @click=${() => (this.show = "doc")}
              >
                Properties
              </button>`
            : nothing
        }
        ${
          this.cssVariables?.length
            ? html`<button
                type="button"
                class="btn ${classMap({ selected: this.show === "css" })}"
                title="See Style variables"
                @click=${() => (this.show = "css")}
              >
                Style Vars
              </button>`
            : nothing
        }
      </div>
      <div class="section-wrap">
        <div class=${classMap({ hide: this.show !== "demo" })}>
          <slot></slot>
        </div>
        <hl-js
          class=${classMap({ hide: this.show !== "code" })}
          .url=${this.url}
        ></hl-js>
        ${
          this.documentation?.length
            ? html`<div class=${classMap({ hide: this.show !== "doc" })}>
                <app-documentation
                  .documentation=${this.documentation}
                ></app-documentation>
              </div>`
            : ""
        }
        ${
          this.cssVariables?.length
            ? html`<div class=${classMap({ hide: this.show !== "css" })}>
                <app-css-vars .variables=${this.cssVariables}></app-css-vars>
              </div>`
            : ""
        }
      </div>
    `;
  }

  private copyUsage() {
    void navigator.clipboard.writeText(this.usage).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1500);
    });
  }
}
