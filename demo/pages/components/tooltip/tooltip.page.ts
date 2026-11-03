import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../demo-tools";
import { docStyles } from "../../../doc.styles";
import "../../../demo-tools";
import "./tooltip-demo";

const usage = `import "@veryan/lit-spa/components";

html\`
  <lit-spa-tooltip text="hello" position="right">
    Hover this text.
  </lit-spa-tooltip>

  <lit-spa-tooltip position="top" mode="click">
    <button slot="reference">Click</button>
    <div slot="floating">Open</div>
  </lit-spa-tooltip>
\`;`;

@customElement("demo-tooltip")
class TablePage extends LitElement {
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
        A tooltip that opens on hover or on click.
      </div>
      <demo-section
        .usage=${usage}
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/components/tooltip/tooltip-demo.ts"}
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
              "Whether the tooltip appears when clicked or hovered",
            default: "hover",
          },
        ]}
        .cssVariables=${[
          {
            name: "--tooltip-font-family",
            default: "--font-family or Roboto, sans-serif",
            description: "The font used for the tooltip.",
          },
          {
            name: "--tooltip-font-size",
            default: "12px",
            description: "The font size used for the tooltip.",
          },
          {
            name: "--tooltip-color",
            default: "--toast-color or #fff",
            description: "Color of the default tooltip",
          },
          {
            name: "--tooltip-background",
            default: "--secondary-background-color or white",
            description: "Background color of the custom tooltip",
          },
          {
            name: "--tooltip-default-background",
            default: "--toast-background or #313131",
            description: "Background color of the default tooltip",
          },
        ]}
      >
        <tooltip-demo></tooltip-demo>
      </demo-section>
    `;
  }
}
