import { css } from "lit";

export const scrollBarStyles = css`
  ::-webkit-scrollbar {
    background-color: var(--scroll-color);
    width: 16px;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--scroll-color);
  }

  ::-webkit-scrollbar-thumb {
    background-color: #babac0;
    border-radius: 16px;
    border: 4px solid var(--scroll-color);
  }

  ::-webkit-scrollbar-button {
    display: none;
  }
`;
