import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { jsonError, jsonWithCache } from "@/src/lib/http";

export const runtime = "nodejs";

const productSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  currency: true,
  inStock: true,
  primaryImagePath: true,
  primaryImageUrl: true,
  store: {
    select: {
      id: true,
      slug: true,
      name: true,
    },
  },
  brand: {
    select: {
      id: true,
      name: true,
    },
  },
  images: {
    select: {
      id: true,
      src: true,
      alt: true,
      width: true,
      height: true,
      sortOrder: true,
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
  categories: {
    select: {
      category: {
        select: {
          id: true,
          name: true,
          externalId: true,
          parentExt: true,
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

type RouteContext = {
  params: Promise<{
    id?: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return jsonError("Invalid id", 400);
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: parsedId },
      select: productSelect,
    });

    if (!product) {
      return jsonError("Product not found", 404);
    }

    return jsonWithCache(product);
  } catch (error) {
    console.error("GET /api/products/[id] failed", error);
    return jsonError("Internal Server Error", 500);
  }
}

// curl -s http://localhost:3000/api/products/120967
