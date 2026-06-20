"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";

const weeklyData = [
  { name: "MON", views: 420 },
  { name: "TUE", views: 680 },
  { name: "WED", views: 590 },
  { name: "THU", views: 810 },
  { name: "FRI", views: 730 },
  { name: "SAT", views: 1050 },
  { name: "SUN", views: 920 },
];
// Component hiển thị Custom Tooltip cho cả 2 chế độ Sáng/Tối
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-lg">
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">{label}</p>
        <p className="text-slate-800 dark:text-white font-bold text-sm">
          {payload[0].value} views
        </p>
      </div>
    );
  }
  return null;
};

// Component ViewsChart hiển thị biểu đồ cột lượng truy cập hàng tuần với hiệu ứng gradient
export default function ViewsChart() {
  const [activeTab, setActiveTab] = useState<"7d" | "30d">("30d");
  const [mounted, setMounted] = useState(false);

  // Chỉ kích hoạt vẽ biểu đồ sau khi component đã mount trên client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 min-w-0 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900/40 dark:border-slate-900/60 dark:shadow-none">
      {/* Header chart */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
            Weekly Traffic & Movie Views
          </h3>
          <span className="text-xs text-slate-500">Real-time engagement tracking</span>
        </div>

        {/* Tab filters */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab("7d")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "7d"
                ? "bg-[#ff8300] text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setActiveTab("30d")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "30d"
                ? "bg-[#ff8300] text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-64 w-full min-w-0">
        {mounted ? (
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff8300" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#ff8300" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                dy={10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
              />
              <Bar
                dataKey="views"
                fill="url(#viewsGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            Loading chart...
          </div>
        )}
      </div>
    </div>
  );
}
