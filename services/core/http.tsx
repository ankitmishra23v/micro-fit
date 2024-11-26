import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  CancelToken,
} from "axios";
import storage from "../utilities/storage";

const TIMEOUT = 3600000;
const CONTENT_TYPE_JSON = "application/json";
const UNKNOWN_ERR_MSG =
  "An unknown server error has occurred or the server may be unreachable.";

axios.defaults.headers.post["Content-Type"] = CONTENT_TYPE_JSON;
axios.defaults.timeout = TIMEOUT;

// Interceptor to add the authorization token
axios.interceptors.request.use(
  async (config: any) => {
    const token = await storage.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
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

      // Add `data` only for methods that support request bodies and if `data` is valid
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
