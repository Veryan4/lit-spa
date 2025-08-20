import { ReactiveControllerHost } from "lit";
import { soundService } from "../services";

export class SoundController {
  private host: ReactiveControllerHost;
  private unsubscribe?: () => boolean;
  value = soundService.getSoundEnabled();
  soundPlaying = false;

  _changeSound = (enabled: boolean) => {
    this.value = enabled;
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
    this.unsubscribe = soundService.soundState.subscribe(this._changeSound);
  }

  hostDisconnected(): void {
    this.unsubscribe?.();
  }
}
