import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { State } from "../../../demo-tools";
import "../../../demo-tools";
import "./input";

@customElement("state-object-demo")
class StateObjectDemo extends LitElement {
  static styles = [
    css`
      .demo {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    `,
  ];

  state = new State<string>();

  render() {
    return html`
      <div class="demo">
        <input-demo .state=${this.state}></input-demo>
        <input-demo .state=${this.state}></input-demo>
        <input-demo .state=${this.state}></input-demo>
        <input-demo .state=${this.state}></input-demo>
      </div>
    `;
  }
}
