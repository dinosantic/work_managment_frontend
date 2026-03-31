type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export type CurrentUser = {
  id: number;
  email: string;
  role: string;
  displayName: string;
};

type ApiErrorPayload = {
  message?: string;
  details?: Array<{ field?: string; message?: string }>;
};

export class ApiError extends Error {
  status: number;
  details?: ApiErrorPayload["details"];

  constructor(message: string, status: number, details?: ApiErrorPayload["details"]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(
  apiUrl: string,
  path: string,
  options: RequestOptions = {},
) {
  const { method = "GET", body, token } = options;

  const res = await fetch(`${apiUrl}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = (await res.json().catch(() => null)) as T | ApiErrorPayload | null;

  if (!res.ok) {
    throw new ApiError(
      (data as ApiErrorPayload | null)?.message || "Request failed",
      res.status,
      (data as ApiErrorPayload | null)?.details,
    );
  }

  return data as T;
}

export async function getCurrentUser(apiUrl: string, token: string) {
  const data = await apiRequest<{ user: CurrentUser }>(apiUrl, "/users/me", {
    token,
  });

  return data.user;
}
