import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { getToken } from "@utils/tokenUtils";
import { ApiError } from "@src/types/apiError";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Server error: API_URL is not defined");
}

const publicClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const privateClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

privateClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const logStatusInterceptor = (response: AxiosResponse) => {
  console.log(
    `[HTTP ${response.status}] ${response.config.method?.toUpperCase()} ${
      response.config.url
    }`
  );
  return response;
};

const responseErrorInterceptor = (error: AxiosError<ApiError>) => {
  const apiError: ApiError = error.response?.data || {
    type: error.response?.data?.type || "",
    title: error.response?.data?.title || "",
    status: error.response?.data?.status || 500,
    detail: error.response?.data?.detail || "",
    instance: error.response?.data?.instance || "",
  };
  console.log(error);
  console.error("API error:", apiError);
  throw apiError;
};

publicClient.interceptors.response.use(
  logStatusInterceptor,
  responseErrorInterceptor
);
privateClient.interceptors.response.use(
  logStatusInterceptor,
  responseErrorInterceptor
);

export { publicClient, privateClient };
