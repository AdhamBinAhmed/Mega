import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isReservedSlug } from "./app/lib/reserved";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

// Bounded, process-local backstop. Use a shared limiter for a strict global
// limit across instances.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 50;
const RATE_MAX_KEYS = 10_000;
const ipHits = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const platformIp = req.headers.get("x-nf-client-connection-ip")
    || req.headers.get("x-vercel-forwarded-for");
  if (platformIp) return platformIp.trim();
  const fwd = req.headers.get("x-forwarded-for");
  // Proxies append their verified peer address; the leading value can be
  // client supplied before the request reaches the platform.
  return fwd?.split(",").at(-1)?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const prior = ipHits.get(ip);
  const recent = prior?.filter((t) => now - t < RATE_WINDOW_MS) || [];
  // Do not append after the cap: a single abusive key must not grow forever.
  if (recent.length >= RATE_MAX) return true;
  if (!prior && ipHits.size >= RATE_MAX_KEYS) {
    const oldest = ipHits.keys().next().value;
    if (oldest) ipHits.delete(oldest);
  }
  recent.push(now);
  ipHits.delete(ip);
  ipHits.set(ip, recent);
  return false;
}

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Throttle abusive clients before doing any routing work.
  if (isRateLimited(clientIp(req))) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60", "Cache-Control": "no-store" },
    });
  }

  const hostHeader = req.headers.get("host");
  if (!hostHeader) return NextResponse.next();
  let hostname: string;
  try {
    hostname = new URL(`http://${hostHeader}`).hostname.toLowerCase().replace(/\.$/, "");
  } catch {
    return NextResponse.next();
  }
  const rootDomain = "megadevs.site";
  const subdomain = hostname.endsWith(`.${rootDomain}`)
    ? hostname.slice(0, -(`.${rootDomain}`).length)
    : hostname.endsWith(".localhost")
      ? hostname.slice(0, -".localhost".length)
      : "";

  if (!subdomain || isReservedSlug(subdomain)) return NextResponse.next();

  const path = url.pathname;
  return NextResponse.rewrite(new URL(`/${subdomain}${path === "/" ? "" : path}`, req.url));
}
