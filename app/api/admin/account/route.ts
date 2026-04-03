import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getCurrentAdminEmail,
  isAdminRequest,
  updateAdminCredentials,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

type UpdateAccountBody = {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
};

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = await getCurrentAdminEmail();
  return NextResponse.json({ email });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as UpdateAccountBody;
  const nextEmail = body.email?.trim();
  const currentPassword = body.currentPassword ?? "";
  const nextPassword = body.newPassword ? body.newPassword : undefined;

  if (!currentPassword) {
    return NextResponse.json({ error: "Current password is required." }, { status: 400 });
  }

  if (!nextEmail && !nextPassword) {
    return NextResponse.json(
      { error: "Provide a new email or password to update your account." },
      { status: 400 },
    );
  }

  if (nextEmail && !EMAIL_PATTERN.test(nextEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (nextPassword && nextPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const result = await updateAdminCredentials({
    currentPassword,
    nextEmail,
    nextPassword,
  });

  if (!result.ok) {
    if (result.reason === "invalid_current_password") {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    if (result.reason === "missing_table") {
      return NextResponse.json(
        { error: "Admin credentials table is missing. Run supabase/migrations/0004_admin_credentials.sql" },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: result.message ?? "Failed to update admin credentials." }, { status: 500 });
  }

  const response = NextResponse.json({
    ok: true,
    email: result.email,
    message: "Admin login details updated.",
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionToken(result.email),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
