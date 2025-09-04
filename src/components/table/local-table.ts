import { LitElement, html } from "lit";
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

@customElement("lit-spa-local-table")
export class LocalTableComponent extends LitElement {
  static styles = [styles];

  private dataById = new Map<string, TableRow>();
  private searchIndex = new Map<string, Set<keyof TableRow>>();
  private filterIndex = new Map<
    keyof TableRow,
    Map<string, Set<keyof TableRow>>
  >();
  private previousData?: TableRow[];

  private previousSearchText?: string;
  private previousFilterBy?: TableFilter[];
  private previousSortBy?: TableSort[];

  pagesCount = 0;

  @property({ type: Number })
  pageNumber = 1;

  @property({ type: Number })
  pageSize = 20;

  @property({ type: Array })
  columns: TableColumn[];

  @property({ type: Array })
  data: TableRow[];

  @property({ type: Array })
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
        .data=${this.query()}
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

  connectedCallback() {
    super.connectedCallback();
    this.indexAllData(this.data);
  }

  indexAllData(tableData: TableRow[]) {
    this.dataById.clear();
    this.searchIndex.clear();
    this.filterIndex.clear();
    this.filterIndex.set(
      "lit-spa-search",
      new Map<string, Set<keyof TableRow>>(),
    );
    this.columns.forEach((col) => {
      if (col.filterType) {
        this.filterIndex.set(col.field, new Map<string, Set<keyof TableRow>>());
      }
    });
    tableData.forEach((row, i) => {
      setTimeout(() => this.updateIndex(row, tableData.length - 1 == i));
    });
  }

  updateIndex(rowData: TableRow, isLastRow: boolean) {
    const dataId = rowData[this.dataIdField];
    this.dataById.set(dataId, rowData);
    this.filterIndex.forEach((index, field) => {
      const filterSet = index.get(rowData[field]);
      if (filterSet) {
        filterSet.add(dataId);
      } else {
        index.set(rowData[field], new Set([dataId]));
      }
    });
    const subStrings = new Set<string>();
    const searchableFields = this.columns.reduce((acc, col) => {
      if (col.isSearchable) acc.push(col.field);
      return acc;
    }, [] as string[]);
    searchableFields.forEach((field) => {
      let i, j;
      const values = String(rowData[field])
        .toLowerCase()
        .split(" ")
        .filter((t) => t.length >= this.minSearchCharacters);
      values.forEach((value) => {
        for (i = 0; i < value.length; i++) {
          for (j = value.length; j - i >= this.minSearchCharacters; j--) {
            subStrings.add(value.slice(i, j));
          }
        }
      });
    });
    subStrings.forEach((subString) => {
      const searchSet = this.searchIndex.get(subString);
      if (searchSet) {
        searchSet.add(dataId);
      } else {
        this.searchIndex.set(subString, new Set([dataId]));
      }
    });
    if (isLastRow) {
      this.table.updateFilterOptions(this.filterIndex);
    }
  }

  query() {
    const isSearchDifferent =
      this.previousSearchText && this.searchText !== this.previousSearchText;
    const isFilterDifferent =
      this.previousFilterBy &&
      !this.areFiltersEqual(this.filterBy, this.previousFilterBy);
    const isSortDifferent =
      this.previousSortBy &&
      !this.areSortsEqual(this.sortBy, this.previousSortBy);

    let result: TableRow[] = [];
    if (!this.previousData || isSearchDifferent || isFilterDifferent) {
      result = this.search(this.searchText);
      result = this.filter(this.filterBy, result);
      result = this.sort(this.sortBy, result);
      this.pageNumber = 1;
    } else if (isSortDifferent) {
      result = this.sort(this.sortBy, this.previousData);
      this.pageNumber = 1;
    } else {
      result = this.previousData;
    }

    this.previousData = result;
    this.previousSearchText = structuredClone(this.searchText);
    this.previousFilterBy = structuredClone(this.filterBy);
    this.previousSortBy = structuredClone(this.sortBy);

    result = this.paginate(result);
    return result;
  }

  search(searchText?: string) {
    if (!searchText?.length || searchText.length <= this.minSearchCharacters) {
      return this.data;
    }
    const rows: TableRow[] = [];
    const terms = searchText
      .toLowerCase()
      .split(" ")
      .filter((t) => t.length >= this.minSearchCharacters);
    if (this.searchOperator == "OR") {
      const dataIds = new Set<string>();
      terms.forEach((term) => {
        const ids = this.searchIndex.get(term);
        ids?.forEach((id) => dataIds.add(id));
      });
      dataIds.forEach((id) => rows.push(this.dataById.get(id)!));
    } else if (this.searchOperator == "AND") {
      let dataIds: string[] = [];
      terms.forEach((term) => {
        const ids = this.searchIndex.get(term);
        if (ids) {
          if (dataIds.length) {
            dataIds = dataIds.filter((value) => ids.has(value));
          } else {
            dataIds = [...ids];
          }
        }
      });
      dataIds.forEach((id) => rows.push(this.dataById.get(id)!));
    }
    return rows;
  }

  sort(tableSorts: TableSort[], rows: TableRow[]) {
    if (!tableSorts.length) return rows;
    return rows.sort((a, b) => this.recursiveSort(a, b, tableSorts));
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
      return tableSort.direction == "ASCENDING" ? -1 : 1;
    }
    if (value1 < value2) {
      return tableSort.direction == "ASCENDING" ? 1 : -1;
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

  areSortsEqual(sorts1: TableSort[], sorts2: TableSort[]) {
    return (
      sorts1.length === sorts2.length &&
      sorts1.every(
        (sort1, i) =>
          sort1.direction === sorts2[i].direction &&
          sort1.field === sorts2[i].field,
      )
    );
  }

  areFiltersEqual(filters1: TableFilter[], filters2: TableFilter[]) {
    return (
      filters1.length == filters2.length &&
      filters1.every((filter1, i) => {
        const filter2 = filters2[i];
        return (
          filter1.condition == filter2.condition &&
          filter1.field == filter2.field &&
          filter1.values.length == filter2.values.length &&
          filter1.values.every((val1, ind) => val1 == filter2.values[ind])
        );
      })
    );
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
    const options = {
      detail: event.detail,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent(event.type, options));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
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
