import { css } from "lit";

export const styles = css`
  :host(.small) .loader {
    height: unset;
  }

  .loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
