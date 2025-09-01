import { css } from "lit";

export const styles = css`
  :host {
    scroll-margin-top: 450px;
  }
  :host * {
    scroll-margin-top: 450px;
  }
  .hash {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.5rem;
    visibility: hidden;
    margin-right: 0.5rem;
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    left: -1.5rem;
  }
  .row:hover .hash {
    visibility: visible;
  }
`;
