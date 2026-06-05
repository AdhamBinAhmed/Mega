import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. adham.megadevs.site, adham.localhost:3000)
  let hostname = req.headers.get("host")!;
  
  // Remove port if exists
  hostname = hostname.split(":")[0];

  // Define the root domains
  const isLocal = hostname.endsWith("localhost") || hostname === "127.0.0.1";
  const rootDomain = isLocal ? "localhost" : "megadevs.site";

  // Check if we are on a subdomain
  if (
    hostname !== rootDomain && 
    hostname !== `www.${rootDomain}` &&
    !hostname.endsWith("vercel.app") // Ignore Vercel preview domains if deployed there
  ) {
    // Extract subdomain
    // Example: adham.megadevs.site -> adham
    // Example: my.long.sub.megadevs.site -> my.long.sub
    const subdomain = hostname.replace(`.${rootDomain}`, "");

    // Skip rewriting for specific app paths to avoid infinite loops or blocking main pages
    // We already use /works, /history, /create on the main domain
    const path = url.pathname;
    
    // Rewrite to our dynamic route
    // / -> /[subdomain]
    // /about -> /[subdomain]/about
    return NextResponse.rewrite(new URL(`/${subdomain}${path === "/" ? "" : path}`, req.url));
  }

  return NextResponse.next();
}
