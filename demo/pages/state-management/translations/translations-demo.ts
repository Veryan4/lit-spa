import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController, translateService } from "../../../demo-tools";
import { demoActionStyles } from "../../../demo-action.styles";
import "../../../demo-tools";

@customElement("translations-demo")
class TranslationsDemo extends LitElement {
  static styles = [demoActionStyles];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <div class="actions">
        <button type="button" @click=${this.changeLanguage}>Toggle Language</button>
        ${this.i18n.t("example.hello")}
      </div>
    `;
  }

  changeLanguage() {
    if (this.i18n.language == "en") {
      translateService.useLanguage("fr");
    } else {
      translateService.useLanguage("en");
    }
  }
}
