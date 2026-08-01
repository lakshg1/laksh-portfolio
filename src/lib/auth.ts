/**
 * Admin auth — stateless, HMAC-signed cookie. No server session store, so it
 * works fine on serverless/Vercel.
 *
 * Env:
 *   ADMIN_PASSWORD  the login password (required for /admin to be usable)
 *   ADMIN_SECRET    optional signing key; falls back to ADMIN_PASSWORD
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || '';
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

/** Constant-time string compare that never throws on length mismatch. */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function passwordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  return safeEqual(input, expected);
}

/** value: `<issuedAtMs>.<sig>` */
export function issueToken(): string {
  const issued = Date.now().toString();
  return `${issued}.${sign(issued)}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token || !secret()) return false;
  const [issued, sig] = token.split('.');
  if (!issued || !sig) return false;
  if (!safeEqual(sig, sign(issued))) return false;
  const age = (Date.now() - Number(issued)) / 1000;
  return Number.isFinite(age) && age >= 0 && age < MAX_AGE;
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE,
};
