import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "./supabaseAdmin";

export const ADMIN_SESSION_COOKIE = "already_dead_admin_session";

const ADMIN_CREDENTIALS_TABLE = "admin_credentials";
const ADMIN_CREDENTIALS_ROW_ID = 1;
const PASSWORD_HASH_ITERATIONS = 210_000;
const PASSWORD_HASH_KEY_LENGTH = 64;
const PASSWORD_HASH_DIGEST = "sha512";

type StoredAdminCredentials = {
  id: number;
  email: string;
  password_hash: string;
  password_salt: string;
  password_iterations: number;
  password_keylen: number;
  password_digest: string;
};

type PasswordHashRecord = {
  password_hash: string;
  password_salt: string;
  password_iterations: number;
  password_keylen: number;
  password_digest: string;
};

type StoredCredentialsResult =
  | { status: "ok"; row: StoredAdminCredentials | null }
  | { status: "missing_table" }
  | { status: "error"; message: string };

type ParsedSessionToken = {
  email: string;
  expiresAt: number;
  signature: string;
};

export type UpdateAdminCredentialsInput = {
  currentPassword: string;
  nextEmail?: string;
  nextPassword?: string;
};

export type UpdateAdminCredentialsResult =
  | { ok: true; email: string }
  | { ok: false; reason: "invalid_current_password" | "missing_table" | "error"; message?: string };

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "already-dead-admin-dev-secret";
}

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? "mohamedalzafar@gmail.com";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "123456";
}

function isMissingAdminCredentialsTableError(message: string) {
  return (
    message.includes("Could not find the table 'public.admin_credentials'") ||
    message.includes('relation "admin_credentials" does not exist')
  );
}

async function fetchStoredAdminCredentials(): Promise<StoredCredentialsResult> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(ADMIN_CREDENTIALS_TABLE)
      .select("id, email, password_hash, password_salt, password_iterations, password_keylen, password_digest")
      .eq("id", ADMIN_CREDENTIALS_ROW_ID)
      .maybeSingle();

    if (error) {
      if (isMissingAdminCredentialsTableError(error.message)) {
        return { status: "missing_table" };
      }

      return { status: "error", message: error.message };
    }

    return { status: "ok", row: (data as StoredAdminCredentials | null) ?? null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";

    if (isMissingAdminCredentialsTableError(message)) {
      return { status: "missing_table" };
    }

    return { status: "error", message };
  }
}

function buildPasswordHashRecord(password: string): PasswordHashRecord {
  const password_salt = randomBytes(16).toString("hex");
  const password_iterations = PASSWORD_HASH_ITERATIONS;
  const password_keylen = PASSWORD_HASH_KEY_LENGTH;
  const password_digest = PASSWORD_HASH_DIGEST;
  const password_hash = pbkdf2Sync(
    password,
    password_salt,
    password_iterations,
    password_keylen,
    password_digest,
  ).toString("hex");

  return {
    password_hash,
    password_salt,
    password_iterations,
    password_keylen,
    password_digest,
  };
}

function verifyStoredPassword(password: string, row: StoredAdminCredentials) {
  try {
    const calculatedHash = pbkdf2Sync(
      password,
      row.password_salt,
      row.password_iterations,
      row.password_keylen,
      row.password_digest,
    ).toString("hex");

    const left = Buffer.from(calculatedHash, "hex");
    const right = Buffer.from(row.password_hash, "hex");

    if (left.length !== right.length) {
      return false;
    }

    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

function fallbackCredentialsMatch(email: string, password: string) {
  return normalizeEmail(email) === normalizeEmail(getAdminEmail()) && password === getAdminPassword();
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function parseAdminSessionToken(token: string | undefined): ParsedSessionToken | null {
  if (!token) {
    return null;
  }

  const [email, expiresAtRaw, signature] = token.split("|");

  if (!email || !expiresAtRaw || !signature) {
    return null;
  }

  const expiresAt = Number(expiresAtRaw);

  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    return null;
  }

  return { email, expiresAt, signature };
}

export async function getCurrentAdminEmail() {
  const result = await fetchStoredAdminCredentials();

  if (result.status === "ok" && result.row?.email) {
    return result.row.email;
  }

  return getAdminEmail();
}

export async function isValidAdminCredentials(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const result = await fetchStoredAdminCredentials();

  if (result.status === "ok" && result.row) {
    return normalizedEmail === normalizeEmail(result.row.email) && verifyStoredPassword(password, result.row);
  }

  return fallbackCredentialsMatch(email, password);
}

export function createAdminSessionToken(email: string) {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = `${email}|${expiresAt}`;
  const signature = sign(payload);
  return `${payload}|${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined) {
  const parsedToken = parseAdminSessionToken(token);

  if (!parsedToken) {
    return false;
  }

  const payload = `${parsedToken.email}|${parsedToken.expiresAt}`;
  const expectedSignature = sign(payload);

  const left = Buffer.from(parsedToken.signature);
  const right = Buffer.from(expectedSignature);

  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return false;
  }

  const currentAdminEmail = await getCurrentAdminEmail();
  return normalizeEmail(parsedToken.email) === normalizeEmail(currentAdminEmail);
}

export async function isAdminRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export async function updateAdminCredentials(
  input: UpdateAdminCredentialsInput,
): Promise<UpdateAdminCredentialsResult> {
  const result = await fetchStoredAdminCredentials();

  if (result.status === "missing_table") {
    return { ok: false, reason: "missing_table" };
  }

  if (result.status === "error") {
    return { ok: false, reason: "error", message: result.message };
  }

  const existingRow = result.row;
  const currentEmail = existingRow?.email ?? getAdminEmail();
  const isCurrentPasswordValid = existingRow
    ? verifyStoredPassword(input.currentPassword, existingRow)
    : input.currentPassword === getAdminPassword();

  if (!isCurrentPasswordValid) {
    return { ok: false, reason: "invalid_current_password" };
  }

  const nextEmail = input.nextEmail?.trim() ? input.nextEmail.trim() : currentEmail;
  const nextPasswordRecord = input.nextPassword
    ? buildPasswordHashRecord(input.nextPassword)
    : existingRow
      ? {
          password_hash: existingRow.password_hash,
          password_salt: existingRow.password_salt,
          password_iterations: existingRow.password_iterations,
          password_keylen: existingRow.password_keylen,
          password_digest: existingRow.password_digest,
        }
      : buildPasswordHashRecord(getAdminPassword());

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from(ADMIN_CREDENTIALS_TABLE).upsert(
      {
        id: ADMIN_CREDENTIALS_ROW_ID,
        email: nextEmail,
        ...nextPasswordRecord,
      },
      { onConflict: "id" },
    );

    if (error) {
      if (isMissingAdminCredentialsTableError(error.message)) {
        return { ok: false, reason: "missing_table" };
      }

      return { ok: false, reason: "error", message: error.message };
    }

    return { ok: true, email: nextEmail };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";

    if (isMissingAdminCredentialsTableError(message)) {
      return { ok: false, reason: "missing_table" };
    }

    return { ok: false, reason: "error", message };
  }
}
