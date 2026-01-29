import { beforeEach, describe, expect, it, vi } from "vitest";

const component = () => Promise.resolve(undefined as never);

async function loadRouter() {
  const { routerService } = await import("./router.service");
  const { hashService } = await import("./hash.service");
  return { routerService, hashService };
}

describe("routerService", () => {
  beforeEach(() => {
    vi.resetModules();
    window.history.replaceState({}, "", "/");
  });

  it("matches a route on segment boundaries", async () => {
    const { routerService } = await loadRouter();
    const names: string[] = [];
    routerService.registerRoutes([
      { name: "home", pattern: ["", "home"], component },
      { name: "missing", pattern: "*", component },
    ]);
    routerService.routerStateMap
      .get("root")!
      .subscribe((route) => names.push(route.name));

    routerService.navigate("/home");
    routerService.navigate("/homepage");
    routerService.navigate("/home/extra");
    routerService.navigate("/");

    expect(names).toEqual(["home", "missing", "missing", "home"]);
  });

  it("reads path params from the matching pattern", async () => {
    const { routerService } = await loadRouter();
    expect(routerService.parsePathParams("users/:id", "/users/42")).toEqual({
      id: "42",
    });
    expect(
      routerService.parsePathParams(
        ["users/:id", "users/:id/posts"],
        "/users/42/posts",
      ),
    ).toEqual({ id: "42" });
  });

  it("parses query strings without interpreting JSON", async () => {
    const { routerService } = await loadRouter();
    expect(routerService.parseQueryString('?a=1","admin":"true')).toEqual({
      a: '1","admin":"true',
    });
    expect(routerService.parseQueryString("?q=hello%20world")).toEqual({
      q: "hello world",
    });
  });

  it("keeps the hash when the href also has a query", async () => {
    const { routerService, hashService } = await loadRouter();
    const hashes: string[] = [];
    hashService.state.subscribe((hash) => hashes.push(hash));
    routerService.registerRoutes([
      { name: "page", pattern: "page", component },
    ]);
    routerService.navigate("/page?tab=1#section");
    expect(window.location.pathname).toBe("/page");
    expect(window.location.search).toBe("?tab=1");
    expect(window.location.hash).toBe("#section");
    expect(hashes.at(-1)).toBe("section");
  });

  it("ignores a guard that resolves after a newer navigation", async () => {
    const { routerService } = await loadRouter();
    let release: (() => void) | undefined;
    const names: string[] = [];
    routerService.registerRoutes([
      {
        name: "slow",
        pattern: "slow",
        component,
        guard: () =>
          new Promise((resolve) => {
            release = () => resolve(undefined);
          }),
      },
      { name: "fast", pattern: "fast", component },
    ]);
    routerService.routerStateMap
      .get("root")!
      .subscribe((route) => names.push(route.name));

    routerService.navigate("/slow");
    routerService.navigate("/fast");
    release?.();
    await Promise.resolve();

    expect(names).toEqual(["fast"]);
  });

  it("registers sibling child routers and matches the remainder", async () => {
    const { routerService } = await loadRouter();
    routerService.registerRoutes([
      { name: "parent", pattern: ["parent", "parent/*"], component },
    ]);
    window.history.pushState({}, "", "/parent/b");
    const firstId = routerService.registerRoutes([
      { name: "a", pattern: "a", component },
    ]);
    const secondId = routerService.registerRoutes([
      { name: "b", pattern: "b", component },
    ]);
    expect(firstId).not.toBe("root");
    expect(secondId).not.toBe(firstId);

    routerService.refresh();
    let active = "";
    routerService.routerStateMap.get(secondId)!.subscribe((route) => {
      active = route.name;
    });
    expect(active).toBe("b");

    routerService.navigate("/parent/a");
    let firstActive = "";
    routerService.routerStateMap.get(firstId)!.subscribe((route) => {
      firstActive = route.name;
    });
    expect(firstActive).toBe("a");
  });

  it("redirects a rejected guard to the route path", async () => {
    const { routerService } = await loadRouter();
    const names: string[] = [];
    routerService.registerRoutes([
      {
        name: "private",
        pattern: "private",
        component,
        guard: () => Promise.reject("login"),
      },
      { name: "login", pattern: "login", component },
    ]);
    routerService.routerStateMap
      .get("root")!
      .subscribe((route) => names.push(route.name));
    routerService.navigate("/private");
    await Promise.resolve();
    await Promise.resolve();
    expect(window.location.pathname).toBe("/login");
    expect(names.at(-1)).toBe("login");
  });
});
