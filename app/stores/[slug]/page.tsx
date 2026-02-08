import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { getStoreHours } from "@/src/config/demoHours";
import StoreBrowseSection from "@/src/ui/store/StoreBrowseSection";

export const runtime = "nodejs";

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
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
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
            <span className="inline-flex items-center rounded-full bg-[#e9f6ec] px-4 py-1.5 text-xs font-semibold text-[#1c7f3c]">
              Available
            </span>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#0f1b2d]">
              Featured Products
            </h2>
            <span className="text-xs font-semibold text-[#9aa3b2]">
              Curated picks
            </span>
          </div>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
            {featuredProducts.map((product) => {
              const localImage = product.primaryImagePath
                ? `/${product.primaryImagePath}`
                : null;
              return (
                <div
                  key={product.id}
                  className="min-w-[210px] rounded-2xl border border-[#efe6da] bg-[#fbf8f3] p-4"
                >
                  <div className="relative h-28 w-full overflow-hidden rounded-xl bg-white">
                    {localImage ? (
                      <Image
                        src={localImage}
                        alt={product.title}
                        fill
                        sizes="210px"
                        className="object-contain"
                      />
                    ) : product.primaryImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.primaryImageUrl}
                        alt={product.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#9aa3b2]">
                        No image
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#9aa3b2]">
                    {product.brand?.name ?? store.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#1f2a44]">
                    {product.title}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#0f1b2d]">
                    Rs. {product.price}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <StoreBrowseSection storeSlug={store.slug} storeName={store.name} />
      </div>
    </div>
  );
}
