export class State<T> {
  protected value: T;
  protected listeners = new Map<number, (e: T) => any>();
  protected oneTimeListeners: ((e: T) => any)[] = [];
  protected isEqual = (a: T, b: T) => a === b;
  private nextListenerId = 0;

  constructor(isEqual?: (a: T, b: T) => boolean) {
    if (isEqual) {
      this.isEqual = isEqual;
    }
  }

  getValue(): T {
    return cloneStateValue(this.value);
  }

  subscribe(fn: (e: T) => any) {
    const id = this.nextListenerId++;
    this.listeners.set(id, fn);
    if (this.value !== undefined) fn(this.getValue());
    const unsubscribe = () => this.listeners.delete(id);
    return unsubscribe;
  }

  subscribeOnce(fn: (e: T) => any) {
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

function cloneStateValue<T>(value: T): T {
  if (value === undefined || value === null) return value;
  const type = typeof value;
  if (type !== "object") return value;
  if (typeof structuredClone !== "function") return value;
  try {
    return structuredClone(value);
  } catch {
    return value;
  }
}
