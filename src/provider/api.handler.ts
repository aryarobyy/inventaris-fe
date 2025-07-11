import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
} from "axios";
import { API_BASE_URL } from "../core/contants";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

const apiHandler: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

interface SuccessRes<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface ErrorRes {
  statusCode: number;
  message: string;
  errors?: any;
}

apiHandler.interceptors.request.use(
  (config) => {
    if (config.data) {
      config.data = snakecaseKeys(config.data, { deep: true }); //ubah jadi snake
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiHandler.interceptors.response.use(
  <T>(response: AxiosResponse<SuccessRes<T>>) => {
    if (response.data && response.data.data) {
      response.data.data = camelcaseKeys(response.data.data, { deep: true }) as T;//ubah jadi camel
    }
    return response;
  },
  (error: AxiosError<ErrorRes>) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error("Bad Request:", error.response.data.message, error.response.data.errors);
          break;
        case 401:
          console.error("Unauthorized:", error.response.data.message);
          break;
        case 403:
          console.error("Forbidden:", error.response.data.message);
          break;
        case 404:
          console.error("Not Found:", error.response.data.message);
          break;
        case 500:
          console.error("Internal Server Error:", error.response.data.message);
          break;
        default:
          console.error("Unknown Error:", error.response.data?.message || error.message);
      }
    } else if (error.request) {
      console.error("No response from server. Please check your internet connection.");
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiHandler;