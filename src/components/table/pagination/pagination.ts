import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
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
          <div class="pagination" role="navigation" aria-label="Pagination">
            ${this.pageNumber > 1
              ? html`<button
                  type="button"
                  class="back"
                  aria-label="Previous page"
                  @click=${() => this.changePage(this.pageNumber - 1)}
                >
                  &#8810;
                </button>`
              : ""}
            <button
              type="button"
              class="first page ${classMap({ selected: 1 == this.pageNumber })}"
              aria-current=${this.pageNumber === 1 ? "page" : "false"}
              @click=${() => this.changePage(1)}
            >
              1
            </button>
            ${this.pagesCount > 5 && this.pageNumber > 3
              ? html`<div class="more">...</div>`
              : ""}
            ${[-1, 0, 1].map((n) => {
              let newPage = n + this.pageNumber;
              if (this.pageNumber <= 2) {
                newPage += 1;
              }
              return newPage < this.pagesCount && newPage > 1
                ? html`<button
                    type="button"
                    class="page ${classMap({
                      selected: newPage == this.pageNumber,
                    })}"
                    aria-current=${newPage == this.pageNumber ? "page" : "false"}
                    @click=${() => this.changePage(newPage)}
                  >
                    ${newPage}
                  </button>`
                : "";
            })}
            ${this.pagesCount > 5 && this.pageNumber < this.pagesCount - 2
              ? html`<div class="more">...</div>`
              : ""}
            <button
              type="button"
              class="last page ${classMap({
                selected: this.pagesCount == this.pageNumber,
              })}"
              aria-current=${
                this.pagesCount == this.pageNumber ? "page" : "false"
              }
              @click=${() => this.changePage(this.pagesCount)}
            >
              ${this.pagesCount}
            </button>
            ${this.pageNumber < this.pagesCount
              ? html`<button
                  type="button"
                  class="next"
                  aria-label="Next page"
                  @click=${() => this.changePage(this.pageNumber + 1)}
                >
                  &#8811;
                </button>`
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
