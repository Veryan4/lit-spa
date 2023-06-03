import { html } from "lit";
import { Route } from "../";



export const routes: Route[] = [
    {
      name: "table",
      pattern: ["", "table"],
      component: () =>
        import("./pages/table/tables.page").then(() => html`<demo-tables></demo-tables>`),
    },
    {
      name: "tooltip",
      pattern: "tooltip",
      component: () =>
        import("./pages/tooltip/tooltip.page").then(() => html`<demo-tooltip></demo-tooltip>`),
    },
    //{
    //  name: "not-found",
    //  pattern: "*",
    //  component: () =>
    //    import("./pages/table.page").then(() => html`<not-found></not-found>`),
    //},
  ];
