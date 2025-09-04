import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../demo-tools";
import "../../../demo-tools";
import "./state-object-demo";

@customElement("demo-state-object")
class StateObjectPage extends LitElement {
  static styles = [
    css`
      .description {
        margin: 1rem 0;
      }
    `,
  ];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <div class="description">
        A simpler interface than web events to push and listen to state changes
        across components. Each input in the demo below is it's own Web
        Component. Edit the text input on any of the boxes and notice that the
        state is preserved across components.
      </div>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/state-management/state-object/state-object-demo.ts"}
        .documentation=${[]}
      >
        <state-object-demo></state-object-demo>
      </demo-section>
    `;
  }
}
