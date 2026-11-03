import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { HashController, TranslationController } from "../../demo-tools";
import { docStyles } from "../../doc.styles";
import "../../demo-tools";
import "./http/http.page";
import "./translations/translations.page";
import "./theme/theme.page";
import "./router/router.page";
import "./state-object/state-object.page";

@customElement("demo-state-management")
class StateManagementPage extends LitElement {
  static styles = [
    docStyles,
    css`
      .description {
        margin: 1rem 0;
      }
      .title {
        margin-top: 3rem;
      }
    `,
  ];

  private i18n = new TranslationController(this);
  private hash = new HashController(this);

  render() {
    return html`
      <h1>State management</h1>
      <div class="description">
        A few services for the state most apps already have: routing, HTTP,
        translations, theme, and a shared class.
      </div>
      <div class="title">
        <lit-spa-hash id="router">
          <h2>Router</h2>
        </lit-spa-hash>
      </div>
      <demo-router></demo-router>
      <div class="title">
        <lit-spa-hash id="http">
          <h2>HTTP</h2>
        </lit-spa-hash>
      </div>
      <demo-http></demo-http>
      <div class="title">
        <lit-spa-hash id="translations">
          <h2>Translations</h2>
        </lit-spa-hash>
      </div>
      <demo-translations></demo-translations>
      <div class="title">
        <lit-spa-hash id="theme">
          <h2>Theme</h2>
        </lit-spa-hash>
      </div>
      <demo-theme></demo-theme>
      <div class="title">
        <lit-spa-hash id="class">
          <h2>State Class</h2>
        </lit-spa-hash>
      </div>
      <demo-state-object></demo-state-object>
    `;
  }
}
