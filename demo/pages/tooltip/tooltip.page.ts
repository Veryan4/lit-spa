import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../src";
import "../../demo-tools";
import "./click-tooltip-demo";
import "./simple-tooltip-demo";

@customElement("demo-tooltip")
class TablePage extends LitElement {
  static styles = [css``];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <h2>Tooltip</h2>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/tooltip/simple-tooltip-demo.ts"}
        .documentation=${[
          {
            property: "position",
            type: "TooltipPosition",
            description:
              "Where the tooltip appears compared to its target. Fallback positions can be defined by adding additional space separated TooltipPositions to the string",
          },
          {
            property: "text",
            type: "string",
            description: "The copy to be displayed in a pre-styled tooltip",
          },
          {
            property: "click",
            type: "TooltipMode",
            description:
              "Wether the tooltip appeares when clicked or hovered upon",
            default: "hover",
          },
        ]}
      >
        <simple-tooltip-demo></simple-tooltip-demo>
      </demo-section>
      <h2>On Click</h2>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/tooltip/click-tooltip-demo.ts"}
        .documentation=${[
          {
            property: "position",
            type: "TooltipPosition",
            description:
              "Where the tooltip appears compared to its target. Fallback positions can be defined by adding additional space separated TooltipPositions to the string",
          },
          {
            property: "text",
            type: "string",
            description:
              "The copy to be displayed if tooltip is using the pre-styled template",
          },
          {
            property: "click",
            type: "TooltipMode",
            description:
              "Wether the tooltip appeares when clicked or hovered upon",
            default: "hover",
          },
        ]}
      >
        <click-tooltip-demo></click-tooltip-demo>
      </demo-section>
    `;
  }
}
