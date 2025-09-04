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
    color: var(--pagination-color, var(--secondary-background-color, white));
    background-color: var(
      --pagination-background,
      var(--secondary-color, black)
    );
    border-radius: 100%;
    width: 1.5rem;
    height: 1.5rem;
  }

  .page.selected {
    color: var(--pagination-selected-color, var(--secondary-color, black));
    background-color: var(
      --pagination-selected-background,
      var(--secondary-background-color)
    );
    border: 1px var(--pagination-selected-color, var(--secondary-color, black))
      solid;
  }
`;
