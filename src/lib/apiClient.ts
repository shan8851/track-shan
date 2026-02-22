const BASE_URL = "/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number>;
};

const buildUrl = (path: string, params?: Record<string, string | number>): string => {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = "GET", body, params } = options;
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = (await response.json()) as { error?: string };
    throw new Error(error.error ?? `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const apiClient = {
  get: <T>(path: string, params?: Record<string, string | number>) =>
    request<T>(path, { params }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};
