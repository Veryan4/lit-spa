import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../demo-tools";
import { docStyles } from "../../../doc.styles";
import "../../../demo-tools";
import "./http-demo";

const usage = `import { httpService } from "@veryan/lit-spa/http";

type Todo = { id: number; title: string };

const todos = await httpService.get<Todo[]>(
  "https://jsonplaceholder.typicode.com/todos",
);`;

@customElement("demo-http")
class HttpPage extends LitElement {
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
        A service around the browser fetch API. Responses are cached for 5
        minutes, and the cache can be cleared on command. Replace baseHttp to
        intercept responses.
      </div>
      <demo-section
        .usage=${usage}
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/state-management/http/http-demo.ts"}
        .documentation=${[]}
      >
        <http-demo></http-demo>
      </demo-section>
    `;
  }
}
