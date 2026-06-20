"use client";

import  { useState } from "react";
import { Tags, Globe, Search, ArrowRight, TrendingUp, Flame, Sparkles } from "lucide-react";
import Link from "next/link";

// Xác định nhãn xu hướng động dựa vào số lượng phim
const getTrendBadge = (count: number) => {
  if (count >= 1500) {
    return {
      label: "Thịnh hành",
      colorClass: "text-rose-500 bg-rose-500/10 dark:text-rose-450 dark:bg-rose-500/20",
      icon: Flame,
    };
  }
  if (count >= 500) {
    return {
      label: "Phổ biến",
      colorClass: "text-blue-500 bg-blue-500/10 dark:text-blue-440 dark:bg-blue-500/20",
      icon: TrendingUp,
    };
  }
  return {
    label: "Mới",
    colorClass: "text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800/80",
    icon: Sparkles,
  };
};

// Component hiển thị nhãn xu hướng mượt mà
function TrendBadge({ count }: { count: number }) {
  const badge = getTrendBadge(count);
  const BadgeIcon = badge.icon;
  return (
    <div className={`flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${badge.colorClass}`}>
      <BadgeIcon size={10} />
      <span>{badge.label}</span>
    </div>
  );
}

// Dữ liệu danh sách Thể loại kèm thống kê giả lập thực tế từ hệ thống KKPhim
const GENRES = [
  { name: "Hành Động", slug: "hanh-dong", count: 1842, percentage: 95 },
  { name: "Tình Cảm", slug: "tinh-cam", count: 1980, percentage: 100 },
  { name: "Hài Hước", slug: "hai-huoc", count: 1250, percentage: 63 },
  { name: "Cổ Trang", slug: "co-trang", count: 850, percentage: 43 },
  { name: "Tâm Lý", slug: "tam-ly", count: 1540, percentage: 78 },
  { name: "Hình Sự", slug: "hinh-su", count: 720, percentage: 36 },
  { name: "Võ Thuật", slug: "vo-thuat", count: 910, percentage: 46 },
  { name: "Viễn Tưởng", slug: "vien-tuong", count: 680, percentage: 34 },
  { name: "Kinh Dị", slug: "kinh-di", count: 1120, percentage: 56 },
  { name: "Phiêu Lưu", slug: "phieu-luu", count: 830, percentage: 42 },
  { name: "Chiến Tranh", slug: "chien-tranh", count: 320, percentage: 16 },
  { name: "Thần Thoại", slug: "than-thoai", count: 480, percentage: 24 },
  { name: "Tài Liệu", slug: "tai-lieu", count: 210, percentage: 10 },
  { name: "Gia Đình", slug: "gia-dinh", count: 540, percentage: 27 },
  { name: "Học Đường", slug: "hoc-duong", count: 410, percentage: 20 },
];

// Dữ liệu danh sách Quốc gia kèm thống kê giả lập từ hệ thống KKPhim
const COUNTRIES = [
  { name: "Mỹ (Âu Mỹ)", slug: "au-my", count: 2450, percentage: 100 },
  { name: "Trung Quốc", slug: "trung-quoc", count: 1890, percentage: 77 },
  { name: "Hàn Quốc", slug: "han-quoc", count: 1540, percentage: 62 },
  { name: "Nhật Bản", slug: "nhat-ban", count: 980, percentage: 40 },
  { name: "Thái Lan", slug: "thai-lan", count: 620, percentage: 25 },
  { name: "Hồng Kông", slug: "hong-kong", count: 540, percentage: 22 },
  { name: "Việt Nam", slug: "viet-nam", count: 480, percentage: 19 },
  { name: "Đài Loan", slug: "dai-loan", count: 210, percentage: 8 },
  { name: "Anh", slug: "anh", count: 380, percentage: 15 },
  { name: "Ấn Độ", slug: "an-do", count: 190, percentage: 7 },
  { name: "Pháp", slug: "phap", count: 120, percentage: 4 },
];

// Trang quản lý danh mục và phân tích danh mục/quốc gia
export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<"genres" | "countries">("genres");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lấy danh sách hiển thị tương ứng với tab đang chọn và lọc theo từ khóa tìm kiếm
  const currentList = activeTab === "genres" ? GENRES : COUNTRIES;
  const filteredList = currentList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header giới thiệu trang */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Tags className="text-[#ff8300]" size={24} />
          <span>Danh mục Thể loại & Quốc gia</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
          Phân tích thống kê số lượng nguồn phim đã đồng bộ theo từng danh mục
          phân loại từ hệ sinh thái phim.
        </p>
      </div>

      {/* Tabs điều hướng và thanh tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/40 dark:border-slate-850/60 self-start">
          <button
            onClick={() => {
              setActiveTab("genres");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "genres"
                ? "bg-[#ff8300] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Tags size={14} />
            <span>Thể loại phim ({GENRES.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("countries");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "countries"
                ? "bg-[#ff8300] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Globe size={14} />
            <span>Quốc gia sản xuất ({COUNTRIES.length})</span>
          </button>
        </div>

        {/* Thanh tìm kiếm nhanh */}
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder={
              activeTab === "genres" ? "Tìm thể loại..." : "Tìm quốc gia..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-250 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl h-[38px] pl-10 pr-4 text-xs text-slate-800 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-550 focus:outline-none focus:border-[#ff8300]/50 transition-all"
          />
        </div>
      </div>

      {/* Grid danh sách thẻ danh mục */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredList.map((item) => {
            const redirectUrl =
              activeTab === "genres"
                ? `/movies?genre=${item.slug}`
                : `/movies?country=${item.slug}`;

            return (
              <div
                key={item.slug}
                className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-[#ff8300]/30 dark:bg-slate-900/40 dark:border-slate-900/60 dark:hover:border-[#ff8300]/30 transition-all duration-300 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Icon nổi và thông tin tên danh mục */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-100/80 flex items-center justify-center dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 group-hover:bg-[#ff8300]/10 group-hover:text-[#ff8300] transition-colors">
                      {activeTab === "genres" ? (
                        <Tags size={16} />
                      ) : (
                        <Globe size={16} />
                      )}
                    </div>
                    {/* Nhãn xu hướng động */}
                    <TrendBadge count={item.count} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-[#ff8300] transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5 dark:text-slate-550">
                    slug: {item.slug}
                  </span>

                  {/* Thanh biểu đồ thống kê */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Tổng phim</span>
                      <span className="text-slate-800 dark:text-slate-350">
                        {item.count.toLocaleString("vi-VN")} phim
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-[#ff8300] rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Nút xem nhanh danh sách phim */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <Link
                    href={redirectUrl}
                    className="flex items-center justify-between text-xs font-bold text-slate-600 hover:text-[#ff8300] dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <span>Xem danh sách phim</span>
                    <ArrowRight
                      size={13}
                      className="transform group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-450 dark:text-slate-550 bg-white border border-slate-200 rounded-2xl dark:bg-slate-900/40 dark:border-slate-900/60">
          Không tìm thấy danh mục hay quốc gia nào khớp với từ khóa tìm kiếm.
        </div>
      )}
    </div>
  );
}
