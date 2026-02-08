import Link from "next/link";
import { getStoreHours } from "@/src/config/demoHours";

type StoreCardProps = {
  store: {
    id: number;
    slug: string;
    name: string;
    storeType: string | null;
    sameDayDelivery: boolean;
    deliveryCharges: number | null;
    minOrderValue: number | null;
    freeDeliveryThreshold: number | null;
  };
  location: string;
  deliverable: boolean;
};

function formatCurrency(value: number | null) {
  if (value === null) return "—";
  return `Rs. ${value}`;
}

function formatStoreType(value: string | null) {
  if (!value) return "Store";
  return value.replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export default function StoreCard({ store, location, deliverable }: StoreCardProps) {
  const hours = getStoreHours(store.slug);
  const titleClass = deliverable ? "text-[#0f1b2d]" : "text-[#7b8694]";
  const mutedClass = deliverable ? "text-[#6b7280]" : "text-[#9aa3b2]";
  const valueClass = deliverable ? "text-[#1f2a44]" : "text-[#8f98a6]";

  return (
    <Link
      href={`/stores/${store.slug}`}
      className={`group block rounded-3xl border p-6 shadow-[0_12px_30px_rgba(17,24,39,0.06)] transition ${
        deliverable
          ? "border-[#efe6da] bg-white hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(17,24,39,0.12)]"
          : "border-[#efe6da] bg-[#f5f1eb] text-[#8c93a0]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${titleClass}`}>{store.name}</h3>
          <p className={`mt-1 text-sm ${mutedClass}`}>
            {formatStoreType(store.storeType)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            deliverable
              ? "bg-[#e9f6ec] text-[#1c7f3c]"
              : "bg-[#eceff3] text-[#7b8694]"
          }`}
        >
          {deliverable ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#efe6da] bg-[#fbf8f3] px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-[#8b93a1]">
            Store Hours
          </p>
          <p className={`mt-1 text-sm font-medium ${valueClass}`}>
            {hours.storeHours}
          </p>
        </div>
        <div className="rounded-2xl border border-[#efe6da] bg-[#fbf8f3] px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-[#8b93a1]">
            Delivery Hours
          </p>
          <p className={`mt-1 text-sm font-medium ${valueClass}`}>
            {hours.deliveryHours}
          </p>
        </div>
        <div className="rounded-2xl border border-[#efe6da] bg-[#fbf8f3] px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-[#8b93a1]">
            Delivery Fee
          </p>
          <p className={`mt-1 text-sm font-medium ${valueClass}`}>
            {formatCurrency(store.deliveryCharges)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#efe6da] bg-[#fbf8f3] px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-[#8b93a1]">
            Free Delivery
          </p>
          <p className={`mt-1 text-sm font-medium ${valueClass}`}>
            {store.freeDeliveryThreshold
              ? `Over ${formatCurrency(store.freeDeliveryThreshold)}`
              : "—"}
          </p>
        </div>
      </div>

      <div className={`mt-5 flex items-center justify-between text-sm font-medium ${valueClass}`}>
        <span>
          {deliverable
            ? `Delivers to ${location}`
            : `Unavailable in ${location}`}
        </span>
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#efe6da] transition ${
            deliverable
              ? "text-[#1f2a44] group-hover:bg-[#f4c44f]/20"
              : "text-[#9aa3b2]"
          }`}
        >
          →
        </span>
      </div>
    </Link>
  );
}
