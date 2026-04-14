import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

type ApiErrorPayload = {
  message?: string;
  details?: Array<{ field?: string; message?: string }>;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const TOKEN_STORAGE_KEY = "token";

export class ApiError extends Error {
  status: number;
  details?: ApiErrorPayload["details"];

  constructor(
    message: string,
    status: number,
    details?: ApiErrorPayload["details"],
  ) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function normalizeApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as ApiErrorPayload | undefined;

    return new ApiError(
      responseData?.message ?? error.message ?? "Request failed",
      error.response?.status ?? 500,
      responseData?.details,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError("An unknown request error occurred.", 500);
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (isFormData) {
      config.headers.delete("Content-Type");
    } else if (!config.headers.has("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }

    return config;
  },
  (error) => Promise.reject(normalizeApiError(error)),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) =>
    Promise.reject(normalizeApiError(error)),
);

export default api;
