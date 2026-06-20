"use client";

import { Search, RotateCcw } from "lucide-react";

// Khai báo danh mục thể loại phim phổ biến
const GENRES = [
  { name: "Hành Động", slug: "hanh-dong" },
  { name: "Tình Cảm", slug: "tinh-cam" },
  { name: "Hài Hước", slug: "hai-huoc" },
  { name: "Cổ Trang", slug: "co-trang" },
  { name: "Tâm Lý", slug: "tam-ly" },
  { name: "Hình Sự", slug: "hinh-su" },
  { name: "Võ Thuật", slug: "vo-thuat" },
  { name: "Viễn Tưởng", slug: "vien-tuong" },
  { name: "Kinh Dị", slug: "kinh-di" },
  { name: "Phiêu Lưu", slug: "phieu-luu" },
  { name: "Chiến Tranh", slug: "chien-tranh" },
  { name: "Thần Thoại", slug: "than-thoai" },
  { name: "Tài Liệu", slug: "tai-lieu" },
  { name: "Gia Đình", slug: "gia-dinh" },
  { name: "Học Đường", slug: "hoc-duong" },
];

// Khai báo danh sách các quốc gia
const COUNTRIES = [
  { name: "Tất cả quốc gia", slug: "" },
  { name: "Trung Quốc", slug: "trung-quoc" },
  { name: "Hàn Quốc", slug: "han-quoc" },
  { name: "Việt Nam", slug: "viet-nam" },
  { name: "Mỹ (Âu Mỹ)", slug: "au-my" },
  { name: "Nhật Bản", slug: "nhat-ban" },
  { name: "Thái Lan", slug: "thai-lan" },
  { name: "Hồng Kông", slug: "hong-kong" },
  { name: "Đài Taiwan", slug: "dai-loan" },
  { name: "Anh", slug: "anh" },
  { name: "Ấn Độ", slug: "an-do" },
  { name: "Pháp", slug: "phap" },
];

// Khai báo danh sách năm phát hành
const YEARS = [
  { name: "Tất cả năm", slug: "" },
  { name: "2026", slug: "2026" },
  { name: "2025", slug: "2025" },
  { name: "2024", slug: "2024" },
  { name: "2023", slug: "2023" },
  { name: "2022", slug: "2022" },
  { name: "2021", slug: "2021" },
  { name: "2020", slug: "2020" },
  { name: "2019", slug: "2019" },
  { name: "2018", slug: "2018" },
  { name: "2017", slug: "2017" },
  { name: "2016", slug: "2016" },
  { name: "2015", slug: "2015" },
];

interface MovieFilterBarProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  selectedGenre: string;
  onGenreChange: (val: string) => void;
  selectedCountry: string;
  onCountryChange: (val: string) => void;
  selectedYear: string;
  onYearChange: (val: string) => void;
  onReset: () => void;
}

// Component MovieFilterBar chứa ô tìm kiếm và các dropdown lọc phim
export default function MovieFilterBar({
  keyword,
  onKeywordChange,
  selectedGenre,
  onGenreChange,
  selectedCountry,
  onCountryChange,
  selectedYear,
  onYearChange,
  onReset,
}: MovieFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white border border-slate-200 p-5 rounded-2xl shadow-sm mb-6 dark:bg-slate-900/40 dark:border-slate-900/60 dark:shadow-none">
      {/* Tìm kiếm từ khóa */}
      <div className="relative w-full lg:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input
          type="text"
          placeholder="Tìm phim..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="w-full bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl h-[38px] pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ff8300]/50 focus:bg-white transition-all dark:bg-slate-900/60 dark:border-slate-800/80 dark:hover:border-slate-700 dark:text-slate-300 dark:placeholder-slate-500 dark:focus:bg-slate-900/80"
        />
      </div>

      {/* Các dropdown bộ lọc và nút reset */}
      <div className="flex flex-wrap lg:flex-nowrap gap-3 items-center w-full lg:w-auto justify-end">
        {/* Dropdown Thể loại */}
        <select
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
          disabled={!!keyword.trim()}
          className="w-full sm:w-36 h-[38px] bg-slate-100 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-[#ff8300]/50 transition-all disabled:opacity-50 dark:bg-slate-900/60 dark:border-slate-800/80 dark:text-slate-300"
        >
          {GENRES.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>

        {/* Dropdown Quốc gia */}
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-full sm:w-36 h-[38px] bg-slate-100 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-[#ff8300]/50 transition-all dark:bg-slate-900/60 dark:border-slate-800/80 dark:text-slate-300"
        >
          {COUNTRIES.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>

        {/* Dropdown Năm */}
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full sm:w-28 h-[38px] bg-slate-100 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-[#ff8300]/50 transition-all dark:bg-slate-900/60 dark:border-slate-800/80 dark:text-slate-300"
        >
          {YEARS.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>

        {/* Nút đặt lại */}
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs h-[38px] px-4 rounded-xl transition-all dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-300 w-full sm:w-auto"
          title="Đặt lại bộ lọc"
        >
          <RotateCcw size={14} />
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  );
}
