import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";

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
    select: { id: true, name: true, slug: true },
  });

  if (!store) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-4 py-16 font-sans text-[#0f1b2d] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-[#efe6da] bg-white p-8 shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
        <Link
          href="/"
          className="text-sm font-semibold text-[#a2771d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
        >
          ← Back to home
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#9aa3b2]">
            Store
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{store.name}</h1>
          <p className="mt-3 text-sm text-[#6b7280]">
            Store page coming next. We’re building the full catalog and cart
            experience.
          </p>
        </div>
      </div>
    </div>
  );
}
