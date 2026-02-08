"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "@/src/ui/cart/cartStore";
import CartItemRow from "@/src/ui/cart/CartItemRow";
import { Button } from "@/src/ui/primitives/Button";
import { Card } from "@/src/ui/primitives/Card";

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const close = useCartStore((state) => state.close);
  const hydrate = useCartStore((state) => state.hydrate);
  const itemsMap = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const storeSlug = useCartStore((state) => state.storeSlug);
  const storeName = useCartStore((state) => state.storeName);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useMemo(() => Object.values(itemsMap), [itemsMap]);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isOpen) return;
    lastActiveRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      lastActiveRef.current?.focus();
    };
  }, [close, isOpen]);

  if (!isOpen) {
    return null;
  }

  const label = hasHydrated ? storeName ?? storeSlug ?? "your store" : "your store";
  const checkoutHref = storeSlug
    ? `/checkout?store=${encodeURIComponent(storeSlug)}`
    : "/checkout";

  return (
    <div className="fixed inset-0 z-50" aria-hidden={!isOpen}>
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
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-[#efe6da] bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#0f1b2d]">Your Cart</h2>
            <p className="text-xs text-[#6b7280]">
              Items from {label}
            </p>
          </div>
          <Button
            type="button"
            onClick={close}
            variant="secondary"
            size="sm"
            className="h-9 w-9 rounded-full p-0"
            aria-label="Close cart"
            ref={closeButtonRef}
          >
            ✕
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!hasHydrated || items.length === 0 ? (
            <Card className="p-6 text-sm text-[#6b7280]">
              Your cart is empty. Add items to get started.
            </Card>
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
            <span>Rs. {hasHydrated ? subtotal : 0}</span>
          </div>
          <Button asChild className="mt-4 w-full">
            <Link href={checkoutHref}>Proceed to Checkout →</Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}
