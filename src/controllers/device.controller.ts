import { ReactiveControllerHost } from "lit";

export class DeviceController {
  private host: ReactiveControllerHost;
  width = window.innerWidth;
  isNarrow = window.innerWidth < 760;
  isMobile = this.isDeviceMobile();

  _checkWidth = (e: Event) => {
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

    // re-renders the child web components
    setTimeout(() => host.requestUpdate(), 300);
  }

  hostConnected() {
    window.addEventListener("resize", this._checkWidth as EventListener);
  }

  hostDisconnected() {
    window.removeEventListener("resize", this._checkWidth as EventListener);
  }

  isDeviceMobile() {
    return (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    );
  }
}
