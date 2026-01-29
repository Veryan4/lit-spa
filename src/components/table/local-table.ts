import { LitElement, PropertyValues, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import {
  TableColumn,
  TableComponent,
  TableFilter,
  TableRow,
  TableSort,
  defaultTableLabels,
} from "./table";
import { styles } from "./table.styles";

import "./pagination/pagination";
import "./table";

export type SearchOperator = "AND" | "OR";

export const defaultLocalTableLabels = {
  searchPlaceholder: "Search",
  tableLabels: defaultTableLabels,
};

const searchIndexBatchRows = 40;
const searchIndexBatchMs = 12;

@customElement("lit-spa-local-table")
export class LocalTableComponent extends LitElement {
  static styles = [styles];

  private dataById = new Map<string, TableRow>();
  private searchIndex = new Map<string, Set<string>>();
  private filterIndex = new Map<
    keyof TableRow,
    Map<string, Set<keyof TableRow>>
  >();
  private visibleRows: TableRow[] = [];
  private indexGeneration = 0;
  private indexTimer?: ReturnType<typeof setTimeout>;

  pagesCount = 0;

  @property({ type: Number })
  pageNumber = 1;

  @property({ type: Number })
  pageSize = 20;

  @property({ type: Array })
  columns: TableColumn[];

  @property({ type: Array })
  data: TableRow[];

  @property({ type: String })
  dataIdField: keyof TableRow;

  @property({ type: String })
  searchText?: string;

  @property({ type: Number })
  minSearchCharacters = 2;

  @property({ type: String })
  searchOperator: SearchOperator = "AND";

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
  labels = defaultLocalTableLabels;

  @query("#table")
  table: TableComponent;

  render() {
    return html`
      <input
        class="search-input"
        type="search"
        .value=${this.searchText ?? ""}
        placeholder=${this.labels.searchPlaceholder}
        @input=${this.searchChanged}
      />
      <lit-spa-table
        id="table"
        .columns=${this.columns}
        .sortBy=${this.sortBy}
        .filterBy=${this.filterBy}
        .data=${this.visibleRows}
        .styleInfo=${this.styleInfo}
        .columnStyles=${this.columnStyles}
        .cellStyles=${this.cellStyles}
        .labels=${this.labels.tableLabels}
        @filterchange=${this.changeFilter}
        @clearfilter=${this.clearFilter}
        @sortchange=${this.changeSort}
      ></lit-spa-table>
      <lit-spa-pagination
        .pageNumber=${this.pageNumber}
        .pagesCount=${this.pagesCount}
        @pagechange=${(e: CustomEvent) => (this.pageNumber = e.detail.page)}
      ></lit-spa-pagination>
    `;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (
      changed.has("data") ||
      changed.has("columns") ||
      changed.has("minSearchCharacters") ||
      changed.has("dataIdField")
    ) {
      this.rebuildIndex(this.data ?? [], this.columns ?? []);
    }

    const criteriaChanged =
      changed.has("searchText") ||
      changed.has("filterBy") ||
      changed.has("sortBy") ||
      changed.has("data") ||
      changed.has("searchOperator") ||
      changed.has("minSearchCharacters");
    if (
      criteriaChanged &&
      this.pageNumber !== 1 &&
      !changed.has("pageNumber")
    ) {
      this.pageNumber = 1;
    }

    this.visibleRows = this.computeVisible();
  }

  private rebuildIndex(tableData: TableRow[], columns: TableColumn[]) {
    this.indexGeneration += 1;
    const generation = this.indexGeneration;
    clearTimeout(this.indexTimer);
    this.dataById.clear();
    this.searchIndex.clear();
    this.filterIndex.clear();
    this.ensureFilterTypes(columns, tableData);
    columns.forEach((col) => {
      if (col.filterType || col.isFilterable) {
        this.filterIndex.set(
          col.field,
          new Map<string, Set<keyof TableRow>>(),
        );
      }
    });
    const fields = columns
      .filter((col) => col.isSearchable)
      .map((col) => col.field);
    let cursor = 0;

    const indexBatch = () => {
      if (generation !== this.indexGeneration || !this.isConnected) return;
      const started = performance.now();
      let indexed = 0;
      let foundSearchHit = false;
      while (
        cursor < tableData.length &&
        indexed < searchIndexBatchRows &&
        performance.now() - started < searchIndexBatchMs
      ) {
        if (this.indexRow(tableData[cursor], fields)) foundSearchHit = true;
        cursor += 1;
        indexed += 1;
      }
      if (this.filterIndex.size) {
        this.table?.updateFilterOptions(this.filterIndex);
      }
      const refreshSearch =
        foundSearchHit && !!this.searchTerms(this.searchText);
      const refreshFilter = this.filterBy.length > 0 && indexed > 0;
      if (refreshSearch || refreshFilter) this.requestUpdate();
      if (cursor < tableData.length) {
        this.indexTimer = setTimeout(indexBatch, 0);
      }
    };

    this.indexTimer = setTimeout(indexBatch, 0);
  }

  private indexRow(row: TableRow, fields: Array<keyof TableRow>): boolean {
    const rawId = row[this.dataIdField];
    if (rawId == null) return false;
    const dataId = String(rawId);
    this.dataById.set(dataId, row);
    this.filterIndex.forEach((index, field) => {
      const key = String(row[field] ?? "");
      const filterSet = index.get(key);
      if (filterSet) filterSet.add(rawId as keyof TableRow);
      else index.set(key, new Set([rawId as keyof TableRow]));
    });

    const substrings = new Set<string>();
    fields.forEach((field) => {
      String(row[field] ?? "")
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length >= this.minSearchCharacters)
        .forEach((word) => {
          for (let start = 0; start < word.length; start++) {
            for (
              let end = start + this.minSearchCharacters;
              end <= word.length;
              end++
            ) {
              substrings.add(word.slice(start, end));
            }
          }
        });
    });
    substrings.forEach((token) => {
      const matches = this.searchIndex.get(token);
      if (matches) matches.add(dataId);
      else this.searchIndex.set(token, new Set([dataId]));
    });
    return this.rowMatchesSearch(substrings);
  }

  private rowMatchesSearch(substrings: Set<string>): boolean {
    const terms = this.searchTerms(this.searchText);
    if (!terms?.length) return false;
    if (this.searchOperator == "OR") {
      return terms.some((term) => substrings.has(term));
    }
    return terms.every((term) => substrings.has(term));
  }

  private ensureFilterTypes(columns: TableColumn[], rows: TableRow[]) {
    columns.forEach((col) => {
      if (!col.isFilterable || col.filterType) return;
      const firstVal = rows[0]?.[col.field];
      if (firstVal === undefined || firstVal === null) return;
      if (firstVal instanceof Date) col.filterType = "date";
      else if (
        !Number.isNaN(Number(firstVal)) &&
        String(firstVal).trim() !== ""
      ) {
        col.filterType = "number";
      } else if (typeof firstVal === "string" || firstVal instanceof String) {
        col.filterType = "string";
      }
    });
  }

  private computeVisible(): TableRow[] {
    let rows = this.search(this.searchText, this.data ?? []);
    rows = this.filter(this.filterBy, rows);
    rows = this.sort(this.sortBy, rows);
    return this.paginate(rows);
  }

  private searchTerms(searchText?: string): string[] | undefined {
    if (!searchText || searchText.length <= this.minSearchCharacters) return;
    return searchText
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length >= this.minSearchCharacters);
  }

  search(searchText?: string, source: TableRow[] = this.data ?? []) {
    const terms = this.searchTerms(searchText);
    if (!terms) return source;
    if (!terms.length) return [];
    const ids = this.matchingSearchIds(terms);
    const rows: TableRow[] = [];
    this.dataById.forEach((row, id) => {
      if (ids.has(id)) rows.push(row);
    });
    return rows;
  }

  private matchingSearchIds(terms: string[]): Set<string> {
    if (this.searchOperator == "OR") {
      const ids = new Set<string>();
      terms.forEach((term) => {
        this.searchIndex.get(term)?.forEach((id) => ids.add(id));
      });
      return ids;
    }
    const first = this.searchIndex.get(terms[0]);
    if (!first) return new Set();
    let ids = new Set(first);
    for (const term of terms.slice(1)) {
      const found = this.searchIndex.get(term);
      if (!found) return new Set();
      ids = new Set([...ids].filter((id) => found.has(id)));
    }
    return ids;
  }

  sort(tableSorts: TableSort[], rows: TableRow[]) {
    if (!tableSorts.length) return rows;
    return [...rows].sort((a, b) => this.recursiveSort(a, b, tableSorts));
  }

  recursiveSort(
    row1: TableRow,
    row2: TableRow,
    tableSorts: TableSort[],
  ): number {
    const tableSort = tableSorts[0];
    const value1 = this.toLowerCaseIfString(row1[tableSort.field]);
    const value2 = this.toLowerCaseIfString(row2[tableSort.field]);
    if (value1 === undefined && value2 !== undefined) {
      return tableSort.direction == "ASCENDING" ? -1 : 1;
    }
    if (value1 !== undefined && value2 === undefined) {
      return tableSort.direction == "ASCENDING" ? 1 : -1;
    }
    if (value1 == value2) {
      const newSorts = [...tableSorts];
      newSorts.shift();
      if (newSorts.length) {
        return this.recursiveSort(row1, row2, newSorts);
      }
      return 0;
    }
    if (value1 > value2) {
      return tableSort.direction == "ASCENDING" ? 1 : -1;
    }
    if (value1 < value2) {
      return tableSort.direction == "ASCENDING" ? -1 : 1;
    }
    return 0;
  }

  toLowerCaseIfString(value: any) {
    return typeof value === "string" || value instanceof String
      ? value.toLowerCase()
      : value;
  }

  filter(tableFilters: TableFilter[], rows: TableRow[]) {
    if (!tableFilters?.length) return rows;
    return tableFilters.reduce((acc, filter) => {
      const value = filter.values[0];
      if (typeof value == "string" || value instanceof String) {
        const ids = new Set<string>();
        filter.values.forEach((val) => {
          const index = this.filterIndex.get(filter.field)!;
          const filterIds = index.get(val);
          filterIds?.forEach((id) => ids.add(id));
        });
        acc = acc.filter((row) => ids.has(row[this.dataIdField]));
        return acc;
      }
      if (
        typeof value == "number" ||
        value instanceof Number ||
        value instanceof Date
      ) {
        if (filter.condition == "BETWEEN") {
          acc = acc.filter(
            (row) =>
              row[filter.field] > filter.values[0] &&
              row[filter.field] < filter.values[1],
          );
        }
        if (filter.condition == "GREATER") {
          acc = acc.filter((row) => row[filter.field] > filter.values[0]);
        }
        if (filter.condition == "SMALLER") {
          acc = acc.filter((row) => row[filter.field] < filter.values[0]);
        }
        if (filter.condition == "EQUAL") {
          acc = acc.filter((row) => filter.values.includes(row[filter.field]));
        }
        return acc;
      }
      return acc;
    }, rows);
  }

  paginate(rows: TableRow[]) {
    this.pagesCount = Math.ceil(rows.length / this.pageSize);
    const currentIndex = this.pageSize * ((this.pageNumber ?? 1) - 1);
    let nextIndex = currentIndex + this.pageSize;
    if (nextIndex > rows.length) {
      nextIndex = rows.length;
    }
    return rows.slice(currentIndex, nextIndex);
  }

  changeSort(event: CustomEvent) {
    this.echoEvent(event);
    const field = event.detail.field;
    const preSort = this.sortBy.find((sort) => sort.field === field);
    if (preSort) {
      if (preSort.direction === "ASCENDING") {
        preSort.direction = "DESCENDING";
        this.requestUpdate();
        return;
      }
      this.sortBy = this.sortBy.filter((sort) => sort.field !== field);
      this.requestUpdate();
      return;
    }
    this.sortBy.push({ field, direction: "ASCENDING" });
    this.requestUpdate();
  }

  searchChanged(e: any) {
    this.echoEvent(e);
    const keywords = e.target?.value;
    this.searchText = keywords;
  }

  changeFilter(event: CustomEvent) {
    this.echoEvent(event);
    const { column, condition, values } = event.detail;
    const field: keyof TableRow = column.field;
    const currentFilter = this.filterBy.find(
      (filter) => filter.field === field,
    );
    if (currentFilter) {
      currentFilter.values = values;
      currentFilter.condition = condition;
      this.requestUpdate();
      return;
    }
    this.filterBy.push({ field, values, condition });
    this.requestUpdate();
  }

  clearFilter(event: CustomEvent) {
    this.echoEvent(event);
    const field = event.detail.field;
    this.filterBy = this.filterBy.filter((filter) => filter.field != field);
    this.requestUpdate();
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

  disconnectedCallback() {
    super.disconnectedCallback();
    this.indexGeneration += 1;
    clearTimeout(this.indexTimer);
    this.dataById.clear();
    this.searchIndex.clear();
    this.filterIndex.clear();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-local-table": LocalTableComponent;
  }
}
