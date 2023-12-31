import { getJwtSecretKey, verifyAuth } from "@lib/auth";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";

const USER_TOKEN = "user-token";

// GET authorize admin access
export async function GET() {
  try {
    const cookieStore = cookies();
    let token = "";

    if (cookieStore.has(USER_TOKEN)) {
      token = cookieStore.get(USER_TOKEN).value;
    }

    const result = await verifyAuth(token)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    return new Response(JSON.stringify({ isVerified: result }), {
      status: 200,
    });
  } catch (error) {
    return (
      new Response(JSON.stringify(error.message)),
      {
        status: 500,
      }
    );
  }
}

// POST authenticate admin access
export async function POST(req) {
  const cookieStore = cookies();
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
        .setExpirationTime("1h")
        .sign(new TextEncoder().encode(getJwtSecretKey()));

      cookieStore.set(USER_TOKEN, token);
      cookieStore.set({
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
      return new Response(JSON.stringify("Crediential validated."), {
        status: 200,
      });
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

// DELETE current admin authorization 
export async function DELETE(req) {
  try {
    const cookieStore = cookies();
    if (cookieStore.has(USER_TOKEN)) {
      cookieStore.delete(USER_TOKEN);
    }
    return new Response(JSON.stringify("Successfully logged out."), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
