import { LitElement, html, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { styles } from "./loader.styles";

@customElement("lit-spa-loader")
export class LoaderComponent extends LitElement {
  static styles = [styles];

  @property({ type: String })
  styleInfo?: Record<string, string | number>;

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="loader" style=${styleMap(this.styleInfo ?? {})}>
        ${svg`
          <svg
            version="1.1"
            id="loader-1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 50 50"
            style="enable-background:new 0 0 50 50;"
            xml:space="preserve"
            >
            <path
              fill="currentColor"
              d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
            >
              <animateTransform
                attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.6s"
                repeatCount="indefinite"
              ></animateTransform>
            </path>
          </svg>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-loader": LoaderComponent;
  }
}
