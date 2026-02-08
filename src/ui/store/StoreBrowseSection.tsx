"use client";

import { useState } from "react";
import StoreSearchBar from "@/src/ui/store/StoreSearchBar";
import StoreFilters from "@/src/ui/store/StoreFilters";
import ProductGrid from "@/src/ui/store/ProductGrid";
import type { SortOption, ViewMode } from "@/src/ui/store/types";

type StoreBrowseSectionProps = {
  storeSlug: string;
  storeName: string;
};

export default function StoreBrowseSection({
  storeSlug,
  storeName,
}: StoreBrowseSectionProps) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("relevance");

  return (
    <section className="flex flex-col gap-6">
      <StoreSearchBar storeName={storeName} query={query} onQueryChange={setQuery} />
      <StoreFilters
        view={view}
        onViewChange={setView}
        inStockOnly={inStockOnly}
        onInStockChange={setInStockOnly}
        sort={sort}
        onSortChange={setSort}
      />
      <ProductGrid
        storeSlug={storeSlug}
        query={query}
        inStockOnly={inStockOnly}
        sort={sort}
        view={view}
      />
    </section>
  );
}
