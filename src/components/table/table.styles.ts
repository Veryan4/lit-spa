import { css } from "lit";

export const styles = css`
  .table {
    display: grid;
    border-top: 1px solid
      var(--table-border-color, var(--secondary-color, black));
    border-right: 1px solid
      var(--table-border-color, var(--secondary-color, black));
  }

  .table .column,
  .table .cell {
    white-space: nowrap;
    padding: 0.5rem;
    border-left: 1px solid
      var(--table-border-color, var(--secondary-color, black));
    border-bottom: 1px solid
      var(--table-border-color, var(--secondary-color, black));
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
    padding: 0.5rem;
    font-family: var(--search-font-size, var(--font-family));
    font-size: var(--search-font-size, var(--font-size));
    border-radius: 0.25rem;
  }
  .search-input:focus,
  .search-input:focus-visible {
    border-color: var(--search-border-color, #7aaaf6);
    outline: none;
  }
`;
