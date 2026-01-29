import { Toast } from "../models";

const queue: Toast[] = [];
let pending: ((toast: Toast) => void) | undefined;

function enqueue(toast: Toast) {
  if (pending) {
    const resolve = pending;
    pending = undefined;
    resolve(toast);
    return;
  }
  queue.push(toast);
}

const pop = (async function* () {
  while (true) {
    const queued = queue.shift();
    if (queued) {
      yield queued;
      continue;
    }
    yield await new Promise<Toast>((resolve) => {
      pending = resolve;
    });
  }
})();

export const toastService = { newToast, newError, customToast, pop };

function newToast(text: string, properties?: Record<string, string | number>) {
  enqueue({
    type: "success",
    duration: 3000,
    text,
    properties,
  });
}

function newError(text: string, properties?: Record<string, string | number>) {
  enqueue({
    type: "error",
    duration: 3000,
    text,
    properties,
  });
}

function customToast(toast: Toast) {
  enqueue(toast);
}
