import { Film, Plus } from "lucide-react";
import { PageHeader } from "@/components/common";

interface MovieHeaderProps {
  onOpenAddModal?: () => void;
}

// Component hiển thị phần đầu trang quản lý phim, sử dụng PageHeader dùng chung
export default function MovieHeader({ onOpenAddModal }: MovieHeaderProps) {
  const actionButton = (
    <button
      onClick={onOpenAddModal}
      className="bg-[#ff8300] hover:bg-[#ff8300]/90 text-white font-semibold text-xs py-2.5 px-4.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-[#ff8300]/10 cursor-pointer w-fit"
    >
      <Plus size={16} />
      <span>Thêm phim mới</span>
    </button>
  );

  return (
    <PageHeader
      title="Quản lý danh sách phim"
      description="Duyệt, tìm kiếm và kiểm duyệt nguồn phim trực tiếp từ hệ sinh thái KKPhim API."
      icon={Film}
      actionButton={actionButton}
    />
  );
}
