import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../src";
import "../../demo-tools";
import "./loader-demo";

@customElement("demo-loader")
class LoaderPage extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <h2>Loader</h2>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/loader/loader-demo.ts"}
        .documentation=${[
          {
            property: "styleInfo",
            type: "Record<string, string>",
            description:
              "custom css styles can be applied the the loading spinner",
          }
        ]}
      >
        <loader-demo></loader-demo>
      </demo-section>
    `;
  }
}
