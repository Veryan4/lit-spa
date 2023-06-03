import { css } from "lit";

export const styles = css`
  .sort {
    cursor: pointer;
  }

  .sort-default {
    display: none;
    flex-direction: column;
  }

  .sort-default.show {
    display:flex;
    align-items:center;
  }

  .sort-direction {
    display: none;
    position: relative;
    font-size: 0.6rem;
  }

  .sort-direction .sort-number {
    position: absolute;
    color: white;
    bottom: 0.1rem;
    left: 0.35rem;
  }

  .sort-direction.down .sort-number {
    bottom: 0.2rem;
  }

  .sort-direction.up,
  .sort-direction.down {
    display: flex;
    align-items: center;
  }

  .down svg {
    transform: rotate(180deg);
  }
`;
