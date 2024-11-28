import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  CancelToken,
} from "axios";
import Storage from "../utilities/storage";

const TIMEOUT = 3600000;
const CONTENT_TYPE_JSON = "application/json";
const UNKNOWN_ERR_MSG =
  "An unknown server error has occurred or the server may be unreachable.";

axios.defaults.headers.post["Content-Type"] = CONTENT_TYPE_JSON;
axios.defaults.timeout = TIMEOUT;
axios.interceptors.request.use(
  async (config: any) => {
    const token = await Storage.getAuthToken();
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await Storage.getRefreshToken();
        console.log("Refresh Token:", refreshToken); // Debug log
        if (!refreshToken) throw new Error("Refresh token missing");

        // Refresh the token
        const response = await axios.post("/auth/refresh", { refreshToken });
        const { accessToken } = response.data;

        // Save the new token
        await Storage.setAuthToken(accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        await Storage.clear();
        window.location.href = "/login"; // Redirect to login on failure
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
    try {
      // Configure request without including unnecessary data fields
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

      const response: AxiosResponse<T> = await axios(axiosConfig);
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
        error: responseData?.message || UNKNOWN_ERR_MSG,
      };
    }
    if ((error as AxiosError).request) {
      throw {
        error: (error as AxiosError).message || UNKNOWN_ERR_MSG,
      };
    }
    throw { error: UNKNOWN_ERR_MSG };
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
