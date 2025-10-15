import { HttpRequest } from "@azure/functions";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";

const sessionCookieName = process.env.SESSION_COOKIE_NAME;
export function createAuthCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "Secure;" : "";
  const maxAge = 60 * 60 * 24 * 7;
  return `${sessionCookieName}=${token}; HttpOnly; Max-Age=${maxAge}; ${secure} SameSite=Strict; Path=/`;
}

export function clearAuthCookieHeader(): string {
  return `${sessionCookieName}=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
}

export const getCookie = (headers: HttpRequest["headers"]): string | null => {
  const cookieHeader = headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const cookie = cookies.find((c) => c.startsWith(`${sessionCookieName}=`));

  return cookie ? cookie.substring(sessionCookieName!.length + 1) : null;
};

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`,
});

export function getKey(
  header: jwt.JwtHeader,
  callback: jwt.SigningKeyCallback,
) {
  client.getSigningKey(header.kid!, (err, key) => {
    if (err) {
      callback(err, undefined);
    } else {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    }
  });
}
