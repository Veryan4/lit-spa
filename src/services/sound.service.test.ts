import { beforeEach, describe, expect, it, vi } from "vitest";

describe("soundService", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  it("waits for the clip length in milliseconds", async () => {
    const { soundService } = await import("./sound.service");
    const play = vi.fn();
    soundService.playSound({
      src: "clip",
      duration: 1.5,
      play,
    } as unknown as HTMLAudioElement);

    vi.advanceTimersByTime(1499);
    expect(play).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(play).toHaveBeenCalledOnce();
  });
});
