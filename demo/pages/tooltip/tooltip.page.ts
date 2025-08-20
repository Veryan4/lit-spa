import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../demo-tools";
import "../../demo-tools";
import "./tooltip-demo";

@customElement("demo-tooltip")
class TablePage extends LitElement {
  static styles = [
    css`
      .description {
        margin: 1rem 0;
      }
    `,
  ];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <h2>Tooltip</h2>
      <div class="description">
        A tooltip which can either be activate on hover or on click.
      </div>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/tooltip/tooltip-demo.ts"}
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
        <tooltip-demo></tooltip-demo>
      </demo-section>
    `;
  }
}
