"use client";

import { useState, FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/apis/authApi";

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
      const message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
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
            <span className="text-white font-black text-2xl tracking-tighter">S</span>
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
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#ff8300] to-orange-600 hover:from-[#ff8300]/90 hover:to-orange-600/90 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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

        <button
          type="button"
          className="w-full py-3 px-4 bg-slate-950/40 hover:bg-slate-950/70 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-800/80 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          {/* Logo Google SVG */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Đăng nhập với Google</span>
        </button>
      </div>
    </div>
  );
}
