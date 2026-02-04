import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic Rate Limiter (In-memory, per-instance)
// In a real production app, use Redis or a similar service.
const ipCache = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT = 100; // requests
const WINDOW_MS = 60 * 1000; // 1 minute

export function middleware(request: NextRequest) {
  const ip = request.ip || "anonymous";
  const now = Date.now();

  const userRate = ipCache.get(ip) || { count: 0, lastReset: now };

  // Reset window if needed
  if (now - userRate.lastReset > WINDOW_MS) {
    userRate.count = 0;
    userRate.lastReset = now;
  }

  userRate.count++;
  ipCache.set(ip, userRate);

  if (userRate.count > RATE_LIMIT) {
    return new NextResponse("Too Many Requests (Anti-DDoS Protection)", { status: 429 });
  }

  const response = NextResponse.next();

  // Basic Security Headers (Anti-DDoS & Security)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  );

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
