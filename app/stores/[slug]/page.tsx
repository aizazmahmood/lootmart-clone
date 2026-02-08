import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { getStoreHours } from "@/src/config/demoHours";
import StoreBrowseSection from "@/src/ui/store/StoreBrowseSection";
import CartButton from "@/src/ui/cart/CartButton";
import StickyCheckoutBar from "@/src/ui/cart/StickyCheckoutBar";

export const runtime = "nodejs";
export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug?: string }> | { slug?: string };
};

export default async function StorePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams.slug === "string" ? resolvedParams.slug : "";

  if (!slug) {
    notFound();
  }

  const store = await prisma.store.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      storeType: true,
      deliveryCharges: true,
      freeDeliveryThreshold: true,
    },
  });

  if (!store) {
    notFound();
  }

  const hours = getStoreHours(store.slug);

  const featuredProducts = await prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: { id: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      price: true,
      currency: true,
      primaryImagePath: true,
      primaryImageUrl: true,
      brand: { select: { name: true } },
    },
  });

  const formatCurrency = (value: number | null) => {
    if (value === null) return "—";
    return `Rs. ${value}`;
  };

  const formatStoreType = (value: string | null) => {
    if (!value) return "Store";
    return value.replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] font-sans text-[#0f1b2d]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-32 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-[#a2771d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
          >
            ← Back to home
          </Link>
          <div className="flex flex-col gap-4 rounded-3xl border border-[#efe6da] bg-white p-6 shadow-[0_12px_30px_rgba(17,24,39,0.08)] md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#9aa3b2]">
                Welcome to
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#0f1b2d] sm:text-4xl">
                {store.name}
              </h1>
              <p className="mt-2 text-sm text-[#6b7280]">
                {formatStoreType(store.storeType)} · Fresh groceries delivered fast.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-[#e9f6ec] px-4 py-1.5 text-xs font-semibold text-[#1c7f3c]">
                Available
              </span>
              <CartButton />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#efe6da] bg-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.06)]">
              <p className="text-xs uppercase tracking-wide text-[#9aa3b2]">
                Store Hours
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1f2a44]">
                {hours.storeHours}
              </p>
            </div>
            <div className="rounded-2xl border border-[#efe6da] bg-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.06)]">
              <p className="text-xs uppercase tracking-wide text-[#9aa3b2]">
                Delivery Hours
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1f2a44]">
                {hours.deliveryHours}
              </p>
            </div>
            <div className="rounded-2xl border border-[#efe6da] bg-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.06)]">
              <p className="text-xs uppercase tracking-wide text-[#9aa3b2]">
                Delivery Fee
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1f2a44]">
                {formatCurrency(store.deliveryCharges)}
              </p>
            </div>
            <div className="rounded-2xl border border-[#efe6da] bg-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.06)]">
              <p className="text-xs uppercase tracking-wide text-[#9aa3b2]">
                Free Delivery
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1f2a44]">
                {store.freeDeliveryThreshold
                  ? `Over ${formatCurrency(store.freeDeliveryThreshold)}`
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-[#efe6da] bg-white p-6 shadow-[0_12px_30px_rgba(17,24,39,0.08)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#0f1b2d]">
                Featured Products
              </h2>
              <p className="text-sm text-[#6b7280]">
                Curated picks for quick adds.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-[#efe6da] bg-[#fbf8f3] px-3 py-1 text-xs font-semibold text-[#9aa3b2]">
              Scroll to explore
            </span>
          </div>
          <div className="relative mt-5">
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 hide-scrollbar">
              {featuredProducts.map((product) => {
                const imageSrc = product.primaryImagePath
                  ? `/${product.primaryImagePath}`
                  : product.primaryImageUrl;
                return (
                  <div
                    key={product.id}
                    className="min-w-[220px] snap-start rounded-3xl border border-[#efe6da] bg-[#fbf8f3] p-4 shadow-[0_12px_24px_rgba(17,24,39,0.08)]"
                  >
                    <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-white">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={product.title}
                          fill
                          sizes="220px"
                          loading="lazy"
                          placeholder="empty"
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#9aa3b2]">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa3b2]">
                        {product.brand?.name ?? store.name}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#1f2a44]">
                        {product.title}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#0f1b2d]">
                          Rs. {product.price}
                        </p>
                        <span className="rounded-full border border-[#f4c44f] px-2 py-1 text-[10px] font-semibold text-[#b57512]">
                          Featured
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <StoreBrowseSection storeSlug={store.slug} storeName={store.name} />
      </div>
      <StickyCheckoutBar />
    </div>
  );
}
