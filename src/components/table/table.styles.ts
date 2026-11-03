import { css } from "lit";

export const styles = css`
  .table {
    display: grid;
    color: var(--primary-color, inherit);
    border-top: 1px solid
      var(--table-border-color, var(--outline-color, #b0bec5));
    border-right: 1px solid
      var(--table-border-color, var(--outline-color, #b0bec5));
  }

  .row {
    display: contents;
  }

  .table .column,
  .table .cell {
    white-space: nowrap;
    padding: 0.5rem;
    border-left: 1px solid
      var(--table-border-color, var(--outline-color, #b0bec5));
    border-bottom: 1px solid
      var(--table-border-color, var(--outline-color, #b0bec5));
  }

  .table .cell {
    background-color: var(--table-cell-background-color, unset);
  }

  .column {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(
      --table-column-background-color,
      var(--input-fill, #e8e8e8)
    );
  }

  .options {
    display: flex;
    align-items: center;
  }

  .search-input {
    margin: 1rem 0;
    width: 15rem;
    max-width: 100%;
    padding: 0.5rem;
    color: var(--primary-color, inherit);
    background: var(--secondary-background-color, white);
    border: 1px solid var(--outline-color, #b0bec5);
    font-family: var(--search-font-family, var(--font-family, sans-serif));
    font-size: var(--search-font-size, var(--font-size, 1rem));
    border-radius: 0.25rem;
  }
  .search-input:focus,
  .search-input:focus-visible {
    border-color: var(--search-border-color, var(--theme-very-dark, #5391f3));
    outline: none;
  }
`;
