import apiClient from "./apiClient";
import { API_ENDPOINTS } from "./endpoint";
import { ErrorReport } from "@/app/reports/page";

// Chuyển đổi định dạng báo cáo lỗi từ Backend sang định dạng ErrorReport của Frontend
const mapReportData = (item: any): ErrorReport => {
  let errorType: ErrorReport["errorType"] = "other";
  if (item.type === "video_error") errorType = "link";
  else if (item.type === "audio_error") errorType = "lag";
  else if (item.type === "subtitle_error") errorType = "subtitle";
  else if (item.type === "content_violation") errorType = "copyright";

  return {
    id: item._id,
    movieName: item.movieName,
    episode: item.episodeName || "Full Movie",
    errorType,
    reportedBy: item.userId?.username || "Ẩn danh",
    email: item.userId?.email || "Không có email",
    description: item.note || "",
    status: item.status || "pending",
    createdAt: item.createdAt,
  };
};

// Gọi API lấy toàn bộ báo cáo lỗi
export const fetchAllReports = async (): Promise<ErrorReport[]> => {
  const res = await apiClient.get(API_ENDPOINTS.REPORT.GET_ALL);
  if (res.data?.success && res.data?.data) {
    return res.data.data.map(mapReportData);
  }
  return [];
};

// Gọi API cập nhật trạng thái xử lý lỗi
export const updateReportStatus = async (
  id: string,
  status: ErrorReport["status"]
): Promise<boolean> => {
  const res = await apiClient.patch(API_ENDPOINTS.REPORT.UPDATE_STATUS(id), {
    status,
  });
  return !!res.data?.success;
};

// Gọi API tạo mới báo cáo lỗi (hỗ trợ admin tự tạo báo cáo)
export const createReport = async (
  reportData: Omit<ErrorReport, "id" | "status" | "createdAt">
): Promise<boolean> => {
  let type = "other";
  if (reportData.errorType === "link") type = "video_error";
  else if (reportData.errorType === "lag") type = "audio_error";
  else if (reportData.errorType === "subtitle") type = "subtitle_error";
  else if (reportData.errorType === "copyright") type = "content_violation";

  const res = await apiClient.post(API_ENDPOINTS.REPORT.CREATE, {
    movieId: reportData.movieName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    movieName: reportData.movieName,
    episodeName: reportData.episode || "Full Movie",
    type,
    note: reportData.description,
  });

  return !!res.data?.success;
};
