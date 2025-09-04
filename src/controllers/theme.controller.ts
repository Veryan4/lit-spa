import { ReactiveControllerHost } from "lit";
import { themeService } from "../services";

export class ThemeController {
  private host: ReactiveControllerHost;
  private unsubscribe?: () => boolean;
  value = themeService.getTheme();

  _changeTheme = (theme: string) => {
    this.value = theme;
    this.host.requestUpdate();
  };

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    this.unsubscribe = themeService.state.subscribe((t) =>
      this._changeTheme(t),
    );
  }

  hostDisconnected() {
    this.unsubscribe?.();
  }
}
