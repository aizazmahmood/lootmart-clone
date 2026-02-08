import { NextResponse } from "next/server";

const CACHE_CONTROL_VALUE = "max-age=0, s-maxage=60, stale-while-revalidate=600";
const CDN_CACHE_CONTROL_VALUE = "s-maxage=60, stale-while-revalidate=600";
const VARY_VALUE = "Accept-Encoding";

function mergeVary(existing: string | null, value: string) {
  if (!existing) return value;
  const parts = existing
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.includes(value)) parts.push(value);
  return parts.join(", ");
}

export function withCacheHeaders<T>(res: NextResponse<T>): NextResponse<T> {
  res.headers.set("Cache-Control", CACHE_CONTROL_VALUE);
  res.headers.set("CDN-Cache-Control", CDN_CACHE_CONTROL_VALUE);
  res.headers.set("Vary", mergeVary(res.headers.get("Vary"), VARY_VALUE));
  return res;
}
