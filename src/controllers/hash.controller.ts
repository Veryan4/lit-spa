import { LitElement } from "lit";
import { hashService } from "../services";

export class HashController {
  private host: LitElement;
  private unsubscribe?: () => boolean;

  scrollToHash = (hash?: string, isSmooth?: boolean) => {
    if (!hash) {
      window.scrollTo({
        top: this.host.scrollTop,
        behavior: isSmooth ? "smooth" : "instant",
      });
      return;
    }
    const element = this.host.shadowRoot?.querySelector("#" + hash);
    const documentTop = document.documentElement.getBoundingClientRect().top;
    const elementTop = element?.getBoundingClientRect()?.top ?? 0;
    const top = elementTop - documentTop;
    window.scrollTo({
      top,
      behavior: isSmooth ? "smooth" : "instant",
    });
  };

  constructor(host: LitElement) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    setTimeout(() => this.scrollToHash(location.hash?.replace("#", ""))); // add hash from url
    this.unsubscribe = hashService.state.subscribe((hash) =>
      this.scrollToHash(hash, true),
    );
  }

  hostDisconnected() {
    this.unsubscribe?.();
  }
}
