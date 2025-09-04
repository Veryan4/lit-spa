export class State<T> {
  protected value: T;
  protected listeners = new Map<number, (e: T) => any>();
  protected oneTimeListeners: ((e: T) => any)[] = [];
  protected isEqual = (a: T, b: T) => a === b;

  constructor(isEqual?: (a: T, b: T) => boolean) {
    if (isEqual) {
      this.isEqual = isEqual;
    }
  }

  getValue(): T {
    return structuredClone(this.value);
  }

  subscribe(fn: (e: T) => any) {
    let time = performance.now();
    if (this.listeners.has(time)) {
      time = this.incrementTime(time);
    }
    this.listeners.set(time, fn);
    if (this.value !== undefined) fn(this.getValue());
    const unsubscribe = () => this.listeners.delete(time);
    return unsubscribe;
  }

  subscribeOnce(fn: (e: T) => any) {
    if (this.value !== undefined) {
      fn(this.value);
      return;
    }
    this.oneTimeListeners.push(fn);
  }

  emit() {
    this.listeners.forEach((fn) => fn(this.getValue()));
    this.oneTimeListeners.map((fn) => fn(this.getValue()));
    this.oneTimeListeners = [];
  }

  update(value: T) {
    if (this.isEqual && this.isEqual(this.value, value)) return;
    this.value = value;
    this.emit();
  }

  private incrementTime(time: number): number {
    time += 10000;
    if (this.listeners.has(time)) {
      return this.incrementTime(time);
    }
    return time;
  }
}
