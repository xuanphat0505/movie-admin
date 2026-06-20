"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

// Component CategoryChart hiển thị thống kê phân bố giới tính người dùng dạng biểu đồ tròn khuyết
export default function CategoryChart() {
  const [mounted, setMounted] = useState(false);
  const [genderData, setGenderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dominantGender, setDominantGender] = useState({ name: "N/A", percentage: 0 });

  // Chỉ kích hoạt gọi API và vẽ biểu đồ sau khi component đã mount trên client
  useEffect(() => {
    setMounted(true);

    const fetchGenderStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${apiUrl}/analytics/gender-stats`);
        const result = await res.json();

        if (result?.success && result?.data) {
          const { male, female, other } = result.data;
          const total = male + female + other;

          if (total > 0) {
            const malePct = Math.round((male / total) * 100);
            const femalePct = Math.round((female / total) * 100);
            const otherPct = 100 - malePct - femalePct; // Bảo đảm tổng phần trăm là 100%

            const data = [
              { name: "Nam", value: malePct, count: male, color: "#38bdf8" },
              { name: "Nữ", value: femalePct, count: female, color: "#f43f5e" },
              { name: "Khác", value: otherPct, count: other, color: "#64748b" },
            ];

            setGenderData(data);

            // Tìm giới tính có tỉ lệ cao nhất để hiển thị ở trung tâm
            const dominant = data.reduce((max, item) => (item.value > max.value ? item : max), data[0]);
            setDominantGender({ name: dominant.name, percentage: dominant.value });
          } else {
            setGenderData([
              { name: "Nam", value: 0, count: 0, color: "#38bdf8" },
              { name: "Nữ", value: 0, count: 0, color: "#f43f5e" },
              { name: "Khác", value: 0, count: 0, color: "#64748b" },
            ]);
            setDominantGender({ name: "N/A", percentage: 0 });
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê giới tính:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderStats();
  }, []);

  return (
    <div className="min-w-[300px] p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden dark:bg-slate-900/40 dark:border-slate-900/60 dark:shadow-none">
      {/* Tiêu đề biểu đồ */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
          Users by Gender
        </h3>
      </div>

      {/* Biểu đồ tròn khuyết (Pie Chart) với nhãn ở trung tâm */}
      <div className="relative h-48 w-full flex items-center justify-center">
        {!mounted || loading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#ff8300]" size={24} />
            <span className="text-xs text-slate-400">Loading chart...</span>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={192}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Nhãn thống kê trung tâm hiển thị giới tính trội nhất */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                {dominantGender.percentage}%
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                {dominantGender.name}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Danh sách chú giải màu sắc và số lượng */}
      <div className="flex flex-col gap-2.5 mt-2">
        {!loading &&
          genderData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span>{item.name}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                  ({item.count} user)
                </span>
              </div>
              <span className="text-slate-800 dark:text-white">
                {item.value}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
