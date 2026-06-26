import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SocketProvider } from "@/context/SocketContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Stream-Lab Admin Dashboard",
  description: "Trang quản trị website xem phim Stream-Lab",
};

// Layout gốc cho trang quản trị, cấu hình font Inter và bọc các context provider cần thiết
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('admin-theme');
                  if (savedTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full font-sans bg-[#08080a] text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          <SocketProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </SocketProvider>
          <Toaster
            theme="dark"
            position="top-center"
            closeButton
            toastOptions={{
              classNames: {
                toast: "bg-[#0d0d12]/90 border border-slate-800/60 backdrop-blur-md text-slate-200 rounded-xl p-4 shadow-2xl flex items-center gap-3 font-sans text-xs",
                title: "font-bold text-slate-200",
                description: "text-slate-400 text-[10px]",
                success: "!border-emerald-500/20 !text-emerald-400",
                error: "!border-rose-500/20 !text-rose-400",
                warning: "!border-amber-500/20 !text-amber-400",
                info: "!border-blue-500/20 !text-blue-400",
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
