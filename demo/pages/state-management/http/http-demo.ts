import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController, httpService } from "../../../demo-tools";
import { demoActionStyles } from "../../../demo-action.styles";
import "../../../demo-tools";

type ToDo = { userId: string; id: number; title: string; completed: boolean };

@customElement("http-demo")
class HttpDemo extends LitElement {
  static styles = [
    demoActionStyles,
    css`
      .result {
        margin-top: 0.75rem;
        white-space: pre-wrap;
      }
    `,
  ];

  private i18n = new TranslationController(this);
  private todos: ToDo[] = [];

  render() {
    return html`
      <div>
        <div class="actions">
          <button type="button" @click=${this.fetchData}>Fetch Data</button>
        </div>
        ${this.todos.length
          ? html`<div class="result">${JSON.stringify(this.todos, null, 4)}</div>`
          : ""}
      </div>
    `;
  }

  fetchData() {
    httpService
      .get<ToDo[]>("https://jsonplaceholder.typicode.com/todos")
      .then((todos) => {
        this.todos = todos;
        this.requestUpdate();
      });
  }
}
