import { LitElement, html, css, svg } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../demo-tools";
import "../../../demo-tools";

@customElement("tooltip-demo")
class TooltipDemo extends LitElement {
  static styles = [
    css`
      .wrap {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
      button {
        cursor: pointer;
      }
    `,
  ];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <div class="wrap">
        <lit-spa-tooltip .position=${"right"} .text=${"hello"}>
          Hover on top of this text.
        </lit-spa-tooltip>
        <lit-spa-tooltip .position=${"top"} .mode=${"click"}>
          <div slot="reference"><button>Click on this button</button></div>
          <div slot="floating">I am Open ${this.renderSVG()}</div>
        </lit-spa-tooltip>
      </div>
    `;
  }

  renderSVG() {
    return svg`
    <svg height="14px" width="14px" version="1.1"
      viewBox="0 0 17.837 17.837" xml:space="preserve" fill="currentColor">
      <g>
      <path fill="currentColor" d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27
        c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0
        L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"/>
      </g>
    </svg>
    `;
  }
}
