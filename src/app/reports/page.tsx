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

// Hằng số chứa danh sách mock dữ liệu báo cáo lỗi ban đầu
const MOCK_REPORTS: ErrorReport[] = [
  {
    id: "REP-001",
    movieName: "Đấu Phá Thương Khung (Phần 5)",
    episode: "Tập 104",
    errorType: "link",
    reportedBy: "Nguyễn Văn An",
    email: "an.nguyen@gmail.com",
    description: "Link tập 104 bị hỏng, khi bấm vào hiện màn hình đen và không load được video.",
    status: "pending",
    createdAt: "2026-06-20T10:15:30Z",
  },
  {
    id: "REP-002",
    movieName: "Thần Điêu Đại Hiệp (2006)",
    episode: "Tập 15",
    errorType: "subtitle",
    reportedBy: "Trần Thị Bích",
    email: "bich.tran@yahoo.com",
    description: "Phụ đề tập này bị lệch khoảng 5 giây so với âm thanh, xem rất khó chịu.",
    status: "resolving",
    createdAt: "2026-06-19T14:20:00Z",
  },
  {
    id: "REP-003",
    movieName: "One Piece (Đảo Hải Tặc)",
    episode: "Tập 1109",
    errorType: "lag",
    reportedBy: "Lê Minh Tuấn",
    email: "tuanlm@outlook.com",
    description: "Video giật lag liên tục dù tôi dùng mạng tốc độ cao. Các phim khác vẫn xem bình thường.",
    status: "resolved",
    createdAt: "2026-06-18T09:05:12Z",
  },
  {
    id: "REP-004",
    movieName: "Dune: Hành Tinh Cát (Phần 2)",
    episode: "Full Movie",
    errorType: "copyright",
    reportedBy: "Warner Bros Protection",
    email: "copyright@warnerbros.com",
    description: "Yêu cầu gỡ bỏ phim vì vi phạm bản quyền phát hành chính thức tại Việt Nam.",
    status: "pending",
    createdAt: "2026-06-17T16:45:00Z",
  },
  {
    id: "REP-005",
    movieName: "Trường Tương Tư (Phần 2)",
    episode: "Tập 4",
    errorType: "other",
    reportedBy: "Phạm Minh Hoàng",
    email: "hoangpm@gmail.com",
    description: "Tập này bị lặp âm thanh một đoạn dài khoảng 3 phút ở giữa phim.",
    status: "dismissed",
    createdAt: "2026-06-16T11:30:22Z",
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ErrorReport[]>(MOCK_REPORTS);
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

  // Gọi API tổng quan của backend để lấy số lượt bình luận và phim yêu thích thực tế khi mount
  useEffect(() => {
    fetchLiveStats();
  }, []);

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
  const handleUpdateStatus = (id: string, newStatus: ErrorReport["status"]) => {
    setReports((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, status: newStatus } : rep))
    );
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
  };

  // Lưu trạng thái và đóng modal chi tiết
  const handleSaveStatusDetail = () => {
    setIsDetailOpen(false);
    setSelectedReport(null);
  };

  // Thêm mới một báo cáo lỗi giả lập vào danh sách
  const handleCreateReport = (newReportData: Omit<ErrorReport, "id" | "status" | "createdAt">) => {
    const newReport: ErrorReport = {
      id: `REP-00${reports.length + 1}`,
      movieName: newReportData.movieName,
      episode: newReportData.episode || "Full Movie",
      errorType: newReportData.errorType,
      reportedBy: newReportData.reportedBy,
      email: newReportData.email,
      description: newReportData.description,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setReports([newReport, ...reports]);
    setIsCreateOpen(false);
    toast.success("Đã tạo báo cáo lỗi thành công!");
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
