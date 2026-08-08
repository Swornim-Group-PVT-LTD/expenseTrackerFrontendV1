import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/authentication/login",
  "/authentication/register",
  "/home",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const access_token = request.cookies.get("access_token")?.value;
  // const access_token = localStorage.getItem("access_token");
  

  // Skip public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protect all other routes
  if (!access_token) {
    return NextResponse.redirect(new URL("/authentication/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
