import { prisma } from "@/src/lib/prisma";
import { jsonError, jsonWithCache } from "@/src/lib/http";
import { getCategoriesForStore } from "@/src/server/repositories/categoryRepository";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    slug?: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const normalizedSlug = typeof slug === "string" ? slug.trim() : "";

  if (!normalizedSlug) {
    return jsonError("Invalid slug", 400);
  }

  try {
    const store = await prisma.store.findUnique({
      where: { slug: normalizedSlug },
      select: { id: true },
    });

    if (!store) {
      return jsonError("Store not found", 404);
    }

    const payload = await getCategoriesForStore(store.id, 12);
    return jsonWithCache(payload);
  } catch (error) {
    console.error(
      JSON.stringify({
        route: "/api/stores/[slug]/categories",
        message: "GET /api/stores/[slug]/categories failed",
        params: { slug: normalizedSlug },
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return jsonError("Internal Server Error", 500);
  }
}
