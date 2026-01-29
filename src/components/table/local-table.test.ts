import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalTableComponent } from "./local-table";
import { TableComponent } from "./table";

describe("LocalTableComponent sorting", () => {
  it("sorts ascending without mutating the source array", () => {
    const table = new LocalTableComponent();
    const rows = [
      { name: "b", n: 2 },
      { name: "a", n: 1 },
    ];
    const sorted = table.sort([{ field: "n", direction: "ASCENDING" }], rows);
    expect(sorted.map((row) => row.n)).toEqual([1, 2]);
    expect(rows.map((row) => row.n)).toEqual([2, 1]);

    const descending = table.sort(
      [{ field: "name", direction: "DESCENDING" }],
      rows,
    );
    expect(descending.map((row) => row.name)).toEqual(["b", "a"]);
  });
});

describe("LocalTableComponent search index", () => {
  afterEach(() => {
    document.body.querySelectorAll("lit-spa-local-table").forEach((table) => {
      table.remove();
    });
    vi.useRealTimers();
  });

  function renderedIds(table: LocalTableComponent) {
    const grid = table.shadowRoot?.querySelector("#table") as TableComponent;
    return (grid?.data ?? []).map((row) => row.id);
  }

  async function mountTable(searchText?: string) {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const table = new LocalTableComponent();
    const rows = Array.from({ length: 100 }, (_, index) => ({
      id: String(index),
      name: index === 0 || index === 80 ? "alpha widget" : `other ${index}`,
    }));
    document.body.append(table);
    table.dataIdField = "id";
    table.columns = [{ field: "name", name: "Name", isSearchable: true }];
    table.data = rows;
    if (searchText) table.searchText = searchText;
    await table.updateComplete;
    return table;
  }

  it("keeps a single timeout queued and grows an in-progress search", async () => {
    const table = await mountTable();
    expect(vi.getTimerCount()).toBe(1);

    await vi.runOnlyPendingTimersAsync();
    await table.updateComplete;
    expect(vi.getTimerCount()).toBe(1);

    table.searchText = "alpha";
    await table.updateComplete;
    expect(renderedIds(table)).toEqual(["0"]);
    expect(table.search("alpha").map((row) => row.id)).toEqual(["0"]);

    let batches = 1;
    while (vi.getTimerCount() > 0) {
      expect(vi.getTimerCount()).toBe(1);
      await vi.runOnlyPendingTimersAsync();
      await table.updateComplete;
      batches += 1;
    }

    expect(batches).toBeGreaterThan(1);
    expect(batches).toBeLessThan(100);
    expect(renderedIds(table)).toEqual(["0", "80"]);
    expect(table.search("alpha").map((row) => row.id)).toEqual(["0", "80"]);
  });

  it("adds matches while indexing when the search is already active", async () => {
    const table = await mountTable("alpha");
    expect(renderedIds(table)).toEqual([]);

    await vi.runOnlyPendingTimersAsync();
    await table.updateComplete;
    expect(renderedIds(table)).toEqual(["0"]);

    while (vi.getTimerCount() > 0) {
      await vi.runOnlyPendingTimersAsync();
      await table.updateComplete;
    }
    expect(renderedIds(table)).toEqual(["0", "80"]);
  });

  it("intersects AND terms and unions OR terms from the index", async () => {
    const table = await mountTable("alpha widget");
    while (vi.getTimerCount() > 0) {
      await vi.runOnlyPendingTimersAsync();
      await table.updateComplete;
    }
    expect(table.search("alpha widget").map((row) => row.id)).toEqual([
      "0",
      "80",
    ]);
    expect(table.search("alpha missing")).toEqual([]);

    table.searchOperator = "OR";
    await table.updateComplete;
    expect(table.search("alpha missing").map((row) => row.id)).toEqual([
      "0",
      "80",
    ]);
    expect(table.search("al")).toHaveLength(100);
  });

  it("drops a stale index when the data is replaced", async () => {
    const table = await mountTable("alpha");
    await vi.runOnlyPendingTimersAsync();
    await table.updateComplete;
    expect(renderedIds(table)).toEqual(["0"]);

    table.data = [{ id: "new", name: "alpha widget" }];
    await table.updateComplete;
    expect(renderedIds(table)).toEqual([]);

    while (vi.getTimerCount() > 0) {
      await vi.runOnlyPendingTimersAsync();
      await table.updateComplete;
    }
    expect(renderedIds(table)).toEqual(["new"]);
    expect(table.search("other")).toEqual([]);
  });
});
