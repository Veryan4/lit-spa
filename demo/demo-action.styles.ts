import { css } from "lit";

export const demoActionStyles = css`
  button {
    font: inherit;
    color: inherit;
    border: none;
    padding: 0.5rem 0.75rem;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    border-radius: 0.25rem;
    background-color: var(--input-fill);
  }
  button:hover {
    color: var(--secondary-background-color);
    background-color: var(--secondary-color);
  }
  button:focus-visible {
    outline: 2px solid var(--theme-very-dark);
    outline-offset: 2px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }
`;
