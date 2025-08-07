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
  <T>(response: AxiosResponse<any>) => {
    let responseData = response.data;
    
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      responseData = responseData.data;
      
      while (responseData && typeof responseData === 'object' && 'data' in responseData && 
             Object.keys(responseData).length === 1) {
        responseData = responseData.data;
      }
    }
    
    if (responseData) {
      response.data = camelcaseKeys(responseData, { deep: true }) as T;
    }
    
    return response;
  },
  (error: AxiosError<ErrorRes>) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error("Bad Request:", error.response.data.error, error.response.data.errors);
          break;
        case 401:
          console.error("Unauthorized:", error.response.data.error);
          break;
        case 403:
          console.error("Forbidden:", error.response.data.error);
          break;
        case 404:
          console.error("Not Found:", error.response.data.error);
          break;
        case 500:
          console.error("Internal Server Error:", error.response.data.error);
          break;
        default:
          console.error("Unknown Error:", error.response.data.error || error.message);
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