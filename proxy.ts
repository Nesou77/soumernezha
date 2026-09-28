import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n/config";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * - /admin/*          → Supabase session refresh + admin gate (unchanged).
 * - /en, /en/*        → 308 to the unprefixed URL (English has no prefix; avoids duplicate content).
 * - /fr, /fr/*        → served as is.
 * - anything else     → the visitor explicitly chose French earlier (cookie set by the
 *                       language switcher)? redirect to /fr/…; otherwise rewrite to the
 *                       internal /en/… route, keeping the clean URL in the address bar.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return updateSession(request);
  }

  const [, first, second = ""] = pathname.split("/");

  // Generated share images (/en/opengraph-image-…) are served as is.
  if (isLocale(first) && second.startsWith("opengraph-image")) return NextResponse.next();

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) return NextResponse.next();

  const preferred = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(preferred) && preferred !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except Next internals, metadata routes and files with an extension (images, CV, fonts…).
    "/((?!_next/|api/|icon|apple-icon|robots\\.txt|sitemap\\.xml|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
