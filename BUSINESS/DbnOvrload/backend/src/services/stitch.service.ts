import crypto from "crypto";
import { env } from "../config/env";

/**
 * Stitch (Capitec Pay) integration.
 * Docs: https://docs.stitch.money/payment-products/payins/rest
 *
 * Flow:
 *   1. OAuth2 client-credentials -> access token (scope: client_paymentrequest)
 *   2. POST /payment-requests with eft.capitecPay.enabled = true
 *   3. Surface interaction.url (+ ?redirect_uri=) to the student to pay from
 *      their Capitec app — no card details, no checkout friction.
 *   4. Confirm via webhook and/or GET /payment-requests/:id.
 *
 * NB on units: the REST `amount.quantity` is the rand value. We store money in
 * cents internally and convert at the boundary (centsToRand). Confirm minor vs
 * major units against your live Stitch client before go-live.
 */

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.STITCH_CLIENT_ID,
    client_secret: env.STITCH_CLIENT_SECRET,
    scope: "client_paymentrequest",
    audience: env.STITCH_TOKEN_URL,
  });

  const res = await fetch(env.STITCH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`Stitch token request failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.value;
}

function centsToRand(cents: number): number {
  return Math.round(cents) / 100;
}

export interface CreatePaymentInput {
  amountCents: number;
  externalReference: string; // our idempotency key
  payer: {
    identifier: string; // reusable payer id (we use the user id)
    mobileNumber: string; // Capitec Pay links to the phone number
    fullName?: string;
    email?: string | null;
  };
  metadata?: Record<string, string>;
}

export interface StitchPaymentResult {
  id: string;
  status: string; // pending | completed | cancelled | expired
  redirectUrl: string; // interaction.url with redirect_uri appended
}

export async function createCapitecPayment(input: CreatePaymentInput): Promise<StitchPaymentResult> {
  const token = await getAccessToken();
  const expireAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15-min window

  const res = await fetch(`${env.STITCH_API_URL}/payment-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: { currency: "ZAR", quantity: centsToRand(input.amountCents) },
      externalReference: input.externalReference,
      expireAt,
      payer: {
        identifier: input.payer.identifier,
        mobileNumber: input.payer.mobileNumber,
        fullName: input.payer.fullName,
        email: input.payer.email ?? undefined,
      },
      metadata: input.metadata,
      paymentMethods: {
        eft: {
          enabled: true,
          payerReference: "DbnOvrload",
          beneficiaryReference: input.externalReference.slice(0, 12),
          beneficiary: {
            name: env.STITCH_BENEFICIARY_NAME,
            bank: env.STITCH_BENEFICIARY_BANK,
            accountNumber: env.STITCH_BENEFICIARY_ACCOUNT,
          },
          capitecPay: { enabled: true },
        },
        card: { enabled: false },
        crypto: { enabled: false },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Stitch create payment failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as {
    id: string;
    status: string;
    interaction?: { type: string; url: string };
  };

  const base = json.interaction?.url ?? "";
  const redirectUrl = base
    ? `${base}?redirect_uri=${encodeURIComponent(env.STITCH_REDIRECT_URI)}`
    : "";

  return { id: json.id, status: json.status, redirectUrl };
}

export async function getPaymentStatus(paymentId: string): Promise<string> {
  const token = await getAccessToken();
  const res = await fetch(`${env.STITCH_API_URL}/payment-requests/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Stitch status failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { status: string };
  return json.status;
}

/**
 * Verify a Stitch webhook signature. Stitch signs the raw body with your
 * configured secret; we recompute the HMAC and compare in constant time.
 * (Header name per your Stitch dashboard config — defaults to x-stitch-signature.)
 */
export function verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean {
  if (!env.STITCH_WEBHOOK_SECRET) return false;
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", env.STITCH_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.replace(/^sha256=/, ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Map Stitch status strings to our TransactionStatus enum values. */
export function mapStitchStatus(s: string): "COMPLETED" | "FAILED" | "EXPIRED" | "CANCELLED" | "PENDING" {
  switch (s.toLowerCase()) {
    case "completed":
    case "complete":
      return "COMPLETED";
    case "failed":
      return "FAILED";
    case "expired":
      return "EXPIRED";
    case "cancelled":
    case "closed":
      return "CANCELLED";
    default:
      return "PENDING";
  }
}
