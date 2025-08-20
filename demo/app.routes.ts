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
    name: "table",
    pattern: ["", "table"],
    component: () =>
      import("./pages/table/tables.page").then(
        () => html`<demo-tables></demo-tables>`,
      ),
  },
  {
    name: "tooltip",
    pattern: "tooltip",
    component: () =>
      import("./pages/tooltip/tooltip.page").then(
        () => html`<demo-tooltip></demo-tooltip>`,
      ),
  },
  {
    name: "toast",
    pattern: "toast",
    component: () =>
      import("./pages/toast/toast.page").then(
        () => html`<demo-toast></demo-toast>`,
      ),
  },
  {
    name: "loader",
    pattern: "loader",
    component: () =>
      import("./pages/loader/loader.page").then(
        () => html`<demo-loader></demo-loader>`,
      ),
  },
  {
    name: "translations",
    pattern: "translations",
    component: () =>
      import("./pages/translations/translations.page").then(
        () => html`<demo-translations></demo-translations>`,
      ),
  },
  {
    name: "router",
    pattern: "router",
    component: () =>
      import("./pages/router/router.page").then(
        () => html`<demo-router></demo-router>`,
      ),
  },
  {
    name: "theme",
    pattern: "theme",
    component: () =>
      import("./pages/theme/theme.page").then(
        () => html`<demo-theme></demo-theme>`,
      ),
  },
  {
    name: "http",
    pattern: "http",
    component: () =>
      import("./pages/http/http.page").then(
        () => html`<demo-http></demo-http>`,
      ),
  },
  //{
  //  name: "not-found",
  //  pattern: "*",
  //  component: () =>
  //    import("./pages/table.page").then(() => html`<not-found></not-found>`),
  //},
];
