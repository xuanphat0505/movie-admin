import apiClient from "./apiClient";
import { API_ENDPOINTS } from "./endpoint";

export interface SystemSettings {
  maintenanceMode: boolean;
  pageLimit: number;
  hotline: string;
  facebookUrl: string;
}

export const settingApi = {
  // lấy cấu hình hệ thống hiện tại
  getSettings: async (): Promise<SystemSettings> => {
    const res = await apiClient.get(API_ENDPOINTS.SETTING);
    const data = res.data?.data || {};
    return {
      maintenanceMode: !!data.maintenanceMode,
      pageLimit: Number(data.pageLimit) || 12,
      hotline: data.hotline || "",
      facebookUrl: data.facebookUrl || "",
    };
  },

  // cập nhật cấu hình hệ thống
  updateSettings: async (
    payload: Partial<SystemSettings>,
  ): Promise<SystemSettings> => {
    const res = await apiClient.put(API_ENDPOINTS.SETTING, payload);
    const data = res.data?.data || {};
    return {
      maintenanceMode: !!data.maintenanceMode,
      pageLimit: Number(data.pageLimit) || 12,
      hotline: data.hotline || "",
      facebookUrl: data.facebookUrl || "",
    };
  },
};
