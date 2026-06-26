import { toast as sonnerToast } from "sonner";

export const toast = {
  // Hiển thị thông báo thành công
  success: (message: string, description?: string) => {
    sonnerToast.success(message, { description });
  },

  // Hiển thị thông báo lỗi
  error: (message: string, description?: string) => {
    sonnerToast.error(message, { description });
  },

  // Hiển thị thông báo thông tin
  info: (message: string, description?: string) => {
    sonnerToast.info(message, { description });
  },

  // Hiển thị thông báo cảnh báo
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, { description });
  },
};
