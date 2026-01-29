import { describe, expect, it } from "vitest";
import { State } from "./state.model";

describe("State", () => {
  it("returns undefined before the first update", () => {
    const state = new State<string>();
    expect(state.getValue()).toBeUndefined();
    const seen: string[] = [];
    state.subscribe((value) => seen.push(value));
    expect(seen).toEqual([]);
  });

  it("clones plain objects and keeps functions when cloning fails", () => {
    const state = new State<{ n: number }>();
    state.update({ n: 1 });
    const copy = state.getValue();
    copy.n = 2;
    expect(state.getValue()).toEqual({ n: 1 });

    const fn = () => "ok";
    const functions = new State<() => string>();
    expect(() => functions.update(fn)).not.toThrow();
    expect(functions.getValue()()).toBe("ok");
  });
});
