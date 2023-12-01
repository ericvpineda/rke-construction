import { jwtVerify, SignJWT } from "jose";

export const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET_KEY
    if (!secret || secret.length === 0) {
        throw new Error("JWT secret key not set as environment variable.")
    }
    return secret 
}

export const verifyAuth = async (token) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );
    return verified.payload 
  } catch (error) {
    throw new Error("JWT token is expired.")
  }
};
