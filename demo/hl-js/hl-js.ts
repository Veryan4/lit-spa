import { LitElement, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { defaultStyles, githubStyles, styles } from "./hl-js.styles";
import HLJS from 'highlight.js';

@customElement("hl-js")
export class HLJSComponent extends LitElement {
  static styles = [styles, defaultStyles, githubStyles];

  @property({ type: String })
  url: string = "";

  @property({ type: Boolean })
  isDarkMode = false;
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


  constructor() {
    super();
  }

  render() {
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
    const fileURL = target.href.replace('https://github.com/Veryan4/lit-spa/blob', 'https://raw.githubusercontent.com/Veryan4/lit-spa');
    setTimeout(() => this.fetchFiles(fileURL, startLine, endLine))

    return html`
      <div class="code-container" style="max-width:80vw;">
        <div
          class="file file-${this.isDarkMode ? "dark" : "light"}"
          style="${this.showBorder ? "" : "border:0"}"
        >
          <div class="file-data">
            <div class="code-area">
              <pre
                style="tab-size:${tabSize}"
              ><code class="${fileExtension} ${this.showLineNumbers
                ? ""
                : "hide-line-numbers"}"></code></pre>
            </div>
          </div>

          ${this.showFileMeta
            ? html`<div class="file-meta file-meta-${
              this.isDarkMode ? "dark" : "light"
              }"
        style="${this.showBorder ? "" : "border:0"}">
        <a target="_blank" href="${fileURL}" style="float:right">view raw</a>
        <a target="_blank" href="${this.url}">${decodeURIComponent(
                this.showFullPath ? filePath : pathSplit[pathSplit.length - 1]
              )}`
            : ""}
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
          `${response.status}\nFailed to download ${rawFileURL}`
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

      HLJS.highlightElement(this.codeElement);
    });
  }

}
