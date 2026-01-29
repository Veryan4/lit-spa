import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { styles } from "./hash.styles";
import { hashService } from "../../services";

@customElement("lit-spa-hash")
export class HashComponent extends LitElement {
  static styles = [styles];

  @property({ type: Object })
  rowStyle?: Record<string, string | number>;

  @property({ type: Object })
  hashStyle?: Record<string, string | number>;

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="row" style=${styleMap(this.rowStyle ?? {})}>
        <lit-spa-tooltip .position=${"top"} .text=${"Copy Link"}>
          <a
            id=${this.id}
            class="hash"
            style=${styleMap(this.hashStyle ?? {})}
            @click=${this.handleClick}
          >
            #
          </a>
        </lit-spa-tooltip>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  handleClick() {
    hashService.updateHash(this.id, true);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-hash": HashComponent;
  }
}
