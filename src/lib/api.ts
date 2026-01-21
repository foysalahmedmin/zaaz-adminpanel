import { ENV } from "@/config";
import { refreshToken } from "@/services/auth.service";
import type { TUserState } from "@/types/state.type";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

let isRefreshing = false;

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

const api: AxiosInstance = axios.create({
  baseURL: ENV.api_url,
});

// ✅ Request Interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userString = localStorage.getItem("user");
  let user: TUserState | null = null;

  try {
    user = userString ? (JSON.parse(userString) as TUserState) : null;
  } catch (error) {
    console.error("Error parsing user token", error);
  }

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// ✅ Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError): Promise<AxiosResponse | never> => {
    if (error.response?.status === 403) {
      console.warn("403 Forbidden: Logging out...");
      localStorage.removeItem("user");
      window.location.href = "/auth/signin";
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (originalRequest.url === "/api/auth/refresh-token") {
      console.warn("Refresh token request failed. Logging out...");
      localStorage.removeItem("user");
      window.location.href = "/auth/signin";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("401 Unauthorized: Attempting to refresh token...");
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await refreshToken();

        if (!data?.token) {
          throw new Error("No new token returned");
        }

        console.log("Token refreshed successfully.");
        localStorage.setItem(
          "user",
          JSON.stringify({ is_authenticated: true, ...data }),
        );

        api.defaults.headers.Authorization = `Bearer ${data?.token}`;
        processQueue(null, `${data?.token}`);

        return api(originalRequest);
      } catch (error: unknown) {
        console.error("Token refresh failed. Logging out...", error);
        processQueue(error, null);
        localStorage.removeItem("user");
        window.location.href = "/auth/signin";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
