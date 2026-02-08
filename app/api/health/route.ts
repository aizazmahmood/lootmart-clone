import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
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
    console.error("GET /api/health failed", error);
    const res = NextResponse.json(
      { ok: false, ts: new Date().toISOString(), db: "error" },
      { status: 500 },
    );
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
}
