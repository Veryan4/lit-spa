interface WindowOrWorkerGlobalScope {
  structuredClone(value: any, options?: StructuredSerializeOptions): any;
}
declare function structuredClone(
  value: any,
  options?: StructuredSerializeOptions,
): any;

interface SubmitEvent extends Event {
  submitter: HTMLElement;
}
