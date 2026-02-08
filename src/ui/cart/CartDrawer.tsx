"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useCartStore } from "@/src/ui/cart/cartStore";
import CartItemRow from "@/src/ui/cart/CartItemRow";

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const close = useCartStore((state) => state.close);
  const hydrate = useCartStore((state) => state.hydrate);
  const itemsMap = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const storeSlug = useCartStore((state) => state.storeSlug);
  const storeName = useCartStore((state) => state.storeName);
  const items = useMemo(() => Object.values(itemsMap), [itemsMap]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  const label = storeName ?? storeSlug ?? "your store";

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[#efe6da] bg-[#f8f5f0] shadow-[0_20px_50px_rgba(17,24,39,0.2)] transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-[#efe6da] bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#0f1b2d]">Your Cart</h2>
            <p className="text-xs text-[#6b7280]">
              Items from {label}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full border border-[#efe6da] bg-white p-2 text-[#1f2a44] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-[#efe6da] bg-white p-6 text-sm text-[#6b7280]">
              Your cart is empty. Add items to get started.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#efe6da] bg-white px-6 py-5">
          <div className="flex items-center justify-between text-sm font-semibold text-[#1f2a44]">
            <span>Total</span>
            <span>Rs. {subtotal}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#f4c44f] px-5 py-3 text-sm font-semibold text-[#1b2a3b] shadow-sm transition hover:bg-[#f0b93c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b2a3b] focus-visible:ring-offset-2"
          >
            Proceed to Checkout →
          </Link>
        </div>
      </aside>
    </div>
  );
}
