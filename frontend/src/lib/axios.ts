import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Sends the cookies with requests (since i'm using express-session)
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const adminAxiosInstance = axios.create({
  baseURL: `${SERVER_URL}/api/v1/admin`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

adminAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized - redirect to login
          window.location.href = "/auth";
          break;
        case 403:
          // Mainly returned from the server when trying to access admin panel without the correct permissions
          console.error("Access forbidden");
          window.location.href = "/admin/login";
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("An error occurred");
      }
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export { adminAxiosInstance };

export default axiosInstance;
