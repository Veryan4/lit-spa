import { LitElement, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styleMap } from "lit-html/directives/style-map.js";
import { TableColumn, TableFilter, TableRow, TableSort } from "./table";
import { styles } from "./table.styles";

import "./pagination/pagination";
import "./table";

@customElement("lit-spa-infinite-table")
export class InfiniteTableComponent extends LitElement {
  static styles = [styles];

  @property({ type: Array })
  columns: TableColumn[];

  @property({ type: Array })
  data: TableRow[];

  @property({ type: Array })
  dataIdField: keyof TableRow;

  @property({ type: Array })
  sortBy: TableSort[] = [];

  @property({ type: Array })
  filterBy: TableFilter[] = [];

  @property({ type: Object })
  scrollOptions?: IntersectionObserverInit;

  @property({ type: Object })
  styles?: Record<string, string>;

  @property({ type: Object })
  columnStyles?: Record<string, string>;

  @property({ type: Object })
  cellStyles?: Record<string, string>;

  @query("#bottom")
  bottom: Element;

  private observer?: IntersectionObserver;

  render() {
    return html`
      <div
        style=${styleMap({
          "content-visibility": " auto",
          "contain-intrinsic-height": "100dvh",
          "overflow-y": "scroll",
          "overflow-x": "hidden",
          "max-height": "80dvh",
        })}
      >
        <lit-spa-table
          .columns=${this.columns}
          .sortBy=${this.sortBy}
          .filterBy=${this.filterBy}
          .data=${this.data}
          .styles=${this.styles}
          .columnStyles=${{
            position: "sticky",
            top: 0,
            ...(this.columnStyles ?? {}),
          }}
          .cellStyles=${this.cellStyles}
          @filterchange=${this.echoEvent}
          @clearfilter=${this.echoEvent}
          @sortchange=${this.echoEvent}
        ></lit-spa-table>
        <div id="bottom"></div>
      </div>
    `;
  }

  firstUpdated(_changedProperties: any) {
    super.firstUpdated(_changedProperties);
    const options = {
      root: this.isHostScrollable() ? this : null,
      ...(this.scrollOptions ?? {}),
    };
    this.observer = new IntersectionObserver(([entry]) => {
      entry.isIntersecting && this.dispatchEvent(new Event("scrolled"));
    }, options);
    this.observer.observe(this.bottom);
  }

  isHostScrollable() {
    const style = getComputedStyle(this);
    return (
      style.getPropertyValue("overflow") === "auto" ||
      style.getPropertyValue("overflow-y") === "scroll"
    );
  }

  echoEvent(event: CustomEvent) {
    const options = {
      detail: event.detail,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent(event.type, options));
  }

  disconnectedCallback(): void {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-infinite-table": InfiniteTableComponent;
  }
}
