import { beforeEach, describe, expect, it, vi } from "vitest";

describe("toastService", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("yields every toast, including ones fired while another is queued", async () => {
    const { toastService } = await import("./toast.service");
    toastService.newToast("one");
    toastService.newError("two");
    const first = await toastService.pop.next();
    const second = await toastService.pop.next();
    expect(first.value).toMatchObject({ text: "one", type: "success" });
    expect(second.value).toMatchObject({ text: "two", type: "error" });
  });
});
