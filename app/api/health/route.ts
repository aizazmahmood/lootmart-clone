import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { rateLimit } from "@/src/lib/rateLimit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const rateLimited = rateLimit(request, {
    key: "GET:/api/health",
    limit: 300,
    windowMs: 60_000,
  });
  if (rateLimited) {
    return rateLimited;
  }
  try {
    await prisma.store.count({ take: 1 });
    const res = NextResponse.json({
      ok: true,
      ts: new Date().toISOString(),
      db: "ok",
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (error) {
    console.error(
      JSON.stringify({
        route: "/api/health",
        message: "GET /api/health failed",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    const res = NextResponse.json(
      { ok: false, ts: new Date().toISOString(), db: "error" },
      { status: 500 },
    );
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
}
