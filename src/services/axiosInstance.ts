import axios from "axios";
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  console.log(config.url);
  return config;
});

export function setupAxiosInterceptors(logoutCallback: () => Promise<void>) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log(error.response.data);
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await axiosInstance.post("/refresh");
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          handleApiError(refreshError);
          try {
            await logoutCallback();
          } catch (logoutError) {
            handleApiError(logoutError);
          }
        }
      }else if (error.response?.status === 403 && !originalRequest._retry && error.response?.data?.code==="BLOCKED") {
        originalRequest._retry = true;
          try {
            await logoutCallback();
          } catch (logoutError) {
            handleApiError(logoutError);
          }
      }else{
        handleApiError(error)
      }
      return Promise.reject(error);
    }
  );
}

export function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      toast.error("Network error. Please check your internet connection.");
      return;
    }

    const status = error.response.status;
    const msg = error.response.data?.message;
    if (status >= 500) {
      toast.error("Something went wrong. Please try again later.");
    } else if (status >= 400) {
      toast.error(msg || "Internal server error");
    }
    console.log(status, error, error.response.data);
  } else {
    toast.error("Unexpected error occurred.");
  }
}

export default axiosInstance;
