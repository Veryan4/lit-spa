import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../..";
import "../../..";
import "./table-demo";
import "./local-table-demo";
import "./infinite-table-demo";

@customElement("demo-tables")
class TablesPageDemo extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <h2>Table</h2>
      <demo-table></demo-table>
      <h2>Local Table</h2>
      <demo-local-table></demo-local-table>
      <h2>Infinite Table</h2>
      <demo-infinite-table></demo-infinite-table>
    `;
  }


}
