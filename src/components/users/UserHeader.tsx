import { Users, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/common";

// Component hiển thị tiêu đề trang quản lý người dùng
export default function UserHeader({
  handleOpenAddModal,
}: {
  handleOpenAddModal: () => void;
}) {
  const actionButton = (
    <button
      onClick={handleOpenAddModal}
      className="flex items-center gap-2 bg-[#ff8300] hover:bg-[#e07300] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
    >
      <UserPlus size={15} />
      <span>Thêm tài khoản</span>
    </button>
  );

  return (
    <PageHeader
      title="Quản lý người dùng"
      description="Xem danh sách thành viên, cập nhật thông tin chi tiết và phân quyền tài khoản quản trị viên."
      icon={Users}
      actionButton={actionButton}
    />
  );
}
