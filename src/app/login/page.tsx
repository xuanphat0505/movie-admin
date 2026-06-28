"use client";

import { useState, FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/apis/authApi";
import { toast } from "@/utils/toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLoginBtn } from "@/components/common";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

// Component LoginPage hiển thị giao diện đăng nhập Admin
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  // Xử lý sự kiện gửi form đăng nhập
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Gọi API đăng nhập quản trị viên qua đối tượng authApi
      const res = await authApi.login({
        email,
        password,
      });

      if (res.data?.success && res.data?.data) {
        const { accessToken, ...userData } = res.data.data;

        // Lưu Access Token và thông tin cơ bản của admin vào localStorage
        localStorage.setItem("adminToken", accessToken);
        localStorage.setItem("adminUser", JSON.stringify(userData));

        // Chuyển hướng người dùng về trang chủ dashboard
        router.push("/");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      const message =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gửi authorization code lên server để hoàn tất đăng nhập Google
  const handleGoogleLoginSuccess = async (code: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await authApi.googleLogin({ code });
      if (res.data?.success && res.data?.data) {
        const { accessToken, ...userData } = res.data.data;
        localStorage.setItem("adminToken", accessToken);
        localStorage.setItem("adminUser", JSON.stringify(userData));
        toast.success("Đăng nhập bằng tài khoản Google thành công!");
        router.push("/");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập Google:", error);
      const message =
        error.response?.data?.message ||
        "Đăng nhập Google thất bại. Tài khoản của bạn có thể không có quyền admin.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Các vòng tròn phát sáng nền (Glow circles) tạo hiệu ứng chiều sâu */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#ff8300]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern chìm tinh tế */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      {/* Container chính dạng thẻ kính mờ (Glassmorphism Card) */}
      <div className="relative w-full max-w-md p-8 sm:p-10 mx-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl flex flex-col transition-all duration-300">
        {/* Logo và Tiêu đề */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-[#ff8300] to-orange-500 shadow-lg shadow-orange-500/20 mb-4">
            <span className="text-white font-black text-2xl tracking-tighter">
              S
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Stream Lab Admin
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Vui lòng đăng nhập để tiếp tục truy cập trang quản trị hệ thống
          </p>
        </div>

        {/* Khung thông báo lỗi từ server nếu có */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* Form Đăng nhập */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Trường nhập Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Địa chỉ Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#ff8300] transition-colors">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@streamlab.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#ff8300] focus:ring-1 focus:ring-[#ff8300]/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Trường nhập Mật khẩu */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Mật khẩu
              </label>
              <a
                href="#forgot"
                className="text-xs font-semibold text-[#ff8300] hover:text-[#ff8300]/90 transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#ff8300] transition-colors">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#ff8300] focus:ring-1 focus:ring-[#ff8300]/50 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Nhớ mật khẩu */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-800 bg-slate-950/50 text-[#ff8300] focus:ring-[#ff8300]/50 focus:ring-offset-slate-950 cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2.5 text-xs font-semibold text-slate-400 cursor-pointer select-none"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-linear-to-r from-[#ff8300] to-orange-600 hover:from-[#ff8300]/90 hover:to-orange-600/90 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Đăng nhập hệ thống</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Nút đăng nhập Google bổ sung */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-slate-800" />
          <span className="relative px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/60 backdrop-blur-xl">
            Hoặc tiếp tục bằng
          </span>
        </div>

        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLoginBtn
            onLoginSuccess={handleGoogleLoginSuccess}
            onLoginError={(msg) => setErrorMsg(msg)}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
