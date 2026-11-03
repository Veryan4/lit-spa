import { css } from "lit";

export const docStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }
  h1 {
    font-size: 2rem;
    line-height: 1.2;
    margin: 0 0 0.75rem;
  }
  h2 {
    font-size: 1.5rem;
    line-height: 1.25;
    margin: 0;
  }
  h3 {
    font-size: 1.2rem;
    line-height: 1.3;
    margin: 0;
  }
  h1,
  h2,
  h3,
  p,
  .description {
    max-width: 68ch;
  }
  .description {
    margin: 0.75rem 0 1rem;
    line-height: 1.5;
  }
  a {
    color: var(--theme-very-dark);
  }
  a:visited {
    color: var(--theme-very-dark);
  }
`;
