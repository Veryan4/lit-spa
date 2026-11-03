import { LitElement, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { defaultStyles, githubStyles, ideStyles, styles } from "./hl-js.styles";
import HLJS from "highlight.js";
import { ThemeController } from "../demo-tools";

@customElement("hl-js")
export class HLJSComponent extends LitElement {
  static styles = [styles, defaultStyles, githubStyles, ideStyles];

  @property({ type: String })
  url: string = "";
  /** Inline source. When set, nothing is fetched and the URL view is left unused. */
  @property({ type: String })
  code = "";
  @property({ type: String })
  showBorder = true;
  @property({ type: String })
  showLineNumbers = true;
  @property({ type: String })
  showFileMeta = true;
  @property({ type: String })
  showFullPath = true;

  @query("code")
  codeElement: HTMLElement;

  private theme = new ThemeController(this);
  private painted = "";

  constructor() {
    super();
  }

  protected updated(): void {
    if (this.code) this.paintCode(this.code);
  }

  render() {
    if (this.code) {
      const themeName = this.theme.value == "dark" ? "dark" : "light";
      return html`
        <div class="code-container">
          <div
            class="file file-${themeName}"
            style="${this.showBorder ? "" : "border:0"}"
          >
            <div class="file-data">
              <div class="code-area">
                <pre style="tab-size:8"><code class="ts ${
                  this.showLineNumbers ? "" : "hide-line-numbers"
                }"></code></pre>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    const target = new URL(this.url);
    const lineSplit = target.hash.split("-");
    const startLine =
      (target.hash !== "" && Number(lineSplit[0].replace("#L", ""))) || -1;
    const endLine =
      (target.hash !== "" &&
        lineSplit.length > 1 &&
        Number(lineSplit[1].replace("L", ""))) ||
      startLine;
    const tabSize = target.searchParams.get("ts") || 8;
    const pathSplit = target.pathname.split("/");
    const filePath = pathSplit.slice(5, pathSplit.length).join("/");
    const fileExtension =
      filePath.split(".").length > 1 ? filePath.split(".").pop() : "txt";
    const fileURL = target.href.replace(
      "https://github.com/Veryan4/lit-spa/blob",
      "https://raw.githubusercontent.com/Veryan4/lit-spa",
    );
    setTimeout(() => this.fetchFiles(fileURL, startLine, endLine));

    return html`
      <div class="code-container">
        <div
          class="file file-${this.theme.value == "dark" ? "dark" : "light"}"
          style="${this.showBorder ? "" : "border:0"}"
        >
          <div class="file-data">
            <div class="code-area">
              <pre style="tab-size:${tabSize}"><code class="${fileExtension} ${
                this.showLineNumbers ? "" : "hide-line-numbers"
              }"></code></pre>
            </div>
          </div>

          ${
            this.showFileMeta
              ? html`<div
                  class="file-meta file-meta-${
                    this.theme.value == "dark" ? "dark" : "light"
                  }"
                  style="${this.showBorder ? "" : "border:0"}"
                >
                  <a target="_blank" href="${this.url}" style="float:right"
                    >view</a
                  >
                  <a target="_blank" href="${this.url}"
                    >${decodeURIComponent(
                      this.showFullPath
                        ? filePath
                        : pathSplit[pathSplit.length - 1],
                    )}</a
                  >
                </div>`
              : ""
          }
        </div>
      </div>
    `;
  }

  fetchFiles(rawFileURL: string, startLine: number, endLine: number) {
    const fetchFile = fetch(rawFileURL).then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return Promise.reject(
          `${response.status}\nFailed to download ${rawFileURL}`,
        );
      }
    });

    fetchFile.then((result) => {
      let codeText = result;
      if (result) {
        if (codeText[codeText.length - 1] === "\n") {
          codeText = codeText.slice(0, -1);
        }
        let codeTextSplit = codeText.split("\n");
        if (startLine > 0) {
          codeTextSplit = codeTextSplit.slice(startLine - 1, endLine);
        }

        while (true) {
          const firstChars = codeTextSplit
            .filter((s) => s.length > 0)
            .map((s) => s[0]);
          if (
            new Set(firstChars).size == 1 &&
            [" ", "\t"].includes(firstChars[0])
          ) {
            codeTextSplit = codeTextSplit.map((s) => s.slice(1));
          } else {
            break;
          }
        }

        codeText = codeTextSplit.join("\n");
        codeText = codeText + "\n";
      }

      this.codeElement.textContent = codeText;
      delete this.codeElement.dataset.highlighted;
      HLJS.highlightElement(this.codeElement);
    });
  }

  private paintCode(codeText: string) {
    if (!this.codeElement) return;
    if (this.painted === codeText && this.codeElement.dataset.highlighted) {
      return;
    }
    this.painted = codeText;
    const text = codeText.endsWith("\n") ? codeText.slice(0, -1) : codeText;
    this.codeElement.textContent = `${text}\n`;
    delete this.codeElement.dataset.highlighted;
    HLJS.highlightElement(this.codeElement);
  }
}
