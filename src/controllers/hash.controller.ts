import { LitElement } from "lit";
import { hashService } from "../services";

export class HashController {
  private host: LitElement;
  private unsubscribe?: () => boolean;
  private pendingScroll?: ReturnType<typeof setTimeout>;

  scrollToHash = (hash?: string, isSmooth?: boolean) => {
    const behavior: ScrollBehavior = isSmooth ? "smooth" : "auto";
    if (!hash) {
      window.scrollTo({
        top: this.host.scrollTop,
        behavior,
      });
      return;
    }
    const escaped =
      typeof CSS !== "undefined" && CSS.escape ? CSS.escape(hash) : hash;
    const element = this.host.shadowRoot?.querySelector("#" + escaped);
    const documentTop = document.documentElement.getBoundingClientRect().top;
    const elementTop = element?.getBoundingClientRect()?.top ?? 0;
    const top = elementTop - documentTop;
    window.scrollTo({
      top,
      behavior,
    });
  };

  constructor(host: LitElement) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    this.pendingScroll = setTimeout(() =>
      this.scrollToHash(location.hash?.replace("#", "")),
    );
    this.unsubscribe = hashService.state.subscribe((hash) =>
      this.scrollToHash(hash, true),
    );
  }

  hostDisconnected() {
    clearTimeout(this.pendingScroll);
    this.unsubscribe?.();
  }
}
