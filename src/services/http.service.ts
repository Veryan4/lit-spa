const AUTH_TOKEN_KEY = "lit-spa-auth-token";
const TIME_CACHED_IN_MINUTES = 5;
const cache = new Map<string, { expires: Date, value: Promise<Response> }>();

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
  cleanCache
};

setInterval(() => httpService.cleanCache(), TIME_CACHED_IN_MINUTES * 1000 * 60);

function baseHttp<T>(url: string, options?: RequestInit, bustCache = false): Promise<T> {
  return httpService.cachedHttp(url, options, bustCache).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

function get<T>(url: string, bustCache = false): Promise<T> {
  return httpService.baseHttp(url, {
    method: "GET",
    headers: httpService.createHeaders(),
  }, bustCache);
}

function put<T>(url: string, data: any | FormData, bustCache = false): Promise<T> {
  const isFormData = data instanceof FormData;
  return httpService.baseHttp(url, {
    method: "PUT",
    headers: httpService.createHeaders(isFormData),
    body: httpService.createBody(data, isFormData),
  }, bustCache);
}

function post<T>(url: string, data: any, bustCache = false): Promise<T> {
  const isFormData = data instanceof FormData;
  return httpService.baseHttp(url, {
    method: "POST",
    headers: httpService.createHeaders(isFormData),
    body: httpService.createBody(data, isFormData),
  }, bustCache);
}

function patch<T>(url: string, data: any | FormData, bustCache = false): Promise<T> {
  const isFormData = data instanceof FormData;
  return httpService.baseHttp(url, {
    method: "PATCH",
    headers: httpService.createHeaders(isFormData),
    body: httpService.createBody(data, isFormData),
  }, bustCache);
}

function del<T>(url: string, bustCache = false): Promise<T> {
  return httpService.baseHttp(url, {
    method: "DELETE",
    headers: httpService.createHeaders(),
  }, bustCache);
}

function createHeaders(isFormData?: boolean) {
  const headers: any = {
    Accept: "application/json",
    "Content-Type": isFormData
      ? "application/x-www-form-urlencoded"
      : "application/json",
  };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function createBody(data: any, isFormData: boolean) {
  return isFormData ? new URLSearchParams(data as any) : JSON.stringify(data);
}

function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function setAuthToken(token: string): void {
  if (!token) {
    return;
  }
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function cachedHttp(url: string, options?: RequestInit, bustCache = false): Promise<Response> {
  const cacheKey = JSON.stringify({url, options});
  const item = cache.get(cacheKey);
  let call = item && new Date() < item.expires ? item.value : false;
  if (!call || bustCache) {
    call = fetch(url, options);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + TIME_CACHED_IN_MINUTES);
    cache.set(cacheKey, {expires, value: call});
  }
  return call.then(r => r.clone());
}

function cleanCache() {
  const now = new Date();
  cache.forEach((value, key) => {
    if(value.expires < now){
      cache.delete(key);
    }
  });
}
