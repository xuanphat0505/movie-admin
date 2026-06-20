import { Tags } from "lucide-react";

export default function CategoryHeader() {
  return (
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
  );
}
