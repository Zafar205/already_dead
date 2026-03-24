import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "already_dead_admin_session";

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "already-dead-admin-dev-secret";
}

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? "mohamedalzafar@gmail.com";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "123456";
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

export function isValidAdminCredentials(email: string, password: string) {
  return email === getAdminEmail() && password === getAdminPassword();
}

export function createAdminSessionToken(email: string) {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = `${email}|${expiresAt}`;
  const signature = sign(payload);
  return `${payload}|${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [email, expiresAtRaw, signature] = token.split("|");

  if (!email || !expiresAtRaw || !signature) {
    return false;
  }

  const payload = `${email}|${expiresAtRaw}`;
  const expectedSignature = sign(payload);

  const left = Buffer.from(signature);
  const right = Buffer.from(expectedSignature);

  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);

  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  return email === getAdminEmail();
}

export function isAdminRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}
