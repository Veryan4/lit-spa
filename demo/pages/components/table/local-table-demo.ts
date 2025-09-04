import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import {
  SearchOperator,
  TableColumn,
  TableFilter,
  TableRow,
  TableSort,
  TranslationController,
} from "../../../demo-tools";
import "../../../demo-tools";
import tableData from "./data.json";

@customElement("demo-local-table")
class LocalTableDemo extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  pageNumber = 1;
  pageSize = 15;
  columns: TableColumn[] = [
    {
      field: "id",
      name: "ID",
      isFilterable: true,
      isSortable: true,
      isSearchable: true,
    },
    {
      field: "first_name",
      name: "Name",
      isFilterable: true,
      isSortable: true,
      isSearchable: true,
    },
    {
      field: "email",
      name: "Email",
      isFilterable: true,
      isSortable: true,
      isSearchable: true,
    },
    {
      field: "gender",
      name: "Gender",
      isFilterable: true,
      isSortable: true,
      isSearchable: true,
    },
    {
      field: "ip_address",
      name: "IP Address",
      isFilterable: true,
      isSortable: true,
      isSearchable: true,
    },
    {
      field: "date",
      name: "Date",
      isFilterable: true,
      filterType: "date",
      isSortable: true,
    },
    { field: "hasDog", name: "Has Dog", isFilterable: true, isSortable: true },
  ];

  data: TableRow[] = tableData;
  dataIdField = "id";
  searchableFields = ["id", "first_name", "last_name"];
  searchText?: string;
  minSearchCharacters = 2;
  searchOperator: SearchOperator = "AND";
  sortBy: TableSort[] = [];
  filterBy: TableFilter[] = [];

  render() {
    return html`
      <lit-spa-local-table
        .pageNumber=${this.pageNumber}
        .pageSize=${this.pageSize}
        .columns=${this.columns}
        .dataIdField=${this.dataIdField}
        .searchableFields=${this.searchableFields}
        .searchText=${this.searchText}
        .minSearchCharacters=${this.minSearchCharacters}
        .searchOperator=${this.searchOperator}
        .sortBy=${this.sortBy}
        .filterBy=${this.filterBy}
        .data=${this.data}
        .columnStyles=${{ backgroundColor: "var(--theme-very-light)" }}
      ></lit-spa-local-table>
    `;
  }
}
