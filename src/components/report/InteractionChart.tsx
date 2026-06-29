import { useState, useEffect } from "react";
import { Heart, MessageSquare } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

// Dữ liệu biểu đồ tương tác bình luận và yêu thích qua 6 tháng
const INTERACTION_CHART_DATA = [
  { name: "Tháng 1", comments: 340, favorites: 520 },
  { name: "Tháng 2", comments: 450, favorites: 680 },
  { name: "Tháng 3", comments: 610, favorites: 900 },
  { name: "Tháng 4", comments: 800, favorites: 1100 },
  { name: "Tháng 5", comments: 950, favorites: 1400 },
  { name: "Tháng 6", comments: 1200, favorites: 1880 },
];

interface InteractionChartProps {
  liveStats: {
    totalComments: number;
    totalFavorites: number;
  };
  loadingStats: boolean;
}

// Component hiển thị biểu đồ tương tác thời gian (Comment & Favorite Growth)
export default function InteractionChart({
  liveStats,
  loadingStats,
}: InteractionChartProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  // Đánh dấu component đã mounted trên client để tránh lỗi hydrations của Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Component Custom Tooltip cho Recharts để hiển thị thông tin đẹp mắt hơn
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs font-sans">
          <p className="text-slate-400 font-bold mb-1.5">{label}</p>
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
              <span className="w-2 h-2 rounded-full bg-[#ff8300]" />
              <span>Yêu thích: {payload[0].value} lượt</span>
            </p>
            <p className="flex items-center gap-1.5 font-bold text-indigo-500">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Bình luận: {payload[1].value} lượt</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:col-span-2 min-w-0 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 flex flex-col justify-between dark:bg-slate-900/40 dark:border-slate-900/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
            <span>Xu hướng tương tác</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold">
              +24% tháng này
            </span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            So sánh số lượt bình luận và lưu yêu thích qua các tháng
          </p>
        </div>

        {/* Hiển thị số liệu thực tế từ API ở đầu chart */}
        <div className="flex items-center gap-5 text-xs font-bold self-start sm:self-auto">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 block font-normal">
              Tổng yêu thích
            </span>
            <span className="text-slate-800 dark:text-white flex items-center gap-1 sm:justify-end">
              <Heart size={12} className="text-[#ff8300] fill-[#ff8300] shrink-0" />
              {loadingStats
                ? "..."
                : liveStats.totalFavorites.toLocaleString("vi-VN")}
            </span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 block font-normal">
              Tổng bình luận
            </span>
            <span className="text-slate-800 dark:text-white flex items-center gap-1 sm:justify-end">
              <MessageSquare size={12} className="text-indigo-500 shrink-0" />
              {loadingStats
                ? "..."
                : liveStats.totalComments.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </div>

      <div className="h-60 w-full min-w-0">
        {mounted ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={INTERACTION_CHART_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="favoriteGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff8300" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ff8300" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="commentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
                className="dark:stroke-slate-800/40"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
              />
              <RechartsTooltip content={<CustomChartTooltip />} />
              <Area
                type="monotone"
                dataKey="favorites"
                stroke="#ff8300"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#favoriteGrad)"
              />
              <Area
                type="monotone"
                dataKey="comments"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#commentGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            Đang tải dữ liệu biểu đồ...
          </div>
        )}
      </div>
    </div>
  );
}
