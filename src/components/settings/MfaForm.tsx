import React, { useState } from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { authApi } from "@/apis/authApi";
import { toast } from "@/utils/toast";
import MfaInactiveState from "./MfaInactiveState";
import MfaSetupForm from "./MfaSetupForm";
import MfaActiveState from "./MfaActiveState";

interface MfaFormProps {
  currentAdmin: any;
  onProfileUpdate?: (updatedAdmin: any) => void;
}

// Component chính quản lý xác thực 2 lớp (MFA/2FA) của quản trị viên
export default function MfaForm({
  currentAdmin,
  onProfileUpdate,
}: MfaFormProps) {
  const [loadingMfa, setLoadingMfa] = useState<boolean>(false);
  const [mfaSecret, setMfaSecret] = useState<string>("");
  const [mfaQrCode, setMfaQrCode] = useState<string>("");
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const [showDisableForm, setShowDisableForm] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Lấy trạng thái kích hoạt MFA của admin
  const isMfaEnabled = currentAdmin?.isMfaEnabled || false;

  // Thực hiện sao chép mã bí mật thủ công vào bộ nhớ tạm
  const handleCopySecret = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Đã sao chép khóa bí mật!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Gọi API sinh mã QR và Secret Key để bắt đầu thiết lập 2FA
  const handleSetupMfa = async () => {
    setLoadingMfa(true);
    try {
      const res = await authApi.mfaSetup();
      if (res.data?.success) {
        setMfaSecret(res.data.data.secret);
        setMfaQrCode(res.data.data.qrCodeUrl);
        setShowSetup(true);
      }
    } catch (error: any) {
      console.error("Lỗi cấu hình MFA:", error);
      toast.error(error.response?.data?.message || "Lỗi khởi tạo thiết lập 2FA!");
    } finally {
      setLoadingMfa(false);
    }
  };

  // Xác nhận mã OTP 6 số để kích hoạt chính thức 2FA
  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 chữ số mã xác thực!");
      return;
    }

    setLoadingMfa(true);
    try {
      const res = await authApi.mfaVerify({ token: otpCode, secret: mfaSecret });
      if (res.data?.success) {
        toast.success("Kích hoạt xác thực 2 lớp thành công!");
        setShowSetup(false);
        setOtpCode("");
        setMfaSecret("");
        setMfaQrCode("");
        
        // Đồng bộ dữ liệu cập nhật trạng thái người dùng
        if (onProfileUpdate) {
          onProfileUpdate({
            ...currentAdmin,
            isMfaEnabled: true,
          });
        }
      }
    } catch (error: any) {
      console.error("Lỗi xác minh MFA:", error);
      toast.error(error.response?.data?.message || "Mã xác thực không hợp lệ!");
    } finally {
      setLoadingMfa(false);
    }
  };

  // Gửi yêu cầu vô hiệu hóa 2FA kèm mã OTP xác thực
  const handleDisableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 chữ số mã xác thực!");
      return;
    }

    setLoadingMfa(true);
    try {
      const res = await authApi.mfaDisable({ token: otpCode });
      if (res.data?.success) {
        toast.success("Đã tắt xác thực 2 lớp thành công!");
        setShowDisableForm(false);
        setOtpCode("");
        
        // Đồng bộ dữ liệu hủy bỏ trạng thái MFA
        if (onProfileUpdate) {
          onProfileUpdate({
            ...currentAdmin,
            isMfaEnabled: false,
          });
        }
      }
    } catch (error: any) {
      console.error("Lỗi hủy kích hoạt MFA:", error);
      toast.error(error.response?.data?.message || "Mã xác thực không hợp lệ!");
    } finally {
      setLoadingMfa(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
          Xác thực 2 lớp (2FA - TOTP)
          {isMfaEnabled ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-250 dark:border-emerald-900/40">
              <ShieldCheck size={11} /> Đã bật
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-0.5 rounded-full border border-rose-250 dark:border-rose-900/40">
              <ShieldAlert size={11} /> Chưa bật
            </span>
          )}
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Bảo vệ tài khoản quản trị viên bằng cách yêu cầu mã xác thực dùng một lần mỗi khi thực hiện đăng nhập qua Email.
        </p>
      </div>

      {/* Trạng thái 2FA chưa kích hoạt */}
      {!isMfaEnabled && !showSetup && (
        <MfaInactiveState loading={loadingMfa} onSetup={handleSetupMfa} />
      )}

      {/* Luồng giao diện thiết lập QR Code */}
      {!isMfaEnabled && showSetup && (
        <MfaSetupForm
          qrCode={mfaQrCode}
          secret={mfaSecret}
          otpCode={otpCode}
          loading={loadingMfa}
          copied={copied}
          onCopySecret={handleCopySecret}
          onOtpChange={setOtpCode}
          onVerify={handleVerifyMfa}
          onCancel={() => {
            setShowSetup(false);
            setMfaSecret("");
            setMfaQrCode("");
            setOtpCode("");
          }}
        />
      )}

      {/* Trạng thái 2FA đã kích hoạt */}
      {isMfaEnabled && (
        <MfaActiveState
          showDisableForm={showDisableForm}
          loading={loadingMfa}
          otpCode={otpCode}
          onToggleDisableForm={setShowDisableForm}
          onOtpChange={setOtpCode}
          onDisable={handleDisableMfa}
        />
      )}
    </div>
  );
}
