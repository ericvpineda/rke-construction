import { getJwtSecretKey, verifyAuth } from "@lib/auth";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";

const userToken = "user-token";

// Authorize admin access
export async function GET() {
  try {
    const cookieStore = cookies();
    let token = "";

    if (cookieStore.has(userToken)) {
      token = cookieStore.get(userToken).value;
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

// Authenticate admin access
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

      cookieStore.set(userToken, token);
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

export async function DELETE() {
  try {
    const cookieStore = cookies();
    if (cookieStore.has(userToken)) {
      cookieStore.delete(userToken);
    }
    return new Response(JSON.stringify("Successfully logged out."), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
