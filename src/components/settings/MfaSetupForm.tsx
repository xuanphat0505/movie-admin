import { Loader2, Copy, Check, ShieldCheck } from "lucide-react";
import { FormEvent } from "react";

interface MfaSetupFormProps {
  qrCode: string;
  secret: string;
  otpCode: string;
  loading: boolean;
  copied: boolean;
  onCopySecret: (text: string) => void;
  onOtpChange: (code: string) => void;
  onVerify: (e: FormEvent) => void;
  onCancel: () => void;
}

// Component hiển thị biểu mẫu quét mã QR và nhập mã xác thực kích hoạt 2FA
export default function MfaSetupForm({
  qrCode,
  secret,
  otpCode,
  loading,
  copied,
  onCopySecret,
  onOtpChange,
  onVerify,
  onCancel,
}: MfaSetupFormProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-2xl space-y-5">
      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">Cấu hình xác thực hai lớp</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Cột hiển thị QR code */}
        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
          {qrCode ? (
            <img src={qrCode} alt="MFA QR Code" className="w-40 h-40 object-contain" />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl">
              <Loader2 className="animate-spin text-slate-400" />
            </div>
          )}
          <p className="text-[9.5px] text-slate-400 mt-2 text-center font-medium">Quét mã QR bằng Google Authenticator</p>
        </div>

        {/* Cột hiển thị Key dự phòng và Biểu mẫu kiểm tra */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Hoặc tự nhập mã thủ công:</span>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2.5">
              <code className="flex-1 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 break-all select-all">{secret}</code>
              <button
                type="button"
                onClick={() => onCopySecret(secret)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <form onSubmit={onVerify} className="space-y-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                Nhập mã xác thực 6 số kích hoạt *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl py-2.5 font-bold tracking-widest text-sm focus:outline-none focus:border-[#ff8300] transition-colors"
                placeholder="Nhập 6 số"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#ff8300] hover:bg-[#e07300] text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-40"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                Kích hoạt
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer text-center"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
