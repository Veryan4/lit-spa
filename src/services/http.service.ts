const AUTH_TOKEN_KEY = "lit-spa-auth-token";

import { routerService } from "./router.service";

export const httpService = {
  get,
  put,
  post,
  patch,
  del,
  removeAuthToken,
  setAuthToken,
  getAuthToken,
};

function baseHttp<T>(url: string, options?: RequestInit): Promise<T> {
  return fetch(url, options).then((response) => {
    if (response.status == 401 || response.status == 403) {
      removeAuthToken();
      routerService.navigate("/login");
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

function get<T>(url: string): Promise<T> {
  return baseHttp(url, {
    method: "GET",
    headers: createHeaders(),
  });
}

function put<T>(url: string, data: any | FormData): Promise<T> {
  const isFormData = data instanceof FormData;
  return baseHttp(url, {
    method: "PUT",
    headers: createHeaders(isFormData),
    body: createBody(data, isFormData),
  });
}

function post<T>(url: string, data: any): Promise<T> {
  const isFormData = data instanceof FormData;
  return baseHttp(url, {
    method: "POST",
    headers: createHeaders(isFormData),
    body: createBody(data, isFormData),
  });
}

function patch<T>(url: string, data: any | FormData): Promise<T> {
  const isFormData = data instanceof FormData;
  return baseHttp(url, {
    method: "PATCH",
    headers: createHeaders(isFormData),
    body: createBody(data, isFormData),
  });
}

function del<T>(url: string): Promise<T> {
  return baseHttp(url, {
    method: "DELETE",
    headers: createHeaders(),
  });
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
