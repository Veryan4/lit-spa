import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../src";
import "../../demo-tools";
import "./table-demo";
import "./local-table-demo";
import "./infinite-table-demo";

@customElement("demo-tables")
class TablesPageDemo extends LitElement {
  static styles = [css`
    .description {
      margin: 1rem 0;
    }
  `];

  private i18n = new TranslationController(this);

  render() {
    return html`
      <h2>Table</h2>
      <div class="description">A standard responsive table which styling can be customized.</div>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/table/table-demo.ts"}
        .documentation=${[
          {
            property: "columns",
            type: "TableColumn[]",
            description: "The definition for the formatting and rendering of each column of the table.",
          },
          {
            property: "data",
            type: "TableRow[]",
            description: "An array of flat objects who's properties match corresponding fields in th columns.",
          },
          {
            property: "sortBy",
            type: "TableSort[]",
            description: "An ordered array of sorting to be applied the the table's data.",
          },
          {
            property: "filterBy",
            type: "TableFilter[]",
            description: "An array of filters to be applied to the table's data.",
          },
          {
            property: "styles",
            type: "Record<string, string>",
            description: "Styles which will be applied the table's container",
          },
          {
            property: "columnStyles",
            type: "Record<string, string>",
            description: "Styles which will be applied to all of the columns",
          },
          {
            property: "cellStyles",
            type: "Record<string, string>",
            description: "Styles which will be applied to all of the cells.",
          },
          {
            property: "labels",
            type: "Record<string, any>",
            default:
              '{filterLabels:{condition:"Condition: ",equals: "Equals",greaterThan: "Greater than",smallerThan: "Smaller than",between:"Between",from:"From: ",to:"To: ",apply:"Apply",clear:"Clear"}}',
            description: "The copy displayed in the table which can be replaces with copy from another language.",
          },
        ]}
      >
        <demo-table></demo-table>
      </demo-section>
      <h2>Local Table</h2>
      <div class="description">A table which can perform efficient searching, sorting, and filtering on data that is available on the client side.</div>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/table/local-table-demo.ts"}
        .documentation=${[
          {
            property: "columns",
            type: "TableColumn[]",
            description: "The definition for the formatting and rendering of each column of the table.",
          },
          {
            property: "data",
            type: "TableRow[]",
            description: "An array of flat objects who's properties match corresponding fields in th columns.",
          },
          {
            property: "sortBy",
            type: "TableSort[]",
            description: "An ordered array of sorting to be applied the the table's data.",
          },
          {
            property: "filterBy",
            type: "TableFilter[]",
            description: "An array of filters to be applied to the table's data.",
          },
          {
            property: "pageNumber",
            type: "Number",
            default: "1",
            description: "Current page displayed on the table",
          },
          {
            property: "pageSize",
            type: "Number",
            default: "20",
            description: "Number of rows of data per page",
          },
          {
            property: "dataIdField",
            type: "keyof TableRow",
            description: "The property in the data that will be used to uniquely identify a row",
          },
          {
            property: "searchText",
            type: "String",
            description: "The text that is used to search the table",
          },
          {
            property: "minSearchCharacters",
            type: "Number",
            default: "2",
            description: "The minimum amount of characters required in order for a search to be performed. The higher the number the fast the search & indexing will perform.",
          },
          {
            property: "searchOperator",
            type: "SearchOperator",
            default: "AND",
            description: "Which search operator is placed between each word of the search",
          },
          {
            property: "styles",
            type: "Record<string, string>",
            description: "Styles which will be applied the table's container",
          },
          {
            property: "columnStyles",
            type: "Record<string, string>",
            description: "Styles which will be applied to all of the columns",
          },
          {
            property: "cellStyles",
            type: "Record<string, string>",
            description: "Styles which will be applied to all of the cells.",
          },
          {
            property: "labels",
            type: "Record<string, any>",
            default:
              '{filterLabels:{condition:"Condition: ",equals: "Equals",greaterThan: "Greater than",smallerThan: "Smaller than",between:"Between",from:"From: ",to:"To: ",apply:"Apply",clear:"Clear"}}',
            description: "The copy displayed in the table which can be replaces with copy from another language.",
          },
        ]}
      >
        <demo-local-table></demo-local-table>
      </demo-section>
      <h2>Infinite Table</h2>
      <div class="description">A table which can efficiently load and render additional data from a server response when scrolling.</div>
      <demo-section
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/table/infinite-table-demo.ts"}
        .documentation=${[
          {
            property: "columns",
            type: "TableColumn[]",
            description: "The definition for the formatting and rendering of each column of the table.",
          },
          {
            property: "data",
            type: "TableRow[]",
            description: "An array of flat objects who's properties match corresponding fields in th columns.",
          },
          {
            property: "scrollOptions",
            type: "IntersectionObserverInit",
            description: "Javascript configuration object used to adjust when the onScroll function is called.",
          },
          {
            property: "styles",
            type: "Record<string, string>",
            description: "Styles which will be applied the table's container",
          },
          {
            property: "columnStyles",
            type: "Record<string, string>",
            description: "Styles which will be applied to all of the columns",
          },
          {
            property: "cellStyles",
            type: "Record<string, string>",
            description: "Styles which will be applied to all of the cells.",
          },
          {
            property: "labels",
            type: "Record<string, any>",
            default:
              '{filterLabels:{condition:"Condition: ",equals: "Equals",greaterThan: "Greater than",smallerThan: "Smaller than",between:"Between",from:"From: ",to:"To: ",apply:"Apply",clear:"Clear"}}',
            description: "The copy displayed in the table which can be replaces with copy from another language.",
          },
        ]}
      >
        <demo-infinite-table></demo-infinite-table>
      </demo-section>
    `;
  }
}
