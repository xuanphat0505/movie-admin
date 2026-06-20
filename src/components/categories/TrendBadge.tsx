import { Flame, Sparkles, TrendingUp } from "lucide-react";

// Xác định nhãn xu hướng động dựa vào số lượng phim
const getTrendBadge = (count: number) => {
  if (count >= 1500) {
    return {
      label: "Thịnh hành",
      colorClass:
        "text-rose-500 bg-rose-500/10 dark:text-rose-450 dark:bg-rose-500/20",
      icon: Flame,
    };
  }
  if (count >= 500) {
    return {
      label: "Phổ biến",
      colorClass:
        "text-blue-500 bg-blue-500/10 dark:text-blue-440 dark:bg-blue-500/20",
      icon: TrendingUp,
    };
  }
  return {
    label: "Mới",
    colorClass:
      "text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800/80",
    icon: Sparkles,
  };
};

// Component hiển thị nhãn xu hướng mượt mà
export default function TrendBadge({ count }: { count: number }) {
  const badge = getTrendBadge(count);
  const BadgeIcon = badge.icon;
  return (
    <div
      className={`flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${badge.colorClass}`}
    >
      <BadgeIcon size={10} />
      <span>{badge.label}</span>
    </div>
  );
}
