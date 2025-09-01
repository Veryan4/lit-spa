import { css } from "lit";

export const styles = css`
  .app {
    display: flex;
  }
  .side-nav {
    position: fixed;
    min-width: 10rem;
    width: 10rem;
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    background-color: #b0bec5;
    padding-top: 10rem;
    gap: 0.25rem;
    min-height: 100dvh;
    max-height: 100dvh;
  }
  .nav-item {
    height: 2rem;
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    cursor: pointer;
    color: #fafafa;
    mix-blend-mode: difference;
  }
  #nav-background {
    transform: translate(-8px, 0);
    border-radius: 0.25rem;
    position: fixed;
    height: 2rem;
    width: 8rem;
    background-color: #2c2c2c;
    transition:
      top 0.3s ease-out,
      width 0.3s ease-out;
  }
  .nav-item.selected,
  .nav-item:hover {
    font-weight: bold;
  }
  .hash-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    left: 2rem;
    max-height: 500px;
    overflow-y: hidden;
  }
  .hash-list:not(.hidden) {
    transition: max-height 0.7s 0.3s ease-in;
  }
  .hash-list.hidden {
    max-height: 0;
  }
  .main {
    position: absolute;
    left: 18rem;
    padding: 1rem 2rem;
    display: flex;
    justify-content: center;
  }
  .logo {
    position: fixed;
    top: 1rem;
    left: 5rem;
    height: 5.1rem;
    width: 4rem;
    background-image: url(/lit-spa.png);
    background-size: cover;
    background-repeat: no-repeat;
  }
  @media only screen and (max-width: 752px) {
    .main {
      padding: 1rem;
    }
  }
`;
