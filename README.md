![lit-spa logo](https://github.com/Veryan4/lit-spa/blob/master/public/lit-spa.png?raw=true)

A library for creating Single Page Applications based on [lit.dev](https://lit.dev) WebComponents.

## Install

```bash
npm install @veryan/lit-spa lit
```

Import the pieces you use. The package root still exports the full library. Subpath imports avoid loading the table, tooltip, and toast components when you only need routing or HTTP:

```ts
import { RouteController, routerService } from "@veryan/lit-spa/router";
import { httpService } from "@veryan/lit-spa/http";
import { State, StateController } from "@veryan/lit-spa/state";
```

```ts
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Route, RouteController, routerService } from "@veryan/lit-spa/router";

const routes: Route[] = [
  {
    name: "home",
    pattern: ["", "home"],
    component: () => import("./home").then(() => html`<home-page></home-page>`),
  },
  {
    name: "missing",
    pattern: "*",
    component: () => import("./missing").then(() => html`<missing-page></missing-page>`),
  },
];

@customElement("my-app")
class MyApp extends LitElement {
  private router = new RouteController(this, routes);

  render() {
    return html`
      <a @click=${() => routerService.navigate("/home")}>Home</a>
      <main>${this.router.navigation()}</main>
    `;
  }
}
```

Route patterns match whole path segments. `home` matches `/home` and not `/homepage` or `/home/extra`. A pattern ending in `/*`, such as `account/*`, keeps the parent mounted for nested routers. `*` is the catch-all.

Serve the app with a fallback to `index.html` so deep links survive a refresh. See `nginx/frontend.conf`.

## Docs

Documentation website: https://lit.veryan.ca

Websites built with the framework:

- Website: https://truba.news

  Repo: https://github.com/Veryan4/truba

- Website: https://rummy.veryan.ca

  Repo: https://github.com/Veryan4/d-rummy

- Website: https://veryan.ca

  Repo: https://github.com/Veryan4/portfolio

- Website: https://kaye.veryan.ca

  Repo: https://github.com/Veryan4/wedding
