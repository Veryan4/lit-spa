import { ReactiveControllerHost } from "lit";

export class DeviceController {
  private host: ReactiveControllerHost;
  private widthRefresh?: ReturnType<typeof setTimeout>;
  width = window.innerWidth;
  isNarrow = window.innerWidth < 760;
  isMobile = this.isDeviceMobile();

  _checkWidth = () => {
    const throttle = 100;
    if (
      this.width < window.innerWidth - throttle ||
      this.width > window.innerWidth + throttle
    ) {
      this.width = window.innerWidth;
      this.isNarrow = window.innerWidth < 760;
      this.host.requestUpdate();
    }
  };

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
    this.widthRefresh = setTimeout(() => host.requestUpdate(), 300);
  }

  hostConnected() {
    window.addEventListener("resize", this._checkWidth);
  }

  hostDisconnected() {
    clearTimeout(this.widthRefresh);
    window.removeEventListener("resize", this._checkWidth);
  }

  isDeviceMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
      navigator.userAgent,
    );
  }
}
