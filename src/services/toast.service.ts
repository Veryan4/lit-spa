import { State, Toast } from "../models";

const toastState = new State<Toast>();

const pop = (async function* () {
  let toast: Toast;
  let resolve: (v: any) => void;
  let promise = new Promise((r) => (resolve = r));
  // figure out when to unsubscribe
  toastState.subscribe((t) => {
    toast = t;
    resolve(t);
    promise = new Promise((r) => (resolve = r));
  });
  while (true) {
    await promise;
    yield toast!;
  }
})();

export const toastService = { newToast, newError, customToast, pop };

function newToast(text: string, properties?: Record<string, string | number>) {
  const toast: Toast = {
    type: "success",
    duration: 3000,
    text,
    properties,
  };
  toastState.update(toast);
}

function newError(text: string, properties?: Record<string, string | number>) {
  const toast: Toast = {
    type: "error",
    duration: 3000,
    text,
    properties,
  };
  toastState.update(toast);
}

function customToast(toast: Toast) {
  toastState.update(toast);
}
