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

  // Cập nhật thông tin tài khoản admin
  updateProfile: (id: string, data: any) => {
    return apiClient.put(API_ENDPOINTS.ADMIN.UPDATE_PROFILE(id), data);
  },

  // Tải ảnh đại diện admin lên hệ thống
  uploadAvatar: (formData: FormData) => {
    return apiClient.post(API_ENDPOINTS.ADMIN.UPLOAD_AVATAR, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Lấy thông tin thiết lập bảo mật 2 lớp (QR và Secret)
  mfaSetup: () => {
    return apiClient.get(API_ENDPOINTS.AUTH.MFA_SETUP);
  },

  // Xác thực và kích hoạt bảo mật 2 lớp
  mfaVerify: (data: { token: string; secret: string }) => {
    return apiClient.post(API_ENDPOINTS.AUTH.MFA_VERIFY, data);
  },

  // Hủy kích hoạt bảo mật 2 lớp
  mfaDisable: (data: { token: string }) => {
    return apiClient.post(API_ENDPOINTS.AUTH.MFA_DISABLE, data);
  },

  // Đăng nhập bước 2 bằng mã xác thực 2 lớp
  mfaLogin: (data: { tempToken: string; code: string }) => {
    return apiClient.post(API_ENDPOINTS.AUTH.MFA_LOGIN, data);
  },
};