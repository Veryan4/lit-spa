import { LitElement, PropertyValues, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { TableColumn, TableRow, defaultTableLabels } from "./table";
import { styles } from "./table.styles";

import "./pagination/pagination";
import "./table";

@customElement("lit-spa-infinite-table")
export class InfiniteTableComponent extends LitElement {
  static styles = [
    styles,
    css`
      #scroller {
        overflow-x: hidden;
        overflow-y: scroll;
        max-height: 80dvh;
      }
      lit-spa-table {
        display: block;
      }
      #bottom {
        height: 1px;
      }
    `,
  ];

  @property({ type: Array })
  columns: TableColumn[];

  @property({ type: Array })
  data: TableRow[];

  @property({ type: Object })
  scrollOptions?: IntersectionObserverInit;

  @property({ type: Object })
  styleInfo?: Record<string, string | number>;

  @property({ type: Object })
  columnStyles?: Record<string, string>;

  @property({ type: Object })
  cellStyles?: Record<string, string>;

  @property({ type: Object })
  labels = defaultTableLabels;

  @query("#scroller")
  scroller?: HTMLElement;

  @query("#bottom")
  bottom?: Element;

  private observer?: IntersectionObserver;
  private loadLocked = false;
  private awaitingPage = false;
  private exhausted = false;

  private readonly onIntersect = (entry: IntersectionObserverEntry) => {
    if (!entry.isIntersecting) {
      this.loadLocked = false;
      return;
    }
    this.requestNextPage();
  };

  render() {
    return html`
      <div id="scroller">
        <lit-spa-table
          .columns=${this.columns}
          .data=${this.data}
          .styleInfo=${this.styleInfo}
          .columnStyles=${{
            position: "sticky",
            top: 0,
            ...(this.columnStyles ?? {}),
          }}
          .cellStyles=${this.cellStyles}
          .labels=${this.labels}
          @filterchange=${this.echoEvent}
          @clearfilter=${this.echoEvent}
          @sortchange=${this.echoEvent}
        ></lit-spa-table>
        <div id="bottom"></div>
      </div>
    `;
  }

  protected firstUpdated(): void {
    if (!this.bottom) return;
    const options: IntersectionObserverInit = {
      root: this.scroller ?? null,
      rootMargin: "0px 0px 100px 0px",
      ...(this.scrollOptions ?? {}),
    };
    this.observer = new IntersectionObserver(([entry]) => {
      this.onIntersect(entry);
    }, options);
    this.armObserver();
  }

  protected updated(changed: PropertyValues<this>): void {
    if (!changed.has("data")) return;
    const previous = changed.get("data") as TableRow[] | undefined;
    const nextCount = this.data?.length ?? 0;
    const previousCount = previous?.length ?? 0;
    this.loadLocked = false;
    if (nextCount < previousCount) {
      this.exhausted = false;
    } else if (this.awaitingPage && nextCount === previousCount) {
      this.exhausted = true;
    }
    this.awaitingPage = false;
    this.armObserver();
  }

  private armObserver() {
    if (!this.observer || !this.bottom) return;
    this.observer.unobserve(this.bottom);
    this.observer.observe(this.bottom);
  }

  private requestNextPage() {
    if (this.loadLocked || this.exhausted) return;
    this.loadLocked = true;
    this.awaitingPage = true;
    this.dispatchEvent(new Event("scrolled"));
  }

  isHostScrollable() {
    const style = getComputedStyle(this);
    return (
      style.getPropertyValue("overflow") === "auto" ||
      style.getPropertyValue("overflow-y") === "scroll"
    );
  }

  echoEvent(event: CustomEvent) {
    event.stopPropagation();
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
