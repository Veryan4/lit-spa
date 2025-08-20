export class State<T> {
  private value: T;
  private listeners = new Map<number, (e: T) => any>();
  private oneTimeListeners: ((e: T) => any)[] = [];
  private isEqual?: (a: T, b: T) => boolean;
  private skipClone?: boolean;

  constructor(isEqual?: (a: T, b: T) => boolean, skipClone?: boolean) {
    this.isEqual = isEqual;
    this.skipClone = skipClone;
  }

  getValue(): T {
    if (this.skipClone) return this.value;
    return structuredClone(this.value);
  }

  subscribe(fn: (e: T) => any) {
    const time = Date.now();
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
}
