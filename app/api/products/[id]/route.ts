import { Prisma } from "@prisma/client";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { jsonError } from "@/src/lib/http";
import { withCacheHeaders } from "@/src/lib/cache";
import { rateLimit } from "@/src/lib/rateLimit";

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

function createEtag(payload: unknown) {
  const json = JSON.stringify(payload);
  const hash = createHash("sha1").update(json).digest("base64");
  return `"${hash}"`;
}

function matchesEtag(request: Request, etag: string) {
  const ifNoneMatch = request.headers.get("if-none-match");
  if (!ifNoneMatch) return false;
  return ifNoneMatch
    .split(",")
    .map((value) => value.trim())
    .includes(etag);
}

export async function GET(request: Request, context: RouteContext) {
  const rateLimited = rateLimit(request, {
    key: "GET:/api/products/[id]",
    limit: 120,
    windowMs: 60_000,
  });
  if (rateLimited) {
    return rateLimited;
  }

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

    const etag = createEtag(product);
    if (matchesEtag(request, etag)) {
      const res = new NextResponse(null, { status: 304 });
      res.headers.set("ETag", etag);
      return withCacheHeaders(res);
    }

    const res = NextResponse.json(product);
    res.headers.set("ETag", etag);
    return withCacheHeaders(res);
  } catch (error) {
    console.error(
      JSON.stringify({
        route: "/api/products/[id]",
        message: "GET /api/products/[id] failed",
        params: { id },
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return jsonError("Internal Server Error", 500);
  }
}

// curl -s http://localhost:3000/api/products/120967
