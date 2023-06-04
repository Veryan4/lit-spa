import { LitElement, html} from "lit";
import { customElement } from "lit/decorators.js";
import { Route, RouteController } from "../../demo-tools";
import "../../demo-tools";

const routes: Route[] = [
  {
    name: "one",
    pattern: ["", "one"],
    component: () =>
      import("./component-one").then(() => html`<component-one></component-one>`),
  },
  {
    name: "two",
    pattern: "two",
    component: () =>
      import("./component-two").then(() => html`<component-two></component-two>`),
  }
];

@customElement("router-demo")
class RouterDemo extends LitElement {
  private router = new RouteController(this, routes);

   render() {
    return html`
        <div class="body">
            ${this.router.navigation()}
        </div>
    `;
  }
}