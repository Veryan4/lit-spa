import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { HashController, TranslationController } from "../../demo-tools";
import { docStyles } from "../../doc.styles";
import "../../demo-tools";
import "./tooltip/tooltip.page";
import "./toast/toast.page";
import "./table/tables.page";

@customElement("demo-components")
class ComponentsPage extends LitElement {
  static styles = [
    docStyles,
    css`
      .description {
        margin: 1rem 0;
      }
      .title {
        margin-top: 3rem;
      }
    `,
  ];

  private i18n = new TranslationController(this);
  private hash = new HashController(this);

  render() {
    return html`
      <h1>Components</h1>
      <div class="description">
        A few components that show up in most applications.
      </div>
      <div class="title">
        <lit-spa-hash id="tooltip">
          <h2>Tooltip</h2>
        </lit-spa-hash>
      </div>
      <demo-tooltip></demo-tooltip>
      <div class="title">
        <lit-spa-hash id="toast">
          <h2>Toast</h2>
        </lit-spa-hash>
      </div>
      <demo-toast></demo-toast>
      <div class="title">
        <lit-spa-hash id="tables">
          <h2>Tables</h2>
        </lit-spa-hash>
      </div>
      <demo-tables></demo-tables>
    `;
  }
}
