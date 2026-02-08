"use client";

import { useCartStore } from "@/src/ui/cart/cartStore";

export default function CartButton() {
  const totalItems = useCartStore((state) => state.totalItems);
  const toggle = useCartStore((state) => state.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e6dccf] bg-white text-[#1f2a44] shadow-sm transition hover:bg-[#f7f1e7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
      aria-label="Open cart"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M3 6h2l2.5 11h9.5l2-7H7.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="19" r="1.2" />
        <circle cx="17" cy="19" r="1.2" />
      </svg>
      {totalItems > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f4c44f] px-1 text-[10px] font-semibold text-[#1b2a3b]">
          {totalItems}
        </span>
      ) : null}
    </button>
  );
}
