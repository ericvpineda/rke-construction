import { verifyAuth } from "@lib/auth";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Note: Middleware is running on edge runtime
  const token = req.cookies.get("user-token")?.value;
  const verifiedToken =
    token && (await verifyAuth(token).catch((err) => console.log(err)));

  if (!verifiedToken) {
    if (req.nextUrl.pathname.startsWith("/login")) {
      return;
    } else if (req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Case: User verified and on login page or accessing api post route
  if (verifiedToken) {
    if (req.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  console.log("DEBUG: path=", req.nextUrl.pathname);

  return NextResponse.next();
}

// Middlware activates only on routes below
export const config = {
  matcher: ["/api/admin", "/login", "/admin"],
};
