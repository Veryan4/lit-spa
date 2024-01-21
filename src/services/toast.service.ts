import { Toast } from "../models/toast.model";

const TOAST_EVENT = "lit-spa-toast";

const pop = (async function* () {
  let toast: Toast;
  let resolve: (v: any) => void;
  let promise = new Promise((r) => (resolve = r));
  window.addEventListener(TOAST_EVENT, (e: any) => {
    toast = e.detail;
    resolve(e);
    promise = new Promise((r) => (resolve = r));
  });
  while (true) {
    await promise;
    yield toast!;
  }
})();

export const toastService = { newToast, newError, customToast, pop, TOAST_EVENT };

function newToast(text: string, properties?: Record<string, string | number>) {
  const toast: Toast = {
    type: "success",
    duration: 3000,
    text,
    properties,
  };
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: toast,
    })
  );
}

function newError(text: string, properties?: Record<string, string | number>) {
  const toast: Toast = {
    type: "error",
    duration: 3000,
    text,
    properties,
  };
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: toast,
    })
  );
}

function customToast(toast: Toast) {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: toast,
    })
  );
}
