import api, {
  ApiError,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/api/axios";
import type { AxiosRequestConfig, Method } from "axios";

type RequestOptions = {
  method?: Method;
  body?: unknown;
  config?: AxiosRequestConfig;
};

export { ApiError, clearStoredToken, getStoredToken, setStoredToken };

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const { method = "GET", body, config } = options;

  const response = await api.request<T>({
    url: path,
    method,
    data: body,
    ...config,
  });

  return response.data;
}
