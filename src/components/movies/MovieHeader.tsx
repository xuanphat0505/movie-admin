import { Film } from "lucide-react";

export default function MovieHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Film className="text-[#ff8300]" size={24} />
          <span>Quản lý danh sách phim</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
          Duyệt, tìm kiếm và kiểm duyệt nguồn phim trực tiếp từ hệ sinh thái
          KKPhim API.
        </p>
      </div>
    </div>
  );
}
