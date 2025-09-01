import { State } from "../models";

const state = new State<string>();

export const hashService = {
  updateHash,
  state,
};

function updateHash(hash: string) {
  const url = location.origin + location.pathname + "#" + hash;
  navigator.clipboard.writeText(url);
  window.history.pushState({}, "", url);
  state.update(hash);
}
