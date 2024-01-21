import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit-html/directives/class-map.js";
import { styles } from "./pagination.styles";

@customElement("lit-spa-pagination")
export class PaginationComponent extends LitElement {
  static styles = [styles];

  @property({ type: Number })
  pagesCount = 0;

  @property({ type: Number })
  pageNumber = 1;

  render() {
    return this.pagesCount > 1
      ? html`
          <div class="pagination">
            ${this.pageNumber > 1
              ? html`<div class="back" @click=${() => this.changePage(this.pageNumber-1)}>
                  &#8810;
                </div>`
              : ""}
            <div class="first page ${classMap({selected: 1 == this.pageNumber})}" @click=${() => this.changePage(1)}>
              1
            </div>
            ${this.pagesCount > 5 && this.pageNumber > 3
              ? html`<div class="more">...</div>`
              : ""}
            ${[-1, 0, 1].map((n) => {
              let newPage = n + this.pageNumber;
              if (this.pageNumber <= 2) {
                newPage += 1;
              }
              return newPage < this.pagesCount && newPage > 1
                ? html`<div
                    class="page ${classMap({selected: newPage == this.pageNumber})}"
                    @click=${() => this.changePage(newPage)}
                  >
                    ${newPage}
                  </div>`
                : "";
            })}
            ${this.pagesCount > 5 && this.pageNumber < this.pagesCount - 2
              ? html`<div class="more">...</div>`
              : ""}
            <div
              class="last page ${classMap({selected: this.pagesCount == this.pageNumber})}"
              @click=${() => this.changePage(this.pagesCount)}
            >
              ${this.pagesCount}
            </div>
            ${this.pageNumber < this.pagesCount
              ? html`<div class="next" @click=${() => this.changePage(this.pageNumber+1)}>
                  &#8811;
                </div>`
              : ""}
          </div>
        `
      : "";
  }

  changePage(page: number) {
    const options = {
      detail: { page },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("pagechange", options));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-pagination": PaginationComponent;
  }
}
