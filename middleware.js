import { verifyAuth } from "@lib/auth";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Note: Middleware is running on edge runtime
  const token = req.cookies.get("user-token")?.value;
  try {
    const verifiedToken = token && (await verifyAuth(token));

    // Case: User verified and on login page or accessing api post route
    if (verifiedToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err.message,
      status: 500,
    });
  }
}

// Middlware activates only on routes below
export const config = {
  matcher: ["/api/admin", "/login"],
};
