import { NextResponse } from "next/server";
import { withCacheHeaders } from "@/src/lib/cache";

export function jsonWithCache<T>(data: T, status = 200): NextResponse<T> {
  const response = NextResponse.json(data, { status });
  return withCacheHeaders(response);
}

export function jsonError(message: string, status: number): NextResponse<{
  error: string;
}> {
  return jsonWithCache({ error: message }, status);
}
