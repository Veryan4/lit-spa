import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit-html/directives/style-map.js";
import { FilterComponent, defaultFilterLabels } from "./filter/filter";
import { styles } from "./table.styles";

import "./filter/filter";
import "./sort/sort";

export type TableRow = Record<string, any>;
export type TableColumn = {
  name: string;
  field: keyof TableRow;
  gridColumnSize?: string;
  isFilterable?: boolean;
  isSortable?: boolean;
  isSearchable?: boolean;
  filterType?: FilterType;
  template?: (column: TableColumn, row: TableRow) => CellTemplate;
};
export type CellTemplate = TemplateResult | HTMLElement;
export type SortDirection = "ASCENDING" | "DESCENDING";
export type TableSort = {
  field: keyof TableRow;
  direction: SortDirection;
};
export type FilterCondition = "GREATER" | "SMALLER" | "EQUAL" | "BETWEEN";
export type FilterType = "number" | "string" | "date";
export type TableFilter = {
  field: keyof TableRow;
  values: any[];
  condition: FilterCondition;
};

export const defaultTableLabels = {
  filterLabels: defaultFilterLabels
};

@customElement("lit-spa-table")
export class TableComponent extends LitElement {
  static styles = [styles];

  @property({ type: Array })
  columns: TableColumn[];

  @property({ type: Array })
  data: TableRow[];

  @property({ type: Array })
  sortBy: TableSort[] = [];

  @property({ type: Array })
  filterBy: TableFilter[] = [];

  @property({ type: Object })
  styleInfo?: Record<string, string | number>;

  @property({ type: Object })
  columnStyles?: Record<string, string>;

  @property({ type: Object })
  cellStyles?: Record<string, string>;

  @property({ type: Object })
  labels = defaultTableLabels;

  render() {
    const styles = {
      "grid-template-columns": this.columns
        .map((col) => col.gridColumnSize ?? "1fr")
        .join(" "),
      ...(this.styleInfo ?? {}),
    };
    const columns = this.formatColumns();
    return html`
      <div class="table" style=${styleMap(styles)}>
        ${columns.map((column) => {
          return html`<div
            class="column"
            style=${styleMap(this.columnStyles ?? {})}
          >
            ${column.name}
            <div class="options">
              ${this.renderFilter(column)} ${this.renderSort(column)}
            </div>
          </div>`;
        })}
        ${this.data.map((row) =>
          this.columns.map((col) => {
            let template = col.template ? col.template(col, row) as any : undefined;
            template = template?.cloneNode
              ? template.cloneNode(true)
              : template;
            return html`<div
              class="cell"
              style=${styleMap(this.cellStyles ?? {})}
            >
              ${template ? template : row[col.field]}
            </div>`;
          })
        )}
      </div>
    `;
  }

  renderFilter(column: TableColumn) {
    return column.filterType
      ? html`<lit-spa-filter
          id="${column.field}-filter"
          .column=${column}
          .labels=${this.labels.filterLabels}
          @filterchange=${this.echoEvent}
          @clearfilter=${this.echoEvent}
        ></lit-spa-filter>`
      : "";
  }

  renderSort(column: TableColumn) {
    const sortIndex = this.sortBy.findIndex(
      (sort) => sort.field == column.field
    );
    const sortDirection = this.sortBy[sortIndex]?.direction;
    return column.isSortable
      ? html`<lit-spa-sort
          .field=${column.field}
          .sortIndex=${sortIndex}
          .sortDirection=${sortDirection}
          @sortchange=${this.echoEvent}
        ></lit-spa-sort>`
      : "";
  }

  echoEvent(event: CustomEvent) {
    const options = {
      detail: event.detail,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent(event.type, options));
  }

  updateFilterOptions(
    filterIndex: Map<keyof TableRow, Map<string, Set<keyof TableRow>>>
  ) {
    filterIndex.forEach((index, key) => {
      (
        this.shadowRoot?.querySelector(`#${key}-filter`) as FilterComponent
      )?.updateFilterOptions(index);
    });
    this.requestUpdate();
  }

  formatColumns() {
    return this.columns.map((col) => {
      if (!col.isFilterable) return col;
      const firstVal = this.data?.[0]?.[col.field];
      if (firstVal !== undefined && firstVal !== null) {
        if (firstVal instanceof Date) {
          col.filterType = "date";
        } else if (!isNaN(firstVal)) {
          col.filterType = "number";
        } else if (typeof firstVal === "string" || firstVal instanceof String) {
          col.filterType = "string";
        }
      }
      return col;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-table": TableComponent;
  }
}
