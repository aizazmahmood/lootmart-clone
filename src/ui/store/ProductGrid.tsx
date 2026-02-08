"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ProductItem, ProductsResponse, SortOption, ViewMode } from "@/src/ui/store/types";
import ProductCard from "@/src/ui/store/ProductCard";

type ProductGridProps = {
  storeSlug: string;
  storeName?: string;
  query: string;
  inStockOnly: boolean;
  sort: SortOption;
  view: ViewMode;
};

type FetchState = {
  items: ProductItem[];
  nextCursor: number | null;
};

const DEFAULT_LIMIT = 24;

export default function ProductGrid({
  storeSlug,
  storeName,
  query,
  inStockOnly,
  sort,
  view,
}: ProductGridProps) {
  const [state, setState] = useState<FetchState>({ items: [], nextCursor: null });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const baseParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("storeSlug", storeSlug);
    params.set("limit", String(DEFAULT_LIMIT));
    if (query.trim()) params.set("q", query.trim());
    if (inStockOnly) params.set("inStock", "1");
    if (sort) params.set("sort", sort);
    return params;
  }, [storeSlug, query, inStockOnly, sort]);

  const fetchProducts = useCallback(
    async (cursor: number | null, append: boolean, requestId: number) => {
      const params = new URLSearchParams(baseParams);
      if (cursor) params.set("cursor", String(cursor));

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = (await response.json()) as ProductsResponse;

      if (requestId !== requestIdRef.current) return;
      setState((prev) => ({
        items: append ? [...prev.items, ...data.items] : data.items,
        nextCursor: data.nextCursor,
      }));
    },
    [baseParams],
  );

  useEffect(() => {
    let active = true;
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;

    setLoading(true);
    setError(null);
    setState({ items: [], nextCursor: null });

    fetchProducts(null, false, requestId)
      .catch((err: unknown) => {
        if (!active || requestId !== requestIdRef.current) return;
        setError(err instanceof Error ? err.message : "Failed to load products");
      })
      .finally(() => {
        if (!active || requestId !== requestIdRef.current) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchProducts]);

  const handleLoadMore = async () => {
    if (!state.nextCursor || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    const requestId = requestIdRef.current;
    try {
      await fetchProducts(state.nextCursor, true, requestId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  };

  const gridClasses =
    view === "grid"
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      : "flex flex-col gap-4";

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <div className={gridClasses}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className={`rounded-2xl border border-[#efe6da] bg-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.06)] ${
                view === "grid" ? "h-64" : "h-32"
              } animate-pulse`}
            />
          ))}
        </div>
      ) : state.items.length === 0 ? (
        <div className="rounded-2xl border border-[#efe6da] bg-white p-6 text-sm text-[#6b7280]">
          No products found. Try adjusting your search or filters.
        </div>
      ) : (
        <div className={gridClasses}>
          {state.items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              view={view}
              storeSlug={storeSlug}
              storeName={storeName}
            />
          ))}
        </div>
      )}

      {error ? (
        <div className="rounded-2xl border border-[#f1c2c2] bg-[#fff5f5] p-4 text-sm text-[#b42318]">
          {error}
        </div>
      ) : null}

      {state.nextCursor ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="rounded-full bg-[#f4c44f] px-6 py-3 text-sm font-semibold text-[#1b2a3b] shadow-sm transition hover:bg-[#f0b93c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
