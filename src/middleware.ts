// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  console.log(`Authentication status: ${isAuth}, Auth page: ${isAuthPage}`);

  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/admin", "/dashboard/settings/:path*"],
};
