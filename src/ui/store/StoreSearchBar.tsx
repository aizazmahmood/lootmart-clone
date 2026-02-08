"use client";

const POPULAR_CHIPS = [
  "Bread",
  "Eggs",
  "Milk",
  "Tea",
  "Cookies",
  "Chocolate",
  "Cooking Oil",
  "Chicken",
];

type StoreSearchBarProps = {
  storeName: string;
  query: string;
  onQueryChange: (value: string) => void;
};

export default function StoreSearchBar({
  storeName,
  query,
  onQueryChange,
}: StoreSearchBarProps) {
  return (
    <div className="rounded-3xl border border-[#efe6da] bg-white p-6 shadow-[0_12px_30px_rgba(17,24,39,0.08)]">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#0f1b2d]">
            Find products quickly in {storeName}
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Search your essentials and discover what’s available today.
          </p>
        </div>

        <label className="relative flex items-center">
          <span className="sr-only">Search products</span>
          <span className="pointer-events-none absolute left-4 text-[#9aa3b2]">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={`Search products in ${storeName}...`}
            className="h-12 w-full rounded-full border border-[#e6dccf] bg-[#fbf8f3] pl-12 pr-4 text-sm text-[#1f2a44] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {POPULAR_CHIPS.map((chip) => {
            const active = chip.toLowerCase() === query.toLowerCase();
            return (
              <button
                key={chip}
                type="button"
                onClick={() => onQueryChange(chip)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f] ${
                  active
                    ? "border-[#f4c44f] bg-[#fef3d2] text-[#1b2a3b]"
                    : "border-[#efe6da] bg-white text-[#6b7280] hover:bg-[#f7f1e7]"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <div className="text-sm font-semibold text-[#1f2a44]">
          {query.trim().length > 0
            ? `Search Results for '${query.trim()}'`
            : "Popular Products"}
        </div>
      </div>
    </div>
  );
}
