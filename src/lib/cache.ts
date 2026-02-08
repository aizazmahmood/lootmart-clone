import { NextResponse } from "next/server";

const CACHE_CONTROL_VALUE = "public, s-maxage=60, stale-while-revalidate=600";

export function withCacheHeaders<T>(res: NextResponse<T>): NextResponse<T> {
  res.headers.set("Cache-Control", CACHE_CONTROL_VALUE);
  return res;
}
