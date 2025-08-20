import { LitElement, html, css, svg } from "lit";
import { customElement } from "lit/decorators.js";
import { TableColumn, TableRow, TranslationController } from "../../demo-tools";
import "../../demo-tools";
import tableData from "./data.json";

@customElement("demo-table")
class TablePageDemo extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  columns: TableColumn[] = [
    { field: "id", name: "ID" },
    { field: "first_name", name: " First Name" },
    { field: "last_name", name: "Last Name" },
    { field: "email", name: "Email" },
    { field: "gender", name: "Gender" },
    { field: "ip_address", name: "IP Address" },
    { field: "date", name: "Date", template: this.renderDate },
    { field: "hasDog", name: "Has Dog", template: this.renderBoolTemplate },
  ];
  data: TableRow[] = tableData;

  render() {
    return html`
      <lit-spa-table
        .columns=${this.columns}
        .data=${this.data.slice(0, 10)}
      ></lit-spa-table>
    `;
  }

  renderBoolTemplate(column: TableColumn, row: TableRow) {
    if (row[column.field]) {
      return svg`
      <svg height="14px" width="14px" version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 17.837 17.837" xml:space="preserve">
        <g>
        <path style="fill:#030104;" d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27
          c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0
          L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"/>
        </g>
      </svg>
      `;
    }
    return svg`
    <svg fill="#030104" width="18px" height="18px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5  c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4  C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"/>
    </svg>
    `;
  }

  renderDate(column: TableColumn, row: TableRow) {
    const date = new Date(row[column.field]);
    const element = document.createElement("div");
    const options: any = { year: "numeric", month: "long", day: "numeric" };
    element.innerText = date.toLocaleDateString("en-US", options);
    return element;
  }
}
