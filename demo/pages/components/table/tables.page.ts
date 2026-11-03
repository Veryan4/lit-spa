import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../../../../src";
import { CSSVar } from "/@/demo-section/css-vars";
import { docStyles } from "../../../doc.styles";
import "../../../demo-tools";

const standardUsage = `import "@veryan/lit-spa/components";

const columns = [
  { field: "name", name: "Name" },
  { field: "email", name: "Email" },
];

html\`<lit-spa-table .columns=\${columns} .data=\${rows}></lit-spa-table>\`;`;

const localUsage = `import "@veryan/lit-spa/components";

html\`
  <lit-spa-local-table
    .columns=\${columns}
    .data=\${rows}
    .pageSize=\${20}
  ></lit-spa-local-table>
\`;`;

const infiniteUsage = `import "@veryan/lit-spa/components";

html\`
  <lit-spa-infinite-table
    .columns=\${columns}
    .data=\${rows}
  ></lit-spa-infinite-table>
\`;`;
import "./table-demo";
import "./local-table-demo";
import "./infinite-table-demo";

@customElement("demo-tables")
class TablesPageDemo extends LitElement {
  static styles = [
    docStyles,
    css`
      .description {
        margin: 1rem 0;
      }
      h3.title {
        margin-top: 4rem;
      }
    `,
  ];

  private i18n = new TranslationController(this);

  tableCSSVariables: CSSVar[] = [
    {
      name: "--table-border-color",
      default: "--outline-color or #b0bec5",
      description: "The color of the lines of the table",
    },
    {
      name: "--table-cell-background-color",
      default: "unset",
      description: "The background color of the rows of the table",
    },
    {
      name: "--table-column-background-color",
      default: "--input-fill or #E8E8E8",
      description: "The background color of the column row of the table",
    },
    {
      name: "--pagination-color",
      default: "--secondary-color or black",
      description: "The color of the page numbers",
    },
    {
      name: "--pagination-background",
      default: "--secondary-background-color or white",
      description: "The color surrounding the page numbers",
    },
    {
      name: "--pagination-selected-color",
      default: "--secondary-background-color or white",
      description: "The color of the selected page number",
    },
    {
      name: "--pagination-selected-background",
      default: "--secondary-color or black",
      description: "The color of the selected page number",
    },
  ];

  render() {
    return html`
      <h3>Standard</h3>
      <div class="description">
        A responsive table. Its styling can be customized.
      </div>
      <demo-section
        .usage=${standardUsage}
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/components/table/table-demo.ts"}
        .documentation=${[
          {
            property: "columns",
            type: "TableColumn[]",
            description:
              "The definition for the formatting and rendering of each column of the table.",
          },
          {
            property: "data",
            type: "TableRow[]",
            description:
              "An array of flat objects who's properties match corresponding fields in th columns.",
          },
          {
            property: "sortBy",
            type: "TableSort[]",
            description:
              "An ordered array of sorting to be applied the the table's data.",
          },
          {
            property: "filterBy",
            type: "TableFilter[]",
            description:
              "An array of filters to be applied to the table's data.",
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
            description:
              "The copy displayed in the table which can be replaces with copy from another language.",
          },
        ]}
        .cssVariables=${this.tableCSSVariables}
      >
        <demo-table></demo-table>
      </demo-section>
      <h3 class="title">Local Table</h3>
      <div class="description">
        Searching, sorting, and filtering for data that is already on the
        client.
      </div>
      <demo-section
        .usage=${localUsage}
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/components/table/local-table-demo.ts"}
        .documentation=${[
          {
            property: "columns",
            type: "TableColumn[]",
            description:
              "The definition for the formatting and rendering of each column of the table.",
          },
          {
            property: "data",
            type: "TableRow[]",
            description:
              "An array of flat objects who's properties match corresponding fields in th columns.",
          },
          {
            property: "sortBy",
            type: "TableSort[]",
            description:
              "An ordered array of sorting to be applied the the table's data.",
          },
          {
            property: "filterBy",
            type: "TableFilter[]",
            description:
              "An array of filters to be applied to the table's data.",
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
            description:
              "The property in the data that will be used to uniquely identify a row",
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
            description:
              "The minimum amount of characters required in order for a search to be performed. The higher the number the fast the search & indexing will perform.",
          },
          {
            property: "searchOperator",
            type: "SearchOperator",
            default: "AND",
            description:
              "Which search operator is placed between each word of the search",
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
            description:
              "The copy displayed in the table which can be replaces with copy from another language.",
          },
        ]}
        .cssVariables=${[
          ...this.tableCSSVariables,
          {
            name: "--pagination-color",
            default: "--secondary-color or black",
            description: "The color of the page numbers",
          },
          {
            name: "--pagination-background",
            default: "--secondary-background-color or white",
            description: "The color surrounding the page numbers",
          },
          {
            name: "--pagination-selected-color",
            default: "--secondary-background-color or white",
            description: "The color of the selected page number",
          },
          {
            name: "--pagination-selected-background",
            default: "--secondary-color or black",
            description: "The color of the selected page number",
          },
          {
            name: "--search-font-family",
            default: "--font-family",
            description: "The font family of the search input",
          },
          {
            name: "--search-font-size",
            default: "--font-size",
            description: "The size of the font of the search input",
          },
          {
            name: "--search-border-color",
            default: "--theme-very-dark or #5391f3",
            description: "The border color when the search input is selected",
          },
        ]}
      >
        <demo-local-table></demo-local-table>
      </demo-section>
      <h3 class="title">Infinite Table</h3>
      <div class="description">
        A table which can efficiently load and render additional data from a
        server response when scrolling.
      </div>
      <demo-section
        .usage=${infiniteUsage}
        .url=${"https://github.com/Veryan4/lit-spa/blob/master/demo/pages/components/table/infinite-table-demo.ts"}
        .documentation=${[
          {
            property: "columns",
            type: "TableColumn[]",
            description:
              "The definition for the formatting and rendering of each column of the table.",
          },
          {
            property: "data",
            type: "TableRow[]",
            description:
              "An array of flat objects who's properties match corresponding fields in th columns.",
          },
          {
            property: "scrollOptions",
            type: "IntersectionObserverInit",
            description:
              "Javascript configuration object used to adjust when the onScroll function is called.",
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
            description:
              "The copy displayed in the table which can be replaces with copy from another language.",
          },
        ]}
        .cssVariables=${this.tableCSSVariables}
      >
        <demo-infinite-table></demo-infinite-table>
      </demo-section>
    `;
  }
}
