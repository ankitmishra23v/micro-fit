import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Storage from "../utilities/storage";
import { router } from "expo-router";

const TIMEOUT = 3600000;
const CONTENT_TYPE_JSON = "application/json";
const REFRESH_TOKEN_URL = `${process.env.EXPO_PUBLIC_REACT_NATIVE_APP_API_BASE_URL}users/refresh-token`;

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_REACT_NATIVE_APP_API_BASE_URL,
  timeout: TIMEOUT,
  headers: { "Content-Type": CONTENT_TYPE_JSON },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const handleTokenRefreshError = async () => {
  console.error("Refresh token expired or invalid. Logging out...");
  await Storage.clear();
  router.push("/screens/welcome"); // Navigate to the login screen
};

// Attach request interceptor
api.interceptors.request.use(
  async (config: any) => {
    if (!config.headers.Authorization) {
      const token = await Storage.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Attach response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await Storage.getRefreshToken();
        if (!refreshToken) throw new Error("Refresh token missing");

        const response = await api.post(REFRESH_TOKEN_URL, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (!accessToken || !newRefreshToken) {
          throw new Error("Invalid token response");
        }

        await Promise.all([
          Storage.setAuthToken(accessToken),
          Storage.setRefreshToken(newRefreshToken),
        ]);

        isRefreshing = false;
        onTokenRefreshed(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        await handleTokenRefreshError();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class Http {
  async makeRequest<T>({
    method = "get",
    headers = {},
    url = "/",
    data,
    params = {},
    onUploadProgress,
    cancelToken,
  }: AxiosRequestConfig): Promise<T> {
    const axiosConfig: AxiosRequestConfig = {
      method,
      headers,
      url,
      params,
      onUploadProgress,
      cancelToken,
    };

    if (["post", "put", "patch"].includes(method.toLowerCase()) && data) {
      axiosConfig.data = data;
    }

    try {
      const response: AxiosResponse<T> = await api(axiosConfig);
      return response.data;
    } catch (error: unknown) {
      return this.handleError<T>(error);
    }
  }

  private handleError<T>(error: unknown): never {
    if (axios.isCancel(error)) {
      throw {
        status: (error as AxiosError).response?.status,
        data: (error as AxiosError).response?.data,
        error: "Request canceled.",
      };
    }
    if ((error as AxiosError).response) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const responseData = axiosError.response?.data as { message?: string };
      if (status === 500) {
        throw {
          status,
          data: responseData,
          error: "Unfortunately, something went wrong. Please try again later.",
        };
      }
      throw {
        status,
        data: responseData,
        error: responseData?.message || "An unknown error occurred.",
      };
    }
    if ((error as AxiosError).request) {
      throw {
        error: (error as AxiosError).message || "Server unreachable.",
      };
    }
    throw { error: "An unknown error occurred." };
  }

  get<T>(params: Omit<AxiosRequestConfig, "method">): Promise<T> {
    return this.makeRequest<T>({ ...params, method: "get" });
  }

  post<T>(params: Omit<AxiosRequestConfig, "method">): Promise<T> {
    return this.makeRequest<T>({ ...params, method: "post" });
  }

  put<T>(params: Omit<AxiosRequestConfig, "method">): Promise<T> {
    return this.makeRequest<T>({ ...params, method: "put" });
  }

  delete<T>(params: Omit<AxiosRequestConfig, "method">): Promise<T> {
    return this.makeRequest<T>({ ...params, method: "delete" });
  }
}

export default new Http();
