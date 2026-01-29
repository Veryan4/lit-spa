const AUTH_TOKEN_KEY = "lit-spa-auth-token";
const TIME_CACHED_IN_MINUTES = 5;
const cache = new Map<string, { expires: Date; value: Promise<Response> }>();

export const httpService = {
  get,
  put,
  post,
  patch,
  del,
  removeAuthToken,
  setAuthToken,
  getAuthToken,
  createHeaders,
  createBody,
  baseHttp,
  cachedHttp,
  cleanCache,
};

function baseHttp<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  return fetch(url, options).then((response) => handleFetchResponse(response));
}

function get<T>(url: string, bustCache = false): Promise<T> {
  return httpService.cachedHttp(
    url,
    {
      method: "GET",
      headers: httpService.createHeaders(),
    },
    bustCache,
  ).then((response) => handleFetchResponse(response));
}

function put<T>(
  url: string,
  data: unknown | FormData,
): Promise<T> {
  const isFormData = data instanceof FormData;
  return httpService.baseHttp(url, {
    method: "PUT",
    headers: httpService.createHeaders(isFormData),
    body: httpService.createBody(data, isFormData),
  });
}

function post<T>(
  url: string,
  data: unknown | FormData,
): Promise<T> {
  const isFormData = data instanceof FormData;
  return httpService.baseHttp(url, {
    method: "POST",
    headers: httpService.createHeaders(isFormData),
    body: httpService.createBody(data, isFormData),
  });
}

function patch<T>(
  url: string,
  data: unknown | FormData,
): Promise<T> {
  const isFormData = data instanceof FormData;
  return httpService.baseHttp(url, {
    method: "PATCH",
    headers: httpService.createHeaders(isFormData),
    body: httpService.createBody(data, isFormData),
  });
}

function del<T>(url: string): Promise<T> {
  return httpService.baseHttp(url, {
    method: "DELETE",
    headers: httpService.createHeaders(),
  });
}

function createHeaders(isFormData?: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (!isFormData) headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function createBody(data: unknown, isFormData: boolean): BodyInit {
  if (isFormData) return data as FormData;
  return JSON.stringify(data);
}

function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function setAuthToken(token: string): void {
  if (!token) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function cachedHttp(
  url: string,
  options?: RequestInit,
  bustCache = false,
): Promise<Response> {
  cleanCache();
  const cacheKey = cacheKeyFor(url, options);
  const item = cache.get(cacheKey);
  if (item && new Date() < item.expires && !bustCache) {
    return item.value.then((response) => response.clone());
  }
  const call = fetch(url, options).then(
    (response) => {
      if (!response.ok) cache.delete(cacheKey);
      return response;
    },
    (error: unknown) => {
      cache.delete(cacheKey);
      throw error;
    },
  );
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + TIME_CACHED_IN_MINUTES);
  cache.set(cacheKey, { expires, value: call });
  return call.then((response) => response.clone());
}

function cleanCache() {
  const now = new Date();
  cache.forEach((value, key) => {
    if (value.expires < now) cache.delete(key);
  });
}

function cacheKeyFor(url: string, options?: RequestInit): string {
  const method = (options?.method ?? "GET").toUpperCase();
  const headers = options?.headers ?? {};
  return JSON.stringify({ url, method, headers });
}

async function readBody<T>(response: Response): Promise<T> {
  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }
  const text = await response.text();
  if (!text) return undefined as T;
  const contentType = response.headers.get("content-type") ?? "";
  if (
    contentType.includes("application/json") ||
    contentType.includes("+json")
  ) {
    return JSON.parse(text) as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

async function handleFetchResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(body || response.statusText);
  }
  return readBody<T>(response);
}