import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { OUTREACH_COOKIE } from "./config";

function getSecret() {
  const secret = process.env.OUTREACH_SECRET;
  if (!secret) {
    return null;
  }
  return secret;
}

function sign(secret: string) {
  return createHmac("sha256", secret).update("frommexico-outreach").digest("hex");
}

export function outreachConfigured() {
  return Boolean(process.env.OUTREACH_SECRET);
}

export async function isOutreachAuthenticated() {
  const secret = getSecret();
  if (!secret) {
    return false;
  }
  const jar = await cookies();
  const value = jar.get(OUTREACH_COOKIE)?.value;
  if (!value) {
    return false;
  }
  const expected = sign(secret);
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function setOutreachSession() {
  const secret = getSecret();
  if (!secret) {
    throw new Error("OUTREACH_SECRET is not set.");
  }
  const jar = await cookies();
  jar.set(OUTREACH_COOKIE, sign(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearOutreachSession() {
  const jar = await cookies();
  jar.delete(OUTREACH_COOKIE);
}

export function verifyPassword(password: string) {
  const secret = getSecret();
  if (!secret) {
    return false;
  }
  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export function verifyCronSecret(header: string | null) {
  const secret = process.env.CRON_SECRET || process.env.OUTREACH_SECRET;
  if (!secret || !header) {
    return false;
  }
  const token = header.replace(/^Bearer\s+/i, "").trim();
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}
