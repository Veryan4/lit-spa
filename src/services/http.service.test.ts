import { beforeEach, describe, expect, it, vi } from "vitest";

function mockResponse(
  body: string,
  status = 200,
  contentType = "application/json",
) {
  const response = {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "content-type" ? contentType : null,
    },
    text: async () => body,
    clone() {
      return mockResponse(body, status, contentType);
    },
  };
  return response;
}

async function loadHttp() {
  return import("./http.service");
}

describe("httpService", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });

  it("caches successful GET requests and skips failed ones", async () => {
    const { httpService } = await loadHttp();
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(mockResponse("nope", 500) as Response)
      .mockResolvedValue(mockResponse(JSON.stringify({ ok: true })) as Response);

    await expect(httpService.get("/items")).rejects.toThrow("nope");
    await expect(httpService.get("/items")).resolves.toEqual({ ok: true });
    await expect(httpService.get("/items")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not cache POST and sends FormData without a content type", async () => {
    const { httpService } = await loadHttp();
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      mockResponse(JSON.stringify({ ok: true })) as Response,
    );
    const form = new FormData();
    form.append("file", new Blob(["hello"]), "hello.txt");

    await httpService.post("/upload", form);
    await httpService.post("/upload", form);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.body).toBe(form);
    expect(init.headers).toMatchObject({ Accept: "application/json" });
    expect(init.headers).not.toHaveProperty("Content-Type");
  });

  it("returns undefined for an empty body", async () => {
    const { httpService } = await loadHttp();
    vi.mocked(fetch).mockResolvedValue(mockResponse("", 204, "") as Response);
    await expect(httpService.del("/items/1")).resolves.toBeUndefined();
  });
});
