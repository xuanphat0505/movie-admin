import { Loader2, ShieldCheck } from "lucide-react";
import { FormEvent } from "react";

interface MfaActiveStateProps {
  showDisableForm: boolean;
  loading: boolean;
  otpCode: string;
  onToggleDisableForm: (show: boolean) => void;
  onOtpChange: (code: string) => void;
  onDisable: (e: FormEvent) => void;
}

// Component hiển thị trạng thái hoạt động của 2FA và xử lý vô hiệu hóa
export default function MfaActiveState({
  showDisableForm,
  loading,
  otpCode,
  onToggleDisableForm,
  onOtpChange,
  onDisable,
}: MfaActiveStateProps) {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">Bảo vệ tài khoản hoàn tất</h4>
            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              Xác thực hai lớp (2FA/TOTP) đang hoạt động bình thường trên tài khoản của bạn. Mọi hành động đăng nhập qua Email sẽ bắt buộc phải nhập mã số xác thực dùng một lần để đảm bảo an toàn tuyệt đối.
            </p>
            
            {!showDisableForm && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => onToggleDisableForm(true)}
                  className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Hủy kích hoạt bảo mật 2 lớp
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Giao diện nhập mã OTP để hủy kích hoạt 2FA */}
      {showDisableForm && (
        <div className="bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl p-5 space-y-4">
          <div>
            <h4 className="font-bold text-rose-500 text-[12px]">Hủy kích hoạt xác thực hai lớp</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Hành động này sẽ hạ thấp mức độ an toàn bảo mật cho tài khoản quản trị của bạn. Vui lòng nhập mã OTP hiện tại để xác thực hành động.
            </p>
          </div>

          <form onSubmit={onDisable} className="max-w-xs space-y-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mã xác thực OTP *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 font-bold tracking-widest text-sm focus:outline-none focus:border-[#ff8300] transition-colors"
                placeholder="000000"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-40 text-center"
              >
                {loading ? <Loader2 size={13} className="animate-spin inline" /> : "Xác nhận hủy"}
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleDisableForm(false);
                  onOtpChange("");
                }}
                className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer text-center"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
