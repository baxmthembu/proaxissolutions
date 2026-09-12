import crypto from "crypto";

/**
 * Single-use till tokens.
 * - `code` is short and human-typeable at a busy till ("DBN-7F3K9").
 * - `hash` = SHA-256(code + venue POS secret) is what we persist and verify
 *   against, so a leaked database row never reveals a usable code.
 * Tokens carry NO monetary value — they only assert "this student arrived".
 */

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no easily-confused chars

export function generateCode(): string {
  const bytes = crypto.randomBytes(5);
  let body = "";
  for (const b of bytes) body += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return `DBN-${body}`;
}

export function hashCode(code: string, posTillSecret: string): string {
  return crypto.createHmac("sha256", posTillSecret).update(code.trim().toUpperCase()).digest("hex");
}

/** Constant-time compare to defeat timing attacks at the till endpoint. */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
