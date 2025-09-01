import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { HashController, TranslationController } from "../../demo-tools";
import "../../demo-tools";
import "../tooltip/tooltip.page";
import "../toast/toast.page";
import "../table/tables.page";

@customElement("demo-components")
class ComponentsPage extends LitElement {
  static styles = [
    css`
      .description {
        margin: 1rem 0;
      }
    `,
  ];

  private i18n = new TranslationController(this);
  private hash = new HashController(this);

  render() {
    return html`
      <h1>Components</h1>
      <div class="description">
        Here's a few components which often end up getting requested when
        working on a application.
      </div>
      <lit-spa-hash id="tooltip">
        <h2>Tooltip</h2>
      </lit-spa-hash>
      <demo-tooltip></demo-tooltip>
      <lit-spa-hash id="toast">
        <h2>Toast</h2>
      </lit-spa-hash>
      <demo-toast></demo-toast>
      <lit-spa-hash id="tables">
        <h2>Tables</h2>
      </lit-spa-hash>
      <demo-tables></demo-tables>
    `;
  }
}
