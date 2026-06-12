/**
 * FaceValue — auth: email+password accounts, DB-backed session cookies, roles.
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { db, now, uid, audit } from "./db";

export const SESSION_COOKIE = "fv_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export type User = {
  id: string;
  email: string;
  role: "fan" | "vendor" | "admin";
  nullifierHash: string | null;
  verifiedAt: number | null;
  paymentMethodRef: string | null;
  stripeCustomerId: string | null;
  createdAt: number;
};

type UserRow = User & { passwordHash: string };

export function findUserByEmail(email: string): UserRow | undefined {
  return db()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.trim().toLowerCase()) as UserRow | undefined;
}

function stripHash(row: UserRow): User {
  const user = { ...row } as Partial<UserRow>;
  delete user.passwordHash;
  return user as User;
}

export function getUserById(id: string): User | undefined {
  const row = db().prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
  return row ? stripHash(row) : undefined;
}

export function createUser(params: {
  email: string;
  password: string;
  role?: "fan" | "vendor" | "admin";
}): { ok: true; user: User } | { ok: false; error: string } {
  const email = params.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Invalid email" };
  if ((params.password || "").length < 8)
    return { ok: false, error: "Password must be at least 8 characters" };
  if (findUserByEmail(email)) return { ok: false, error: "An account with this email already exists" };

  const id = uid();
  db()
    .prepare("INSERT INTO users (id, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)")
    .run(id, email, bcrypt.hashSync(params.password, 10), params.role || "fan", now());
  audit("user.signup", { userId: id, detail: email });
  return { ok: true, user: getUserById(id)! };
}

export function verifyPassword(email: string, password: string): User | null {
  const row = findUserByEmail(email);
  if (!row) return null;
  if (!bcrypt.compareSync(password, row.passwordHash)) return null;
  return stripHash(row);
}

/* ---------------- sessions ---------------- */

export function createSession(userId: string): { token: string; expiresAt: number } {
  const token = randomBytes(32).toString("hex");
  const expiresAt = now() + SESSION_TTL_MS;
  db()
    .prepare("INSERT INTO sessions (token, userId, expiresAt, createdAt) VALUES (?, ?, ?, ?)")
    .run(token, userId, expiresAt, now());
  return { token, expiresAt };
}

export function destroySession(token: string) {
  db().prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function getSessionUser(req: NextRequest): User | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = db()
    .prepare("SELECT userId, expiresAt FROM sessions WHERE token = ?")
    .get(token) as { userId: string; expiresAt: number } | undefined;
  if (!row) return null;
  if (row.expiresAt < now()) {
    destroySession(token);
    return null;
  }
  return getUserById(row.userId) ?? null;
}

export function setSessionCookie(res: NextResponse, token: string, expiresAt: number) {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt),
    path: "/",
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

/* ---------------- profile mutations ---------------- */

/**
 * Bind a World ID nullifier to a user — ONE human, ONE account.
 * Re-verifying the same user returns their existing nullifier (idempotent).
 * A nullifier already bound to a different account is rejected (Sybil guard).
 */
export function bindNullifier(
  userId: string,
  nullifierHash: string
): { ok: true; nullifierHash: string } | { ok: false; error: string } {
  const user = getUserById(userId);
  if (!user) return { ok: false, error: "User not found" };
  if (user.nullifierHash) return { ok: true, nullifierHash: user.nullifierHash };

  const clash = db()
    .prepare("SELECT id FROM users WHERE nullifierHash = ? AND id != ?")
    .get(nullifierHash, userId) as { id: string } | undefined;
  if (clash) return { ok: false, error: "This human is already verified on another account" };

  db()
    .prepare("UPDATE users SET nullifierHash = ?, verifiedAt = ? WHERE id = ?")
    .run(nullifierHash, now(), userId);
  audit("user.verified", { userId, detail: nullifierHash.slice(0, 14) });
  return { ok: true, nullifierHash };
}

export function setPaymentMethod(userId: string, ref: string, stripeCustomerId?: string) {
  db()
    .prepare("UPDATE users SET paymentMethodRef = ?, stripeCustomerId = COALESCE(?, stripeCustomerId) WHERE id = ?")
    .run(ref, stripeCustomerId ?? null, userId);
  audit("user.payment_method", { userId, detail: ref });
}
