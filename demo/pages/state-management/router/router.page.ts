import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../demo-tools";
import { docStyles } from "../../../doc.styles";
import "../../../demo-tools";
import "./router-demo";

const usage = `import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { Route, RouteController, routerService } from "@veryan/lit-spa/router";

const routes: Route[] = [
  {
    name: "home",
    pattern: ["", "home"],
    component: () => import("./home").then(() => html\`<home-page></home-page>\`),
  },
];

@customElement("my-app")
class MyApp extends LitElement {
  private router = new RouteController(this, routes);

  render() {
    return html\`
      <a @click=\${() => routerService.navigate("/home")}>Home</a>
      <main>\${this.router.navigation()}</main>
    \`;
  }
}`;

@customElement("demo-router")
class RouterPage extends LitElement {
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
        Provides the ability to lazy-load components along with other typical
        routing features, such as guards, default routes, and collecting path
        parameters.
      </div>
      <demo-section
        .usage=${usage}
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/state-management/router/router-demo.ts"}
        .documentation=${[]}
      >
        <router-demo></router-demo>
      </demo-section>
    `;
  }
}
