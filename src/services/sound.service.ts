import { State } from "../models";

const soundState = new State<boolean>((a, b) => a === b);

const SOUND_STORAGE_KEY = "lit-spa-sound-storage";

export const soundService = {
  getSoundEnabled,
  toggleSound,
  playSound,
  soundState,
};

const timeouts: any = {};

function getSoundEnabled() {
  return localStorage.getItem(SOUND_STORAGE_KEY) ? true : false;
}

function toggleSound(): void {
  const enabled = getSoundEnabled();
  if (enabled) {
    localStorage.removeItem(SOUND_STORAGE_KEY);
    soundState.update(!enabled);
  } else {
    localStorage.setItem(SOUND_STORAGE_KEY, "on");
    soundState.update(enabled);
  }
}

function playSound(sound: HTMLAudioElement): void {
  clearTimeout(timeouts[sound.src]);
  timeouts[sound.src] = setTimeout(() => {
    sound.play();
  }, sound.duration);
}
