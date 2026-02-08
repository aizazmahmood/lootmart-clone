"use client";

import type { SortOption, ViewMode } from "@/src/ui/store/types";

type StoreFiltersProps = {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  inStockOnly: boolean;
  onInStockChange: (next: boolean) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
};

export default function StoreFilters({
  view,
  onViewChange,
  inStockOnly,
  onInStockChange,
  sort,
  onSortChange,
}: StoreFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#efe6da] bg-white p-4 shadow-[0_12px_30px_rgba(17,24,39,0.06)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onViewChange("grid")}
          aria-pressed={view === "grid"}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f] ${
            view === "grid"
              ? "border-[#f4c44f] bg-[#fef3d2] text-[#1b2a3b]"
              : "border-[#efe6da] text-[#6b7280] hover:bg-[#f7f1e7]"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-sm bg-current" />
          Grid
        </button>
        <button
          type="button"
          onClick={() => onViewChange("list")}
          aria-pressed={view === "list"}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f] ${
            view === "list"
              ? "border-[#f4c44f] bg-[#fef3d2] text-[#1b2a3b]"
              : "border-[#efe6da] text-[#6b7280] hover:bg-[#f7f1e7]"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full border border-current" />
          List
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-[#4b5563]">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(event) => onInStockChange(event.target.checked)}
          className="h-4 w-4 rounded border-[#d8cfc2] text-[#f4c44f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
        />
        In stock only
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-[#4b5563]">
        Sort
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="h-10 rounded-full border border-[#e6dccf] bg-white px-3 text-sm text-[#1f2a44] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
        >
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </label>
    </div>
  );
}
