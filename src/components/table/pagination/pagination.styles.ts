import { css } from "lit";

export const styles = css`
  .pagination {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    font-size: 1rem;
    margin-top: 0.5rem;
    gap: 0.5rem;
  }

  .page,
  .back,
  .next {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: black;
    border-radius: 100%;
    width: 1.5rem;
    height: 1.5rem;
  }

  .page.selected {
    color: black;
    background-color: white;
    border: 1px black solid;
  }
`;
