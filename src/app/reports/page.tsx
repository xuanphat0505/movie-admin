"use client";

import { useState, useEffect } from "react";
import apiClient from "@/apis/apiClient";
import GenderChart from "@/components/dashboard/GenderChart";
import {
  ReportHeader,
  InteractionChart,
  ReportFilterBar,
  ReportTable,
  ReportDetailModal,
  ReportCreateModal,
} from "@/components/report";
import { toast } from "@/utils/toast";
import {
  fetchAllReports,
  updateReportStatus as apiUpdateReportStatus,
  createReport as apiCreateReport,
} from "@/apis/reportApi";

// Định nghĩa kiểu dữ liệu cho Báo cáo lỗi phim từ người dùng
export interface ErrorReport {
  id: string;
  movieName: string;
  episode: string;
  errorType: "link" | "lag" | "subtitle" | "copyright" | "other";
  reportedBy: string;
  email: string;
  description: string;
  status: "pending" | "resolving" | "resolved" | "dismissed";
  createdAt: string;
}




export default function ReportsPage() {
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // States lưu số lượng tương tác thời gian thực từ API backend
  const [liveStats, setLiveStats] = useState({
    totalComments: 0,
    totalFavorites: 0,
  });

  // States bộ lọc báo cáo
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // States quản lý Modal chi tiết & tạo mới báo cáo lỗi
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<ErrorReport | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  // Gọi API tổng quan và danh sách báo cáo thực tế khi mount
  useEffect(() => {
    fetchLiveStats();
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await fetchAllReports();
      setReports(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách báo cáo lỗi:", error);
      toast.error("Không thể tải danh sách báo cáo lỗi");
    }
  };

  const fetchLiveStats = async () => {
    setLoadingStats(true);
    try {
      const res = await apiClient.get("/analytics/overview-stats");
      if (res.data?.success && res.data?.data) {
        setLiveStats({
          totalComments: res.data.data.totalComments || 0,
          totalFavorites: res.data.data.totalFavorites || 0,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải số liệu tương tác thực tế:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Mở modal xem và sửa trạng thái báo cáo lỗi
  const handleOpenDetail = (report: ErrorReport) => {
    setSelectedReport(report);
    setIsDetailOpen(true);
  };

  // Cập nhật trạng thái của báo cáo lỗi
  const handleUpdateStatus = async (id: string, newStatus: ErrorReport["status"]) => {
    try {
      const success = await apiUpdateReportStatus(id, newStatus);
      if (success) {
        setReports((prev) =>
          prev.map((rep) => (rep.id === id ? { ...rep, status: newStatus } : rep))
        );
        if (selectedReport && selectedReport.id === id) {
          setSelectedReport({ ...selectedReport, status: newStatus });
        }
        toast.success("Cập nhật trạng thái thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái báo cáo:", error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  // Lưu trạng thái và đóng modal chi tiết
  const handleSaveStatusDetail = () => {
    setIsDetailOpen(false);
    setSelectedReport(null);
  };

  // Thêm mới một báo cáo lỗi lên backend
  const handleCreateReport = async (newReportData: Omit<ErrorReport, "id" | "status" | "createdAt">) => {
    try {
      const success = await apiCreateReport(newReportData);
      if (success) {
        toast.success("Đã tạo báo cáo lỗi thành công!");
        fetchReports();
        setIsCreateOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo lỗi:", error);
      toast.error("Tạo báo cáo lỗi thất bại");
    }
  };

  // Hàm xuất danh sách báo cáo sự cố hiện tại ra file CSV hỗ trợ tiếng Việt
  const handleExportCSV = () => {
    if (filteredReports.length === 0) {
      toast.warning("Không có dữ liệu báo cáo nào để xuất!");
      return;
    }

    const headers = [
      "Mã sự cố",
      "Tên phim",
      "Tập phim",
      "Loại sự cố",
      "Người báo cáo",
      "Email",
      "Trạng thái",
      "Ngày tạo",
    ];

    const rows = filteredReports.map((rep) => {
      const typeText =
        rep.errorType === "link"
          ? "Hỏng Link"
          : rep.errorType === "lag"
          ? "Giật Lag"
          : rep.errorType === "subtitle"
          ? "Lỗi Sub"
          : rep.errorType === "copyright"
          ? "Bản Quyền"
          : "Khác";

      const statusText =
        rep.status === "pending"
          ? "Chưa xử lý"
          : rep.status === "resolving"
          ? "Đang sửa"
          : rep.status === "resolved"
          ? "Đã khắc phục"
          : "Bỏ qua";

      return [
        rep.id,
        `"${rep.movieName.replace(/"/g, '""')}"`,
        `"${rep.episode}"`,
        `"${typeText}"`,
        `"${rep.reportedBy.replace(/"/g, '""')}"`,
        `"${rep.email}"`,
        `"${statusText}"`,
        `"${new Date(rep.createdAt).toLocaleString("vi-VN")}"`,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bao_cao_su_co_phim_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lọc danh sách báo cáo dựa theo các select filters
  const filteredReports = reports.filter((rep) => {
    const matchStatus = statusFilter === "all" || rep.status === statusFilter;
    const matchType = typeFilter === "all" || rep.errorType === typeFilter;
    return matchStatus && matchType;
  });

  // Tính toán bộ đếm các báo cáo lỗi theo trạng thái
  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const resolvingCount = reports.filter((r) => r.status === "resolving").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Tiêu đề trang & Nút xuất/tạo */}
      <ReportHeader
        onExportCSV={handleExportCSV}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* KHỐI BIỂU ĐỒ TRÊN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <InteractionChart
          liveStats={liveStats}
          loadingStats={loadingStats}
        />
        <div className="lg:col-span-1">
          <GenderChart />
        </div>
      </div>

      {/* KHỐI BỘ LỌC BÁO CÁO */}
      <ReportFilterBar
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        pendingCount={pendingCount}
        resolvingCount={resolvingCount}
        resolvedCount={resolvedCount}
      />

      {/* BẢNG DANH SÁCH BÁO CÁO */}
      <ReportTable
        reports={filteredReports}
        onOpenDetail={handleOpenDetail}
      />

      {/* MODAL CHI TIẾT & SỬA TRẠNG THÁI */}
      <ReportDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        report={selectedReport}
        onUpdateStatus={handleUpdateStatus}
        onSave={handleSaveStatusDetail}
      />

      {/* MODAL TẠO BÁO CÁO LỖI MỚI */}
      <ReportCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateReport}
      />
    </div>
  );
}
