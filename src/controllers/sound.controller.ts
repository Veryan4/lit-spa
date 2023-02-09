import { ReactiveControllerHost } from "lit";
import { soundService } from "../services";

const SOUND_STORAGE_KEY = "lit-spa-sound-storage";

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
    if (this.value) {
      soundService.playSound(sound);
    }
  }

  hostConnected(): void {
    window.addEventListener(
      soundService.SOUND_EVENT_KEY,
      this._changeSound as EventListener
    );
  }

  hostDisconnected(): void {
    window.removeEventListener(
      soundService.SOUND_EVENT_KEY,
      this._changeSound as EventListener
    );
  }
}
