const SOUND_EVENT_KEY = "lit-spa-sound-event";

export const soundService = { toggleSound, playSound, SOUND_EVENT_KEY };

const timeouts: any = {};

function toggleSound(): void {
  window.dispatchEvent(new CustomEvent(SOUND_EVENT_KEY));
}

function playSound(sound: HTMLAudioElement): void {
  clearTimeout(timeouts[sound.src]);
  timeouts[sound.src] = setTimeout(() => {
    sound.play();
  }, sound.duration);
}
