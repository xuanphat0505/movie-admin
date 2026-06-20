"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
  Ban,
  Eye,
  FileText,
  Filter,
  PlusCircle,
  MessageSquare,
  Heart,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import apiClient from "@/apis/apiClient";
import GenderChart from "@/components/dashboard/GenderChart";
import Modal from "@/components/common/Modal";

// Định nghĩa kiểu dữ liệu cho Báo cáo lỗi phim từ người dùng
interface ErrorReport {
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

// Mock dữ liệu biểu đồ tương tác bình luận và yêu thích qua 6 tháng
const INTERACTION_CHART_DATA = [
  { name: "Tháng 1", comments: 340, favorites: 520 },
  { name: "Tháng 2", comments: 450, favorites: 680 },
  { name: "Tháng 3", comments: 610, favorites: 900 },
  { name: "Tháng 4", comments: 800, favorites: 1100 },
  { name: "Tháng 5", comments: 950, favorites: 1400 },
  { name: "Tháng 6", comments: 1200, favorites: 1880 },
];

export default function ReportsPage() {
  const [mounted, setMounted] = useState<boolean>(false);
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

  // States form tạo mới báo cáo lỗi
  const [newReportData, setNewReportData] = useState({
    movieName: "",
    episode: "",
    errorType: "link" as ErrorReport["errorType"],
    reportedBy: "",
    email: "",
    description: "",
  });

  // Đánh dấu component đã mounted trên client để tránh lỗi hydrations của Recharts
  useEffect(() => {
    setMounted(true);
    fetchLiveStats();
  }, []);

  // Gọi API tổng quan của backend để lấy số lượt bình luận và phim yêu thích thực tế
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

  // Cập nhật trạng thái của báo cáo lỗi (ví dụ: chuyển từ pending sang resolved)
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

  // Thêm mới một báo cáo lỗi giả lập vào danh sách để kiểm thử độ sống động
  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportData.movieName || !newReportData.reportedBy || !newReportData.email) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

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
    setNewReportData({
      movieName: "",
      episode: "",
      errorType: "link",
      reportedBy: "",
      email: "",
      description: "",
    });
  };

  // Hàm xuất danh sách báo cáo sự cố hiện tại ra file CSV hỗ trợ tiếng Việt
  const handleExportCSV = () => {
    if (filteredReports.length === 0) {
      alert("Không có dữ liệu báo cáo nào để xuất!");
      return;
    }

    //  Tiêu đề cột
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

    //  Chuyển đổi dữ liệu thành các dòng CSV
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
        `"${rep.movieName.replace(/"/g, '""')}"`, // Tránh lỗi dấu ngoặc kép trong CSV
        `"${rep.episode}"`,
        `"${typeText}"`,
        `"${rep.reportedBy.replace(/"/g, '""')}"`,
        `"${rep.email}"`,
        `"${statusText}"`,
        `"${new Date(rep.createdAt).toLocaleString("vi-VN")}"`,
      ];
    });

    // Ghép các cột và hàng
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    // Thêm ký tự BOM (\uFEFF) ở đầu để Excel nhận dạng UTF-8 hiển thị chuẩn tiếng Việt có dấu
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Tự động tải xuống
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

  // Component Custom Tooltip cho Recharts để đồng bộ màu sắc tối ưu
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs font-sans">
          <p className="text-slate-400 font-bold mb-1.5">{label}</p>
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
              <span className="w-2 h-2 rounded-full bg-[#ff8300]" />
              <span>Yêu thích: {payload[0].value} lượt</span>
            </p>
            <p className="flex items-center gap-1.5 font-bold text-indigo-500">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Bình luận: {payload[1].value} lượt</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Tiêu đề trang */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="text-[#ff8300]" size={24} />
            <span>Báo cáo & Thống kê</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            Phân tích số liệu tương tác hệ thống và quản trị các lỗi/phản hồi từ người xem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-[#ff8300] hover:bg-[#e07300] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Tạo báo cáo lỗi</span>
          </button>
        </div>
      </div>

      {/* KHỐI BIỂU ĐỒ TRÊN (Analytics Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Biểu đồ tương tác thời gian (Comment & Favorite Growth) */}
        <div className="lg:col-span-2 min-w-0 bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between dark:bg-slate-900/40 dark:border-slate-900/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>Xu hướng tương tác</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold">
                  +24% tháng này
                </span>
              </h3>
              <span className="text-xs text-slate-400">So sánh số lượt bình luận và lưu yêu thích qua các tháng</span>
            </div>

            {/* Hiển thị số liệu thực tế từ API ở đầu chart */}
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-normal">Tổng yêu thích</span>
                <span className="text-slate-800 dark:text-white flex items-center justify-end gap-1">
                  <Heart size={12} className="text-[#ff8300] fill-[#ff8300]" />
                  {loadingStats ? "..." : liveStats.totalFavorites.toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-normal">Tổng bình luận</span>
                <span className="text-slate-800 dark:text-white flex items-center justify-end gap-1">
                  <MessageSquare size={12} className="text-indigo-500" />
                  {loadingStats ? "..." : liveStats.totalComments.toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          </div>

          <div className="h-60 w-full min-w-0">
            {mounted ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={INTERACTION_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="favoriteGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff8300" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff8300" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="commentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/40" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
                  />
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="favorites"
                    stroke="#ff8300"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#favoriteGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="comments"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#commentGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                Đang tải dữ liệu biểu đồ...
              </div>
            )}
          </div>
        </div>

        {/* Thống kê giới tính người dùng (Pie chart từ Analytics) */}
        <div className="lg:col-span-1">
          <GenderChart />
        </div>
      </div>

      {/* KHỐI QUẢN LÝ VẬN HÀNH (Operational Section - User Bug Reports) */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileText className="text-[#ff8300]" size={18} />
            <span>Báo cáo sự cố lỗi phim</span>
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Tổng hợp các phản ánh về chất lượng video, lỗi link tập, sai phụ đề do người xem gửi lên.
          </p>
        </div>

        {/* Hàng bộ lọc báo cáo */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Lọc theo Loại lỗi */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl px-3 h-[38px]">
            <Filter size={12} />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none text-slate-650 dark:text-slate-350 focus:outline-none cursor-pointer"
            >
              <option value="all">Mọi loại sự cố</option>
              <option value="link">Lỗi hỏng Link</option>
              <option value="lag">Giật lag video</option>
              <option value="subtitle">Lỗi phụ đề</option>
              <option value="copyright">Khiếu nại bản quyền</option>
              <option value="other">Lỗi khác</option>
            </select>
          </div>

          {/* Lọc theo Trạng thái xử lý */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl px-3 h-[38px]">
            <Clock size={12} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-slate-650 dark:text-slate-350 focus:outline-none cursor-pointer"
            >
              <option value="all">Mọi trạng thái</option>
              <option value="pending">Chưa xử lý ({pendingCount})</option>
              <option value="resolving">Đang sửa ({resolvingCount})</option>
              <option value="resolved">Đã xong ({resolvedCount})</option>
              <option value="dismissed">Đã bỏ qua</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng danh sách báo cáo sự cố */}
      <div className="bg-white border border-slate-200/80 rounded-2xl dark:bg-slate-900/40 dark:border-slate-900/60 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100/50 dark:border-slate-800/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Mã / Tên Phim</th>
                <th className="px-6 py-4">Tập phim</th>
                <th className="px-6 py-4">Loại sự cố</th>
                <th className="px-6 py-4">Người báo cáo</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-slate-100/40 dark:border-slate-800/40 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 text-xs transition-colors"
                  >
                    {/* Mã & Tên phim */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">{report.movieName}</div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{report.id}</span>
                    </td>

                    {/* Tập phim */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                      {report.episode}
                    </td>

                    {/* Loại sự cố */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          report.errorType === "link"
                            ? "bg-rose-500/10 text-rose-500"
                            : report.errorType === "lag"
                            ? "bg-amber-500/10 text-amber-500"
                            : report.errorType === "subtitle"
                            ? "bg-indigo-500/10 text-indigo-500"
                            : report.errorType === "copyright"
                            ? "bg-purple-500/10 text-purple-500"
                            : "bg-slate-500/10 text-slate-500"
                        }`}
                      >
                        {report.errorType === "link"
                          ? "Hỏng Link"
                          : report.errorType === "lag"
                          ? "Giật Lag"
                          : report.errorType === "subtitle"
                          ? "Lỗi Sub"
                          : report.errorType === "copyright"
                          ? "Bản Quyền"
                          : "Khác"}
                      </span>
                    </td>

                    {/* Người báo cáo */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700 dark:text-slate-350">{report.reportedBy}</div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{report.email}</span>
                    </td>

                    {/* Trạng thái xử lý */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            report.status === "pending"
                              ? "bg-rose-500 animate-pulse"
                              : report.status === "resolving"
                              ? "bg-amber-550"
                              : report.status === "resolved"
                              ? "bg-emerald-500"
                              : "bg-slate-500"
                          }`}
                        />
                        <span
                          className={`font-bold capitalize ${
                            report.status === "pending"
                              ? "text-rose-500"
                              : report.status === "resolving"
                              ? "text-amber-500"
                              : report.status === "resolved"
                              ? "text-emerald-500"
                              : "text-slate-500"
                          }`}
                        >
                          {report.status === "pending"
                            ? "Chưa xử lý"
                            : report.status === "resolving"
                            ? "Đang sửa"
                            : report.status === "resolved"
                            ? "Đã khắc phục"
                            : "Bỏ qua"}
                        </span>
                      </div>
                    </td>

                    {/* Thao tác chỉnh sửa */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(report)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[#ff8300] bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Xem chi tiết</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    Không có báo cáo sự cố nào khớp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Xem chi tiết và xử lý báo cáo lỗi */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedReport ? `Báo cáo: ${selectedReport.id}` : "Chi tiết sự cố"}
        size="md"
      >
        {selectedReport && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Tên phim</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">{selectedReport.movieName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Tập phim</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">{selectedReport.episode}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block">Người báo cáo</span>
                <span className="font-semibold text-slate-750 dark:text-slate-300">{selectedReport.reportedBy}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Email liên hệ</span>
                <span className="font-semibold text-slate-750 dark:text-slate-300">{selectedReport.email}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">Nội dung mô tả sự cố</span>
              <p className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

            {/* Bộ điều khiển trạng thái sự cố */}
            <div className="pt-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Cập nhật trạng thái xử lý lỗi:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {/* Nút Pending */}
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReport.id, "pending")}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                    selectedReport.status === "pending"
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/50"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                  }`}
                >
                  <AlertCircle size={12} className="inline mr-1 -mt-0.5" />
                  Chưa xử lý
                </button>

                {/* Nút Resolving */}
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReport.id, "resolving")}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                    selectedReport.status === "resolving"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/50"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                  }`}
                >
                  <Clock size={12} className="inline mr-1 -mt-0.5" />
                  Đang sửa
                </button>

                {/* Nút Resolved */}
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReport.id, "resolved")}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                    selectedReport.status === "resolved"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/50"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                  }`}
                >
                  <CheckCircle2 size={12} className="inline mr-1 -mt-0.5" />
                  Đã khắc phục
                </button>

                {/* Nút Dismissed */}
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReport.id, "dismissed")}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                    selectedReport.status === "dismissed"
                      ? "bg-slate-500/10 text-slate-550 border-slate-400/50"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                  }`}
                >
                  <Ban size={12} className="inline mr-1 -mt-0.5" />
                  Bỏ qua
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={handleSaveStatusDetail}
                className="px-5 py-2 bg-[#ff8300] hover:bg-[#e07300] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Hoàn tất & Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Tạo mới báo cáo lỗi giả lập */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Tạo báo cáo lỗi mới"
        size="md"
      >
        <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            {/* Tên Phim */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Tên phim bị lỗi *</label>
              <input
                type="text"
                required
                value={newReportData.movieName}
                onChange={(e) => setNewReportData({ ...newReportData, movieName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                placeholder="Ví dụ: Đấu La Đại Lục"
              />
            </div>

            {/* Tập Phim */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Tập phim bị lỗi</label>
              <input
                type="text"
                value={newReportData.episode}
                onChange={(e) => setNewReportData({ ...newReportData, episode: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                placeholder="Ví dụ: Tập 25 hoặc Full Movie"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Loại sự cố */}
            <div className="col-span-1">
              <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Loại sự cố</label>
              <select
                value={newReportData.errorType}
                onChange={(e) => setNewReportData({ ...newReportData, errorType: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors cursor-pointer"
              >
                <option value="link">Hỏng Link</option>
                <option value="lag">Giật Lag</option>
                <option value="subtitle">Lỗi phụ đề</option>
                <option value="copyright">Bản Quyền</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Người báo cáo */}
            <div className="col-span-1">
              <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Họ và tên *</label>
              <input
                type="text"
                required
                value={newReportData.reportedBy}
                onChange={(e) => setNewReportData({ ...newReportData, reportedBy: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                placeholder="Nhập tên người gửi"
              />
            </div>

            {/* Email */}
            <div className="col-span-1">
              <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Email liên hệ *</label>
              <input
                type="email"
                required
                value={newReportData.email}
                onChange={(e) => setNewReportData({ ...newReportData, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Mô tả chi tiết */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Chi tiết mô tả lỗi *</label>
            <textarea
              required
              rows={3}
              value={newReportData.description}
              onChange={(e) => setNewReportData({ ...newReportData, description: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors resize-none"
              placeholder="Nhập mô tả lỗi chi tiết phát hiện được..."
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#ff8300] hover:bg-[#e07300] text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
            >
              Tạo báo cáo
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
