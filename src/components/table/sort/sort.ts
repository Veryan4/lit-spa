import { LitElement, html, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styles } from "./sort.styles";

@customElement("lit-spa-sort")
export class SortComponent extends LitElement {
  static styles = [styles];

  @property({ type: Object })
  field: string;

  @property({ type: Number })
  sortIndex: number;

  @property({ type: String })
  sortDirection: string;

  render() {
    return html`<div class="sort" @click=${this.changeSort}>
      <div
        class="sort-default ${classMap({
          show: !this.sortDirection,
        })}"
      >
        ${this.sortSVG(8)}
        <div style="display:flex;" class="down">${this.sortSVG(8)}</div>
      </div>
      <div
        class="sort-direction ${classMap({
          up: this.sortDirection == "ASCENDING",
          down: this.sortDirection == "DESCENDING",
        })}"
      >
        ${this.sortSVG()}
        <div class="sort-number">${this.sortIndex + 1}</div>
      </div>
    </div>`;
  }

  sortSVG(size = 16) {
    return svg`
    <svg width=${size} height=${size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="none" height="256" width="256"/>
      <path d="M236.7,188,148.8,36a24,24,0,0,0-41.6,0h0L19.3,188A23.9,23.9,0,0,0,40,224H216a23.9,23.9,0,0,0,20.7-36Z"/>
    </svg>`;
  }

  changeSort() {
    const options = {
      detail: { field: this.field },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("sortchange", options));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-sort": SortComponent;
  }
}
