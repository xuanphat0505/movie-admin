import apiClient from "./apiClient";
import { API_ENDPOINTS } from "./endpoint";

// Đối tượng authApi đóng gói các phương thức gọi API xác thực tài khoản quản trị viên
export const authApi = {
  // Gửi yêu cầu đăng nhập bằng Email và Mật khẩu
  login: (data: any) => {
    return apiClient.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, data);
  },

  // Gửi yêu cầu đăng nhập bằng tài khoản Google
  googleLogin: (data: any) => {
    return apiClient.post(API_ENDPOINTS.AUTH.ADMIN_GOOGLE_LOGIN, data);
  },

  // Gửi yêu cầu đăng xuất hệ thống
  logout: () => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};