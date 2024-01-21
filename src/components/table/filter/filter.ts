import { LitElement, html, svg } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { FilterCondition, TableColumn, TableRow } from "../table";
import { styles } from "./filter.styles";

export const defaultFilterLabels = {
  condition: "Condition: ",
  equals: "Equals",
  greaterThan: "Greater than",
  smallerThan: "Smaller than",
  between: "Between",
  from: "From: ",
  to: "To: ",
  apply: "Apply",
  clear: "Clear",
};

@customElement("lit-spa-filter")
export class FilterComponent extends LitElement {
  static styles = [styles];

  @property({ type: Object })
  column: TableColumn;

  @property({ type: Object })
  labels = defaultFilterLabels;

  @state()
  condition: FilterCondition = "EQUAL";

  @query("#input1")
  input1: HTMLInputElement;

  @query("#input2")
  input2: HTMLInputElement;

  @state()
  min?: number;

  @state()
  max?: number;

  private filterIndex?: Map<string, Set<keyof TableRow>>;
  private options: any[] = [];
  private selectedOptions: any[] = [];

  render() {
    return html`<div class="filter">
      <lit-spa-tooltip
        .position=${"bottom left-start right-start"}
        .mode=${"click"}
      >
        <div slot="reference" style="display:flex;align-items:center;">
          ${this.filterSVG()}
        </div>
        <div class="floating filter-form" slot="floating">
          ${this.condition == "EQUAL"
            ? html` <ul style="margin:0;">
                  ${this.selectedOptions.map(
                    (option) => html`<li>${option}</li>`
                  )}
                </ul>
                <datalist id="options">
                  ${this.options.map(
                    (option) => html`<option value=${option}></option>`
                  )}
                </datalist>`
            : ""}
          ${this.column.filterType == "number" ||
          this.column.filterType == "date"
            ? html` <label for="condition">${this.labels.condition}</label>
                <select
                  name="condition"
                  @change=${(e: any) => {
                    this.condition = e.target.value;
                    this.min = undefined;
                    this.max = undefined;
                  }}
                >
                  <option value="EQUAL" selected>${this.labels.equals}</option>
                  <option value="GREATER">${this.labels.greaterThan}</option>
                  <option value="SMALLER">${this.labels.smallerThan}</option>
                  <option value="BETWEEN">${this.labels.between}</option>
                </select>`
            : ""}
          <label for="filter">${this.labels.from}</label>
          <input
            id="input1"
            name="filter"
            list="options"
            max="${this.max}"
            @change=${(e: any) => (this.min = e.target.value)}
            @keydown="${this.onEnter}"
            type="${this.getInputFilterType()}"
          />
          ${this.condition === "BETWEEN"
            ? html`
                <label for="filter2">${this.labels.to}</label>
                <input
                  id="input2"
                  name="filter2"
                  @change=${(e: any) => (this.max = e.target.value)}
                  min="${this.min}"
                  type="${this.getInputFilterType()}"
                />
              `
            : ""}
          <button @click=${this.submitFilterValues}>
            ${this.labels.apply}
          </button>
          ${this.input1?.value ||
          this.input2?.value ||
          this.selectedOptions.length
            ? html` <button @click=${this.clear}>${this.labels.clear}</button> `
            : ""}
        </div>
      </lit-spa-tooltip>
    </div>`;
  }

  submitFilterValues(event: SubmitEvent) {
    event.preventDefault();
    let values: any[] = [];
    if (this.column.filterType == "string") {
      values = values.concat(this.selectedOptions);
      if (this.input1.value) {
        values.push(this.input1.value);
      }
    }
    if (
      this.column.filterType == "number" ||
      this.column.filterType == "date"
    ) {
      let val1 = this.input1.value;
      val1 = this.convertValueType(val1);
      values.push(val1);
      if (this.condition == "EQUAL") {
        values = values.concat(this.selectedOptions);
        if (this.input1.value) {
          values.push(this.input1.value);
        }
      }
      if (this.condition == "BETWEEN") {
        // TODO: manage setting maximum of first input and minimum of second input
        let val2 = this.input2.value;
        val2 = this.convertValueType(val2);
        values.push(val2);
      }
    }
    this.changeFilter(values);
  }

  convertValueType(value: any) {
    if (this.column.filterType == "number") {
      value = Number(value);
    }
    if (this.column.filterType == "date") {
      value = new Date(value);
    }
    return value;
  }

  filterSVG() {
    return svg`
    <svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
      <path d="M1595 295q17 41-14 70l-493 493v742q0 42-39 59-13 5-25 5-27 0-45-19l-256-256q-19-19-19-45v-486l-493-493q-31-29-14-70 17-39 59-39h1280q42 0 59 39z"/>
    </svg>`;
  }

  changeFilter(values: any[]) {
    const options = {
      detail: { column: this.column, condition: this.condition, values },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("filterchange", options));
  }

  clear() {
    this.input1.value = "";
    if (this.input2) {
      this.input2.value = "";
    }
    this.selectedOptions = [];
    this.options = [];
    this.filterIndex?.forEach((value, _) => this.options.push(value));
    const options = {
      detail: { field: this.column.field },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("clearfilter", options));
    this.requestUpdate();
  }

  getInputFilterType() {
    switch (this.column.filterType) {
      case "number":
        return "number";
      case "string":
        return "search";
      case "date":
        return "datetime-local";
      default:
        return "text";
    }
  }

  onEnter(e: KeyboardEvent) {
    if (e.key === "Enter" && this.condition == "EQUAL") {
      const input = e.target as HTMLInputElement;
      if (input.value !== "" && !this.selectedOptions.includes(input.value)) {
        this.selectedOptions.push(input.value);
        this.options = this.options.filter((option) => option != input.value);
        input.value = "";
        this.requestUpdate();
      }
    }
  }

  updateFilterOptions(filterIndex: Map<string, Set<keyof TableRow>>) {
    this.options = [];
    this.filterIndex = filterIndex;
    this.filterIndex.forEach((_, key) => this.options.push(key));
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-filter": FilterComponent;
  }
}
