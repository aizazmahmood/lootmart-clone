"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SortOption, ViewMode } from "@/src/ui/store/types";
import { Button } from "@/src/ui/primitives/Button";
import { Card } from "@/src/ui/primitives/Card";

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
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();

  const options: { value: SortOption; label: string }[] = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (buttonRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const activeLabel =
    options.find((option) => option.value === sort)?.label ?? "Relevance";

  return (
    <Card className="flex flex-col gap-4 p-4 shadow-[0_12px_30px_rgba(17,24,39,0.06)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={view === "grid" ? "primary" : "secondary"}
          size="sm"
          onClick={() => onViewChange("grid")}
          aria-pressed={view === "grid"}
          className="gap-2"
        >
          <span className="h-2.5 w-2.5 rounded-sm bg-current" />
          Grid
        </Button>
        <Button
          type="button"
          variant={view === "list" ? "primary" : "secondary"}
          size="sm"
          onClick={() => onViewChange("list")}
          aria-pressed={view === "list"}
          className="gap-2"
        >
          <span className="h-2.5 w-2.5 rounded-full border border-current" />
          List
        </Button>
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

      <div className="relative flex items-center gap-3">
        <span className="text-sm font-medium text-[#4b5563]">Sort</span>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          className="inline-flex min-w-[180px] items-center justify-between gap-3 rounded-full border border-[#e6dccf] bg-white px-5 py-2.5 text-sm font-semibold leading-none text-[#1f2a44] shadow-[0_6px_16px_rgba(17,24,39,0.08)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
        >
          <span className="truncate">{activeLabel}</span>
          <span className="flex h-4 w-4 items-center justify-center text-[#7b8794]">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path d="M5.3 7.5a1 1 0 0 1 1.4 0L10 10.8l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
            </svg>
          </span>
        </button>

        {open ? (
          <div
            ref={panelRef}
            className="absolute right-0 top-full z-20 mt-2 min-w-[220px] rounded-2xl border border-[#efe6da] bg-white p-2 shadow-[0_18px_30px_rgba(17,24,39,0.12)]"
          >
            <div id={listboxId} role="listbox" aria-label="Sort products">
              {options.map((option) => {
                const isActive = option.value === sort;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onSortChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f] ${
                      isActive
                        ? "bg-[#fef3d2] text-[#1b2a3b]"
                        : "text-[#4b5563] hover:bg-[#f7f1e7]"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isActive ? (
                      <span className="text-[#a2771d]">●</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
