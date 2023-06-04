import { css } from "lit";

export const styles = css`
  .table {
    display: grid;
    border-top: 1px solid black;
    border-right: 1px solid black;
  }

  .table .column,
  .table .cell {
    white-space: nowrap;
    padding: 0.5rem;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
  }

  .column {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color:#E8E8E8;
  }

  .options {
    display: flex;
    align-items: center;
  }

`;
