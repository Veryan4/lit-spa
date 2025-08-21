import { State } from "../models";

const state = new State<boolean>();

const SOUND_STORAGE_KEY = "lit-spa-sound-storage";

export const soundService = {
  getSoundEnabled,
  toggleSound,
  playSound,
  state,
};

const timeouts: any = {};

function getSoundEnabled() {
  return localStorage.getItem(SOUND_STORAGE_KEY) ? true : false;
}

function toggleSound(): void {
  const enabled = getSoundEnabled();
  if (enabled) {
    localStorage.removeItem(SOUND_STORAGE_KEY);
    state.update(!enabled);
  } else {
    localStorage.setItem(SOUND_STORAGE_KEY, "on");
    state.update(enabled);
  }
}

function playSound(sound: HTMLAudioElement): void {
  clearTimeout(timeouts[sound.src]);
  timeouts[sound.src] = setTimeout(() => {
    sound.play();
  }, sound.duration);
}
