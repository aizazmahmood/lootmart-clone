"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/src/ui/cart/cartStore";

export default function StickyCheckoutBar() {
  const pathname = usePathname();
  const router = useRouter();
  const totalItems = useCartStore((state) => state.totalItems);
  const subtotal = useCartStore((state) => state.subtotal);

  if (!pathname.startsWith("/stores/") || totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#efe6da] bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(17,24,39,0.12)] backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#1f2a44]">
            Proceed to Checkout
          </p>
          <p className="text-xs text-[#6b7280]">Rs. {subtotal}</p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/checkout")}
          className="inline-flex items-center gap-2 rounded-full bg-[#f4c44f] px-5 py-2 text-sm font-semibold text-[#1b2a3b] shadow-sm transition hover:bg-[#f0b93c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b2a3b] focus-visible:ring-offset-2"
        >
          Checkout →
        </button>
      </div>
    </div>
  );
}
