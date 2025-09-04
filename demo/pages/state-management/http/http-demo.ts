import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController, httpService } from "../../../demo-tools";
import "../../../demo-tools";

type ToDo = { userId: string; id: number; title: string; completed: boolean };

@customElement("http-demo")
class HttpDemo extends LitElement {
  static styles = [
    css`
      button {
        cursor: pointer;
      }
    `,
  ];

  private i18n = new TranslationController(this);
  private todos: ToDo[] = [];

  render() {
    return html`
      <div class="body">
        <button @click=${this.fetchData}>Fetch Data</button>
        ${this.todos.length
          ? html`<div>${JSON.stringify(this.todos, null, 4)}</div>`
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
