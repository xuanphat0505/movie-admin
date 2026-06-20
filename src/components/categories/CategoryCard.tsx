import { ArrowRight, Globe, Tags } from "lucide-react";
import { TrendBadge } from "@/components/categories";
import Link from "next/link";

interface CategoryCardProps {
  item: {
    slug: string;
    name: string;
    count: number;
    percentage: number;
  };
  activeTab: string;
  redirectUrl: string;
}

export default function CategoryCard({
  item,
  activeTab,
  redirectUrl,
}: CategoryCardProps) {
  return (
    <div
      key={item.slug}
      className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-[#ff8300]/30 dark:bg-slate-900/40 dark:border-slate-900/60 dark:hover:border-[#ff8300]/30 transition-all duration-300 shadow-sm flex flex-col justify-between"
    >
      <div>
        {/* Icon nổi và thông tin tên danh mục */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-9 h-9 rounded-xl bg-slate-100/80 flex items-center justify-center dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 group-hover:bg-[#ff8300]/10 group-hover:text-[#ff8300] transition-colors">
            {activeTab === "genres" ? <Tags size={16} /> : <Globe size={16} />}
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
}
