import { useState } from "react";
import { Loader2, UserX } from "lucide-react";
import Modal from "@/components/common/Modal";
import { UserType } from "@/app/users/page";
import { userApi } from "@/apis/userApi";
import { toast } from "@/utils/toast";

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToDelete: UserType | null;
  onSuccess: () => void;
}

// Component chứa Modal xác nhận xóa người dùng và thực thi API xóa
export default function UserDeleteModal({
  isOpen,
  onClose,
  userToDelete,
  onSuccess,
}: UserDeleteModalProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Gọi API thực hiện xóa
  const handleDeleteExecute = async () => {
    if (!userToDelete) return;
    setSubmitting(true);
    try {
      const res = await userApi.deleteUser(userToDelete._id);
      if (res.data?.success) {
        toast.success(`Đã xóa tài khoản "${userToDelete.username}" thành công!`);
        onSuccess();
        onClose();
      } else {
        toast.error(res.data?.message || "Xóa người dùng thất bại");
      }
    } catch (error: any) {
      console.error("Lỗi khi xóa người dùng:", error);
      toast.error(error.response?.data?.message || "Lỗi máy chủ khi xóa người dùng");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa tài khoản"
      size="sm"
    >
      <div className="space-y-4 text-xs text-center">
        <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <UserX size={26} />
        </div>
        <div>
          <p className="text-slate-800 dark:text-white font-bold text-sm">
            Bạn có chắc chắn muốn xóa tài khoản này?
          </p>
          <p className="text-slate-400 dark:text-slate-500 mt-1.5">
            Hành động này sẽ xóa vĩnh viễn tài khoản{" "}
            <strong className="text-slate-600 dark:text-slate-350">
              {userToDelete?.username}
            </strong>{" "}
            khỏi hệ thống dữ liệu.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleDeleteExecute}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-sm transition-colors disabled:opacity-40 cursor-pointer"
          >
            {submitting && <Loader2 className="animate-spin" size={14} />}
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
