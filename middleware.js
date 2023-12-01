import { verifyAuth } from "@lib/auth"
import { NextResponse } from "next/server"

export async function middleware(req) {
    // Note: Middleware is running on edge runtime
    const token = req.cookies.get("user-token")?.value
    try {
        const verifiedToken = token && await verifyAuth(token)

        // Case: User not verified and not on login page
        if (!verifiedToken && !req.nextUrl.pathname.startsWith("/login")) {
           return NextResponse.redirect(new URL("/login", req.url))
        }

        // Case: User verified and on login page
        if (verifiedToken && req.nextUrl.pathname.startsWith("/login")) {
           return NextResponse.redirect(new URL("/", req.url))
        }

    } catch (err) {
        console.log(err)        
    }

}

export const config = {
    matcher: ["/login", "/api/admin/auth"]
}

