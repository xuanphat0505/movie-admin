import { Loader2, Shield } from "lucide-react";

interface MfaInactiveStateProps {
  loading: boolean;
  onSetup: () => void;
}

// Component hiển thị giao diện khi xác thực 2 lớp chưa được kích hoạt
export default function MfaInactiveState({
  loading,
  onSetup,
}: MfaInactiveStateProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-2xl">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-orange-50 dark:bg-orange-950/30 text-[#ff8300] rounded-xl border border-orange-100 dark:border-orange-900/20">
          <Shield size={24} />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">Bảo mật tài khoản nâng cao</h4>
          <p className="text-[10.5px] text-slate-500 leading-relaxed">
            Kích hoạt ứng dụng xác thực như Google Authenticator để tạo lớp khóa OTP bổ sung cho tài khoản của bạn, tránh rò rỉ mật khẩu.
          </p>
          <div className="pt-3">
            <button
              type="button"
              disabled={loading}
              onClick={onSetup}
              className="flex items-center gap-1.5 bg-[#ff8300] hover:bg-[#e07300] text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Shield size={13} />}
              Thiết lập bảo mật 2 lớp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
