import { css } from "lit";

export const styles = css`
  #floating {
    visibility: hidden;
    z-index: 9999;
    border-radius: 4px;
    background-color: var(--secondary-background-color);
    box-shadow:
      0px 2px 1px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14),
      0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    box-sizing: border-box;
    padding: 0.5rem;
  }

  #floating.default {
    width: fit-content;
    font-family: var(--font-family, "Roboto Sans", sans-serif);
    font-size: var(--font-size, 18px);
    background: var(--toast-background, #313131);
    color: var(--toast-color, #fff);
    border-radius: 6px;
    padding: 0;
  }

  #floating.open {
    visibility: visible;
  }

  #reference.default:hover + #floating.default {
    visibility: visible;
  }

  #reference {
    width: fit-content;
  }

  .tooltip-text {
    text-align: center;
    width: fit-content;
    height: fit-content;
    white-space: nowrap;
    padding: 0.25rem 1rem;
  }
`;
