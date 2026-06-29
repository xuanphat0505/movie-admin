import { Tags, Globe, Search } from "lucide-react";

interface CategoryTabProps {
  activeTab: "genres" | "countries";
  setActiveTab: (tab: "genres" | "countries") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  genresCount: number;
  countriesCount: number;
}

// Component chứa tab điều hướng thể loại/quốc gia và thanh tìm kiếm tương ứng
export default function CategoryTab({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  genresCount,
  countriesCount,
}: CategoryTabProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      {/* Tabs điều hướng */}
      <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/40 dark:border-slate-850/60 self-start">
        <button
          onClick={() => {
            setActiveTab("genres");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "genres"
              ? "bg-[#ff8300] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Tags size={14} className="shrink-0" />
          <span className="hidden sm:inline">Thể loại phim ({genresCount})</span>
          <span className="inline sm:hidden">Thể loại</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("countries");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "countries"
              ? "bg-[#ff8300] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Globe size={14} className="shrink-0" />
          <span className="hidden sm:inline">Quốc gia sản xuất ({countriesCount})</span>
          <span className="inline sm:hidden">Quốc gia</span>
        </button>
      </div>

      {/* Thanh tìm kiếm nhanh */}
      <div className="relative w-full sm:w-80">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          size={16}
        />
        <input
          type="text"
          placeholder={
            activeTab === "genres" ? "Tìm thể loại..." : "Tìm quốc gia..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-250 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl h-[38px] pl-10 pr-4 text-xs text-slate-800 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-550 focus:outline-none focus:border-[#ff8300]/50 transition-all"
        />
      </div>
    </div>
  );
}