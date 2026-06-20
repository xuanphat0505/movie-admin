import apiClient from "./apiClient";
import { API_ENDPOINTS } from "./endpoint";

// Đối tượng userApi đóng gói các dịch vụ API liên quan đến quản lý người dùng
export const userApi = {
  // Lấy danh sách người dùng (tự động phân nhánh sang API Search hoặc Filter dựa trên từ khóa tìm kiếm)
  getUsers: (params: {
    keyword?: string;
    role?: string;
    status?: string;
    gender?: string;
    page: number;
    limit: number;
  }) => {
    const url = params.keyword?.trim()
      ? API_ENDPOINTS.ADMIN.USERS_SEARCH
      : API_ENDPOINTS.ADMIN.USERS_FILTER;
    return apiClient.get(url, { params });
  },

  // Thêm người dùng hoặc admin mới vào hệ thống
  addUser: (data: any) => {
    return apiClient.post(API_ENDPOINTS.ADMIN.USERS_ADD, data);
  },

  // Cập nhật thông tin chi tiết người dùng
  updateUser: (id: string, data: any) => {
    return apiClient.put(API_ENDPOINTS.ADMIN.USERS_UPDATE(id), data);
  },

  // Xóa tài khoản người dùng khỏi hệ thống
  deleteUser: (id: string) => {
    return apiClient.delete(API_ENDPOINTS.ADMIN.USERS_DELETE(id));
  },
};
