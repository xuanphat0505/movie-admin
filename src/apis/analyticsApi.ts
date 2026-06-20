import apiClient from "./apiClient";
import { API_ENDPOINTS } from "./endpoint";

export const analyticsApi = {
  // Lấy dữ liệu thống kê tổng quan (Số người dùng, lượt yêu thích, bình luận)
  getOverviewStats: () => {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.OVERVIEW_STATS);
  },

  // Lấy dữ liệu thống kê phân bố giới tính người dùng
  getGenderStats: () => {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.GENDER_STATS);
  },
};