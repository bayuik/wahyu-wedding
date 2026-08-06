import type { AstroCookies } from "astro";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Minimal session for the dashboard. The password lives in ADMIN_PASSWORD and
 * never leaves the server; the cookie only carries an HMAC derived from it, so
 * a stolen cookie cannot be turned back into the password.
 */
const COOKIE = "wedding_admin";

function secret(): string {
  const pw = import.meta.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error(
      "ADMIN_PASSWORD belum diset. Tambahkan ke .env sebelum membuka /admin."
    );
  }
  return pw;
}

export function isConfigured(): boolean {
  return Boolean(import.meta.env.ADMIN_PASSWORD);
}

function token(): string {
  return createHmac("sha256", secret()).update("wedding-admin-v1").digest("hex");
}

/** Constant-time compare so the check cannot be probed by timing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(input: string): boolean {
  return safeEqual(input, secret());
}

export function isAuthed(cookies: AstroCookies): boolean {
  if (!isConfigured()) return false;
  const value = cookies.get(COOKIE)?.value;
  if (!value) return false;
  try {
    return safeEqual(value, token());
  } catch {
    return false;
  }
}

export function login(cookies: AstroCookies) {
  cookies.set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
    maxAge: 60 * 60 * 12, // a working day, then log in again
  });
}

export function logout(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: "/" });
}
