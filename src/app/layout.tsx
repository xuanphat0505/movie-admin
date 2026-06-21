import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SocketProvider } from "@/context/SocketContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

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
    <html lang="vi" className={`${inter.variable} h-full antialiased dark`} suppressHydrationWarning>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
