import crypto from "crypto";
import { authenticator } from "otplib";
import { env } from "../config/env";

/**
 * Track A — rotating entrance QR.
 * Each venue gets a deterministic per-venue TOTP secret derived from a single
 * master secret, so we never store a secret per venue. The screen at the door
 * renders a fresh code every ENTRANCE_TOTP_STEP_SECONDS (default 60s).
 */
authenticator.options = {
  step: env.ENTRANCE_TOTP_STEP_SECONDS,
  window: 1, // tolerate one step of clock drift on verification
  digits: 6,
};

export function venueTotpSecret(venueId: string): string {
  const raw = crypto
    .createHmac("sha256", env.TOTP_MASTER_SECRET)
    .update(`entrance:${venueId}`)
    .digest();
  // otplib expects a base32 secret.
  return base32Encode(raw).slice(0, 32);
}

export function currentEntranceCode(venueId: string): { code: string; expiresInMs: number } {
  const secret = venueTotpSecret(venueId);
  const code = authenticator.generate(secret);
  const stepMs = env.ENTRANCE_TOTP_STEP_SECONDS * 1000;
  const expiresInMs = stepMs - (Date.now() % stepMs);
  return { code, expiresInMs };
}

export function verifyEntranceCode(venueId: string, code: string): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  return authenticator.verify({ token: code, secret: venueTotpSecret(venueId) });
}

const B32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32_ALPHABET[(value << (5 - bits)) & 31];
  return out;
}
