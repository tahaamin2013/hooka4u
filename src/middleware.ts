// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/login", "/register"]; // allowed without login
const DASHBOARD_ROUTES = ["/admin-dashboard", "/user-dashboard"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role;

  // --------------------------
  // 1️⃣ If logged in
  // --------------------------
  if (token) {
    // Redirect logged-in user if they try to access login or home
    if (pathname === "/" || pathname === "/login") {
      const redirectTo = role === "ADMIN" ? "/admin-dashboard" : "/user-dashboard";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    // Prevent users from accessing wrong dashboard
    if (pathname.startsWith("/admin-dashboard") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user-dashboard", req.url));
    }

    if (pathname.startsWith("/user-dashboard") && role !== "USER") {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }

    return NextResponse.next();
  }

  // --------------------------
  // 2️⃣ If NOT logged in
  // --------------------------
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isDashboard = DASHBOARD_ROUTES.some((route) => pathname.startsWith(route));

  if (!isPublic && isDashboard) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", 
    "/login", 
    "/register", 
    "/admin-dashboard/:path*", 
    "/user-dashboard/:path*"
  ],
};
