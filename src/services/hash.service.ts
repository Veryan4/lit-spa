import { State } from "../models";

const state = new State<string>();

export const hashService = {
  updateHash,
  state,
};

function updateHash(hash: string, copy = false) {
  const url = new URL(window.location.href);
  url.hash = hash;
  const next = `${url.pathname}${url.search}${url.hash}`;
  if (copy) {
    void navigator.clipboard?.writeText(url.toString()).catch(() => undefined);
  }
  window.history.pushState({}, "", next);
  state.update(hash);
}
