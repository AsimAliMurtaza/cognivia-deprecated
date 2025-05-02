// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isUserDashboard = isDashboardRoute && !isAdminRoute;

    
  // Block all dashboard access if not logged in
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔒 Block user dashboard for admins
  if (isUserDashboard && token?.role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  let userAction="";
  if (token?.role==="admin")
  {
    userAction="View Admin Dashboard";
  }else{

    userAction="View User Dashboard";
  }
  await fetch("http://localhost:3000/api/logging/audit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: token?.id,
      userEmail: token?.email,
      role: token?.role,
      action: userAction || "Unauthenticated User" ,
    }),
  });
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
