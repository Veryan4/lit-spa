import { ReactiveControllerHost } from "lit";

const SOUND_STORAGE_KEY = "lit-spa-sound-storage";
const SOUND_EVENT_KEY = "lit-spa-sound-event";

export class SoundController {
  private host: ReactiveControllerHost;
  value = localStorage.getItem(SOUND_STORAGE_KEY) ? true : false;
  soundPlaying = false;

  _changeSound = (e: CustomEvent) => {
    if (this.value) {
      this.value = false;
      localStorage.removeItem(SOUND_STORAGE_KEY);
    } else {
      this.value = true;
      localStorage.setItem(SOUND_STORAGE_KEY, "on");
    }
    this.host.requestUpdate();
  };

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  play(sound: HTMLAudioElement): void {
    if (!this.soundPlaying && this.value) {
      this.soundPlaying = true;
      sound.play().then(() => (this.soundPlaying = false));
    }
  }

  hostConnected(): void {
    window.addEventListener(
      SOUND_EVENT_KEY,
      this._changeSound as EventListener
    );
  }

  hostDisconnected(): void {
    window.removeEventListener(
      SOUND_EVENT_KEY,
      this._changeSound as EventListener
    );
  }
}
