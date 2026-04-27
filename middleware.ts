import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./lib/auth.config";

const { auth } = NextAuth(authConfig);

const TALENT_ROUTES = ["/dashboard", "/onboarding", "/profile", "/plans"];
const ADMIN_ROUTES = [
  "/admin/dashboard",
  "/admin/talent",
  "/admin/startups",
  "/admin/applications",
  "/admin/team",
];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const role = (session?.user as any)?.role as
    | "TALENT"
    | "SUPER_ADMIN"
    | "PLACEMENT_MANAGER"
    | undefined;

  const path = nextUrl.pathname;

  const isTalentRoute = TALENT_ROUTES.some((r) => path.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => path.startsWith(r));

  if (!isTalentRoute && !isAdminRoute) return NextResponse.next();

  if (!session) {
    const loginUrl = new URL("/signup/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isTalentRoute && role !== "TALENT") {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl.origin));
  }

  if (isAdminRoute && role !== "SUPER_ADMIN" && role !== "PLACEMENT_MANAGER") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/profile/:path*",
    "/plans/:path*",
    "/admin/dashboard/:path*",
    "/admin/talent/:path*",
    "/admin/startups/:path*",
    "/admin/applications/:path*",
    "/admin/team/:path*",
  ],
};
