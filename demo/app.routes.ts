import { html } from "lit";
import { Route } from "../src";

export const routes: Route[] = [
  {
    name: "home",
    pattern: ["", "home"],
    component: () =>
      import("./pages/home/home.page").then(
        () => html`<demo-home></demo-home>`,
      ),
  },
  {
    name: "state-management",
    pattern: "state-management",
    component: () =>
      import("./pages/state-management/state-management.page").then(
        () => html`<demo-state-management></demo-state-management>`,
      ),
    hashes: ["router", "http", "translations", "theme"],
  },
  {
    name: "components",
    pattern: "components",
    component: () =>
      import("./pages/components/components.page").then(
        () => html`<demo-components></demo-components>`,
      ),
    hashes: ["tooltip", "toast", "tables"],
  },
  //{
  //  name: "not-found",
  //  pattern: "*",
  //  component: () =>
  //    import("./pages/table.page").then(() => html`<not-found></not-found>`),
  //},
];
