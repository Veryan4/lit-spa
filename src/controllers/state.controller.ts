import { ReactiveControllerHost } from "lit";
import { State } from "../models";

export class StateController<T> {
  private host: ReactiveControllerHost;
  private unsubscribe?: () => boolean;
  private state: State<T>;
  value: T;

  constructor(host: ReactiveControllerHost, state: State<T>) {
    this.host = host;
    this.state = state;
    this.value = state.getValue();
    host.addController(this);
  }

  hostConnected(): void {
    this.unsubscribe = this.state.subscribe((s) => {
      console.log(s);
      this.value = s;
      this.host.requestUpdate();
    });
  }

  hostDisconnected(): void {
    this.unsubscribe?.();
  }

  update(value: T) {
    this.state.update(value);
  }
}
