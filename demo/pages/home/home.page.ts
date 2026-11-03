import { LitElement, css, html, svg } from "lit";
import { customElement, state } from "lit/decorators.js";
import "../../demo-tools";
import { routerService } from "../../demo-tools";
import { docStyles } from "../../doc.styles";
import "../../hl-js/hl-js";

const installCommand = "npm install @veryan/lit-spa lit";

const routeExample = `import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { Route, RouteController, routerService } from "@veryan/lit-spa/router";

const routes: Route[] = [
  {
    name: "home",
    pattern: ["", "home"],
    component: () => import("./home").then(() => html\`<home-page></home-page>\`),
  },
];

@customElement("my-app")
class MyApp extends LitElement {
  private router = new RouteController(this, routes);

  render() {
    return html\`
      <a @click=\${() => routerService.navigate("/home")}>Home</a>
      <main>\${this.router.navigation()}</main>
    \`;
  }
}`;

@customElement("demo-home")
class HomePage extends LitElement {
  static styles = [
    docStyles,
    css`
      :host {
        display: block;
        max-width: 42rem;
      }
      h1,
      h2,
      p,
      .description {
        max-width: none;
      }
      .lead {
        margin: 0 0 1.5rem;
        line-height: 1.5;
      }
      h2 {
        margin: 2rem 0 0.75rem;
      }
      .sample {
        margin: 0 0 0.75rem;
        min-width: 0;
        max-width: 48rem;
      }
      .code-bar {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 0.35rem;
      }
      .code-label {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 0.8125rem;
      }
      button.copy {
        font: inherit;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--theme-very-dark);
        background: transparent;
        border: none;
        padding: 0.15rem 0;
        cursor: pointer;
      }
      button.copy:hover {
        text-decoration: underline;
        text-underline-offset: 0.15em;
      }
      button.copy:focus-visible {
        outline: 2px solid var(--theme-very-dark);
        outline-offset: 2px;
      }
      .sample hl-js {
        display: block;
      }
      .next {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.25rem;
      }
      .next a {
        text-decoration: none;
        padding: 0.4rem 0.75rem;
        border-radius: 0.25rem;
        border: 1px solid var(--outline-color);
        color: inherit;
      }
      .next a:hover,
      .next a:focus-visible {
        background: var(--input-fill);
      }
      .examples {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        gap: 0.75rem 1.25rem;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .example {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .github {
        width: 1.25rem;
        height: 1.25rem;
        display: flex;
        color: var(--primary-color);
      }
      .repo {
        font-weight: 700;
      }
    `,
  ];

  @state()
  private copied: "install" | "example" | "" = "";

  render() {
    return html`
      <h1>lit-spa</h1>
      <p class="lead">
        A library for single-page apps built from
        <a href="https://lit.dev" target="_blank" rel="noopener noreferrer"
          >lit.dev</a
        >
        web components. It covers routing, HTTP, state, and a few UI pieces,
        with one runtime dependency.
      </p>
      <p>
        <a
          class="repo"
          href="https://github.com/Veryan4/lit-spa"
          target="_blank"
          rel="noopener noreferrer"
          >Source on GitHub</a
        >
      </p>

      <h2>Install</h2>
      <div class="sample">
        <div class="code-bar">
          <span class="code-label">npm</span>
          <button
            type="button"
            class="copy"
            @click=${() => this.copy("install")}
          >
            ${this.copied === "install" ? "Copied" : "Copy"}
          </button>
        </div>
        <hl-js .code=${installCommand}></hl-js>
      </div>

      <h2>Route a page</h2>
      <div class="sample">
        <div class="code-bar">
          <span class="code-label">app.ts</span>
          <button
            type="button"
            class="copy"
            @click=${() => this.copy("example")}
          >
            ${this.copied === "example" ? "Copied" : "Copy"}
          </button>
        </div>
        <hl-js .code=${routeExample}></hl-js>
      </div>
      <div class="next">
        <a
          href="/state-management#router"
          @click=${(event: MouseEvent) =>
            this.open(event, "/state-management#router")}
          >Router</a
        >
        <a
          href="/components#tables"
          @click=${(event: MouseEvent) => this.open(event, "/components#tables")}
          >Tables</a
        >
      </div>

      <h2>Websites built with it</h2>
      <ul class="examples">
        <li>
          <div class="example">
            News
            <a
              href="https://truba.news"
              target="_blank"
              rel="noopener noreferrer"
              >truba.news</a
            >
            <a
              href="https://github.com/Veryan4/truba"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="truba source on GitHub"
              >${this.githubSVG()}</a
            >
          </div>
        </li>
        <li>
          <div class="example">
            Rummy
            <a
              href="https://rummy.veryan.ca"
              target="_blank"
              rel="noopener noreferrer"
              >D-Rummy</a
            >
            <a
              href="https://github.com/Veryan4/d-rummy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="D-Rummy source on GitHub"
              >${this.githubSVG()}</a
            >
          </div>
        </li>
        <li>
          <div class="example">
            Portfolio
            <a
              href="https://veryan.ca"
              target="_blank"
              rel="noopener noreferrer"
              >veryan.ca</a
            >
            <a
              href="https://github.com/Veryan4/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio source on GitHub"
              >${this.githubSVG()}</a
            >
          </div>
        </li>
        <li>
          <div class="example">
            Wedding
            <a
              href="https://kaye.veryan.ca"
              target="_blank"
              rel="noopener noreferrer"
              >K &amp; V</a
            >
            <a
              href="https://github.com/Veryan4/wedding"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Wedding site source on GitHub"
              >${this.githubSVG()}</a
            >
          </div>
        </li>
      </ul>
    `;
  }

  private open(event: MouseEvent, href: string) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    routerService.navigate(href);
  }

  private copy(which: "install" | "example") {
    const text = which === "install" ? installCommand : routeExample;
    void navigator.clipboard.writeText(text).then(() => {
      this.copied = which;
      setTimeout(() => {
        if (this.copied === which) this.copied = "";
      }, 1500);
    });
  }

  githubSVG() {
    return svg`
    <div class="github">
      <svg viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" />
      </svg>
    </div>`;
  }
}
