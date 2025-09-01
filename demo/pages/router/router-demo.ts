import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { RouteController, Route, routerService } from "../../demo-tools";
import "../../demo-tools";

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
  private router = new RouteController(this, routes);

  render() {
    return html`
      <div class="body">
        <button @click=${() => routerService.navigate("state-management/one")}>
          One
        </button>
        <button @click=${() => routerService.navigate("state-management/two")}>
          Two
        </button>
        ${this.router.navigation()}
      </div>
    `;
  }
}
