import axios from "axios";
import { API_ENDPOINTS } from "./endpoint";

// Khởi tạo instance Axios với cấu hình cơ bản
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép trình duyệt tự động gửi kèm cookie (ví dụ refreshToken)
});

// Request Interceptor: Tự động đính kèm accessToken vào Header Authorization nếu tồn tại trong localStorage
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("adminToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Biến lưu trạng thái đang refresh token và danh sách các request chờ để thử lại
let isRefreshing = false;
let failedQueue: any[] = [];

// Hàm xử lý hàng đợi các request thất bại do hết hạn token
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Tự động gọi API Refresh Token khi Access Token hết hạn (401)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Chỉ thực hiện refresh token khi có lỗi 401 và không phải là chính request refresh token đó
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== API_ENDPOINTS.AUTH.REFRESH_TOKEN
    ) {
      if (isRefreshing) {
        // Đưa các request tiếp theo vào hàng đợi chờ token mới
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Thực hiện POST tới endpoint refresh-token để nhận accessToken mới
        const res = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
        if (res.data?.success && res.data?.data?.accessToken) {
          const newToken = res.data.data.accessToken;
          
          if (typeof window !== "undefined") {
            localStorage.setItem("adminToken", newToken);
          }

          apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          processQueue(null, newToken);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Nếu refresh token thất bại, đăng xuất và đẩy user về trang login
        if (typeof window !== "undefined") {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
