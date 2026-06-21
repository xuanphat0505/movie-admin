import apiClient from "./apiClient";
import { API_ENDPOINTS } from "./endpoint";

// Dịch vụ API xử lý các thao tác liên quan đến thông báo hệ thống
export const notificationApi = {
  // Lấy toàn bộ danh sách thông báo của admin hiện tại
  getNotifications: () => {
    return apiClient.get(API_ENDPOINTS.NOTIFICATION.GET_ALL);
  },

  // Đánh dấu một thông báo cụ thể là đã đọc
  readOne: (id: string) => {
    return apiClient.post(API_ENDPOINTS.NOTIFICATION.READ_ONE(id));
  },

  // Đánh dấu tất cả thông báo trong danh sách là đã đọc
  readAll: () => {
    return apiClient.post(API_ENDPOINTS.NOTIFICATION.READ_ALL);
  },

  // Cập nhật cài đặt nhận thông báo của Admin (email, desktop)
  updateSettings: (settings: { mail?: boolean; desktop?: boolean }) => {
    return apiClient.post(API_ENDPOINTS.NOTIFICATION.UPDATE, settings);
  },
};
