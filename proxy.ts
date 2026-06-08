import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 "proxy" convention (formerly "middleware"). next-intl handles
// locale detection + redirects (e.g. "/" -> "/ar").
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for static assets and API routes.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
