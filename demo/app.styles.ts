import { css } from "lit";

export const styles = css`
  .app {
    display: flex;
    align-items: flex-start;
    min-height: 100dvh;
  }
  .topbar {
    display: none;
  }
  .side-nav {
    position: sticky;
    top: 0;
    flex: 0 0 15.5rem;
    width: 15.5rem;
    height: 100dvh;
    box-sizing: border-box;
    overflow: auto;
    padding: 1.25rem 0.75rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    background-color: var(
      --sidebar-background,
      var(--primary-background-color)
    );
    border-right: 1px solid var(--outline-color);
  }
  .logo {
    display: block;
    width: 5.5rem;
    margin: 0 auto 0.85rem;
  }
  .logo img {
    display: block;
    width: 100%;
    height: auto;
  }
  .nav-item {
    box-sizing: border-box;
    min-height: 2rem;
    padding: 0.25rem 0.6rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    width: 100%;
    text-decoration: none;
    color: var(--primary-color);
    font-size: 0.9375rem;
    line-height: 1.3;
  }
  .nav-item:hover {
    background-color: var(--input-fill);
  }
  .nav-item[aria-current="page"] {
    background-color: var(--theme-color);
    color: #1a1a1a;
    font-weight: 700;
  }
  .nav-item:focus-visible,
  .menu-btn:focus-visible,
  .text-btn:focus-visible,
  .logo:focus-visible {
    outline: 2px solid var(--theme-very-dark);
    outline-offset: 2px;
  }
  .nav-group {
    display: none;
    flex-direction: column;
    gap: 0.1rem;
    margin: 0.15rem 0 0.45rem 0.85rem;
    padding-left: 0.65rem;
    border-left: 1px solid var(--outline-color);
  }
  .nav-group.open {
    display: flex;
  }
  .nav-item.sub {
    font-size: 0.875rem;
  }
  .menu-btn {
    font: inherit;
    font-size: 0.875rem;
    color: inherit;
    background: transparent;
    border: 1px solid var(--outline-color);
    border-radius: 0.25rem;
    padding: 0.35rem 0.7rem;
    cursor: pointer;
  }
  .menu-btn:hover {
    background: var(--input-fill);
  }
  .theme-control {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .sidebar-theme {
    justify-content: center;
    margin: 0 0 1rem;
  }
  .theme-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .text-btn {
    font: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--theme-very-dark);
    background: transparent;
    border: none;
    border-radius: 0.25rem;
    padding: 0.2rem 0.3rem;
    cursor: pointer;
  }
  .text-btn:hover {
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }
  .main {
    flex: 1;
    min-width: 0;
    max-width: 72rem;
    box-sizing: border-box;
    padding: 2rem clamp(1.25rem, 3vw, 2.5rem) 4rem;
  }
  @media only screen and (max-width: 900px) {
    .app {
      flex-direction: column;
    }
    .topbar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      position: sticky;
      top: 0;
      z-index: 2;
      box-sizing: border-box;
      width: 100%;
      padding: 0.65rem 1rem;
      background-color: var(
        --sidebar-background,
        var(--primary-background-color)
      );
      border-bottom: 1px solid var(--outline-color);
    }
    .topbar .logo {
      width: 2.5rem;
      margin: 0 auto 0 0;
    }
    .topbar .theme-control {
      margin-left: auto;
    }
    .side-nav {
      display: none;
      position: static;
      width: 100%;
      height: auto;
      flex: none;
      border-right: none;
      border-bottom: 1px solid var(--outline-color);
    }
    .side-nav.open {
      display: flex;
    }
    .side-nav .logo,
    .sidebar-theme {
      display: none;
    }
    .main {
      width: 100%;
      max-width: none;
      padding: 1.25rem 1rem 3rem;
    }
  }
`;
