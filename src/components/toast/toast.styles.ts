import { css } from "lit";

export const styles = css`
  .toast-container {
    position: fixed;
    bottom: 10rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 10000;
    font-family: var(
      --toast-font-family,
      var(--font-family, "Roboto Sans", sans-serif)
    );
  }

  .toast {
    position: relative;
    margin-bottom: 0.5rem;
    transition: all 1s ease-out;
    transform: translateY(var(--toast-offset, 100px));
  }

  .toast-wrap {
    padding: 1rem;
    background: var(--toast-background, #313131);
    color: var(--toast-color, #fff);
    border-radius: var(--toast-border-radius, 0.5rem);
  }

  .toast.error .toast-wrap {
    background: var(--toast-error-background, crimson);
    color: var(--toast-error-color, #fff);
  }
`;
