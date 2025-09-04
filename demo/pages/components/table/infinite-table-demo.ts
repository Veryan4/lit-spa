import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  TableColumn,
  TableRow,
  TranslationController,
} from "../../../demo-tools";
import "../../../demo-tools";
import tableData from "./data.json";

@customElement("demo-infinite-table")
class InfiniteTableDemo extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  columns: TableColumn[] = [
    { field: "id", name: "ID" },
    { field: "first_name", name: "Name" },
    { field: "email", name: "Email" },
    { field: "gender", name: "Gender" },
    { field: "ip_address", name: "IP Address" },
    { field: "date", name: "Date" },
    { field: "hasDog", name: "Has Dog" },
  ];
  data: TableRow[] = tableData;
  pageReached = 1;
  pageSize = 50;

  @state()
  chunkedData: TableRow[] = [];

  render() {
    if (!this.chunkedData.length) {
      this.chunkedData = this.retrieveDataChunk();
    }
    return html`
      <lit-spa-infinite-table
        .columns=${this.columns}
        .data=${this.chunkedData}
        @scrolled=${this.onScroll}
        .columnStyles=${{ backgroundColor: "var(--theme-very-light)" }}
      ></lit-spa-infinite-table>
    `;
  }

  onScroll() {
    this.pageReached++;
    this.chunkedData = this.chunkedData.concat(this.retrieveDataChunk());
  }

  retrieveDataChunk() {
    const currentIndex = this.pageSize * ((this.pageReached ?? 1) - 1);
    let nextIndex = currentIndex + this.pageSize;
    if (nextIndex > this.data.length) {
      nextIndex = this.data.length;
    }
    return this.data.slice(currentIndex, nextIndex);
  }
}
