import { LitElement, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { State } from "../../../demo-tools";
import "../../../demo-tools";

@customElement("input-demo")
class InputDemo extends LitElement {
  @property({ type: Object })
  state: State<string>;

  @state()
  inputText = "";

  @query("#search-input")
  input: HTMLInputElement;

  unsubscribe?: () => boolean;

  render() {
    return html`
      <input
        id="search-input"
        type="search"
        .value=${this.inputText}
        placeholder=""
        @input=${this.textChanged}
      />
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.unsubscribe = this.state.subscribe((s) => {
      this.inputText = s;
    });
  }

  textChanged() {
    this.state.update(this.input.value);
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }
}
