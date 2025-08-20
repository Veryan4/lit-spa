import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "../../demo-tools";

@customElement("loader-demo")
class LoaderDemo extends LitElement {
  render() {
    return html`
      <div class="body">
        <lit-spa-loader></lit-spa-loader>
        <lit-spa-loader
          .styleInfo=${{ color: "red", height: "10rem" }}
        ></lit-spa-loader>
      </div>
    `;
  }
}
