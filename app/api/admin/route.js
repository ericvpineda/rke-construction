import { getJwtSecretKey } from "@lib/auth";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";

export async function POST(req) {
  const cookie = cookies();
  try {
    const { email, password } = await req.json();

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = await new SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setJti(nanoid())
        .setIssuedAt()
        .setExpirationTime("30s")
        .sign(new TextEncoder().encode(getJwtSecretKey()));

      cookie.set("user-token", token);
      cookie.set({
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
      return new Response(JSON.stringify("Crediential validated."), { status: 200 });
    }

    return new Response(
      JSON.stringify("Invalid credientials. Please try again"),
      {
        status: 401,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
