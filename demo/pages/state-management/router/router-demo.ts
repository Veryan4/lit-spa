import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { RouteController, Route, routerService } from "../../../demo-tools";
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
    css`
      button {
        cursor: pointer;
        width: fit-content;
      }
      .body {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `,
  ];

  private router = new RouteController(this, routes);

  render() {
    return html`
      <div class="body">
        Notice the change in url of this page as you click on the buttons.
        Refresh the page and notice which component is displayed in this demo.
        <div>
          <button
            @click=${() => routerService.navigate("state-management/one")}
          >
            One
          </button>
          <button
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
