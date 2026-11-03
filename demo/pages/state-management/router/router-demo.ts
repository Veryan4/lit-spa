import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { RouteController, Route, routerService } from "../../../demo-tools";
import { demoActionStyles } from "../../../demo-action.styles";
import "../../../demo-tools";

const routes: Route[] = [
  {
    name: "one",
    pattern: ["", "one"],
    component: () =>
      import("./component-one").then(
        () => html`<component-one></component-one>`,
      ),
  },
  {
    name: "two",
    pattern: "two",
    component: () =>
      import("./component-two").then(
        () => html`<component-two></component-two>`,
      ),
  },
];

@customElement("router-demo")
class RouterDemo extends LitElement {
  static styles = [
    demoActionStyles,
    css`
      .stack {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }
      p {
        margin: 0;
      }
    `,
  ];

  private router = new RouteController(this, routes);

  render() {
    return html`
      <div class="stack">
        <p>
          Notice the change in url of this page as you click on the buttons.
          Refresh the page and notice which component is displayed in this demo.
        </p>
        <div class="actions">
          <button
            type="button"
            @click=${() => routerService.navigate("state-management/one")}
          >
            One
          </button>
          <button
            type="button"
            @click=${() => routerService.navigate("state-management/two")}
          >
            Two
          </button>
        </div>
        ${this.router.navigation()}
      </div>
    `;
  }
}
