import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../demo-tools";
import { docStyles } from "../../../doc.styles";
import "../../../demo-tools";
import "./state-object-demo";

const usage = `import { State } from "@veryan/lit-spa/state";

const name = new State<string>();
name.subscribe((value) => {
  input.value = value ?? "";
});
input.addEventListener("input", () => name.update(input.value));`;

@customElement("demo-state-object")
class StateObjectPage extends LitElement {
  static styles = [
    docStyles,
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
        A small class for pushing and listening to state across components.
        Each input below is its own web component. Edit any of them and the
        others keep the same value.
      </div>
      <demo-section
        .usage=${usage}
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/state-management/state-object/state-object-demo.ts"}
        .documentation=${[]}
      >
        <state-object-demo></state-object-demo>
      </demo-section>
    `;
  }
}
