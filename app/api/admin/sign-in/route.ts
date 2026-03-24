import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  isValidAdminCredentials,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

type SignInBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SignInBody;

  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (!isValidAdminCredentials(body.email, body.password)) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = createAdminSessionToken(body.email);
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
