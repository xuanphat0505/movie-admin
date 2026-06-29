import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Bắt buộc phải tắt tối ưu hóa ảnh khi dùng static export
  }
};

export default nextConfig;
