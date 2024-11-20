import http from "../core/http";

const getApiBaseUrl = process.env.REACT_NATIVE_APP_API_BASE_URL;

if (!getApiBaseUrl) {
  throw new Error("API Base URL is not defined.");
}

const makeApiUrl = (url: string) => `${getApiBaseUrl}${url}`;

export const signUp = ({ data }: { data: Record<string, any> }) => {
  return http.post({
    url: makeApiUrl("users/register"),
    data, // Wrap the data inside an object
  });
};

export const logIn = ({ data }: { data: Record<string, any> }) => {
  return http.post({
    url: makeApiUrl("users/login"),
    data,
  });
};
