import { prisma } from "../lib/prisma";
import { generateCode, hashCode, safeEqual } from "../lib/token";
import { env } from "../config/env";
import { maybeFirePromoterSurge } from "./webhook.service";
import type { TokenChannel } from "@prisma/client";

export class TokenError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * Unlock a single-use till token for a student. Lives exactly
 * VOUCHER_TOKEN_TTL_SECONDS (60s) — the aggressive window that forces an
 * in-person conversion at the cash till.
 */
export async function unlockTillToken(opts: {
  voucherId: string;
  userId?: string;
  promoterId?: string;
}) {
  const voucher = await prisma.voucher.findUniqueOrThrow({
    where: { id: opts.voucherId },
    include: { venue: true },
  });
  if (!voucher.isActive || !voucher.venue.isActive) {
    throw new TokenError(409, "This combo is not live right now");
  }

  // Free-tier gating: premium-only vouchers require an active membership.
  if (voucher.premiumOnly && opts.userId) {
    const m = await prisma.membership.findUnique({ where: { userId: opts.userId } });
    const active = m?.active && m.currentEnd && m.currentEnd > new Date();
    if (!active) throw new TokenError(402, "Premium pass required");
  }

  // Free tier validity (Sun–Thu by default) only applies to non-premium users.
  if (!voucher.premiumOnly && opts.userId) {
    const user = await prisma.user.findUnique({ where: { id: opts.userId } });
    const isFree = !user || user.membershipTier === "FREE";
    if (isFree && !voucher.validDays.includes(new Date().getDay())) {
      throw new TokenError(403, "Free passes run Sun–Thu. Go Premium for late-night access.");
    }
  }

  // One live token per student per voucher — void any prior active token.
  if (opts.userId) {
    await prisma.activeToken.updateMany({
      where: { userId: opts.userId, voucherId: opts.voucherId, status: "ACTIVE" },
      data: { status: "VOID" },
    });
  }

  const code = generateCode();
  const hash = hashCode(code, voucher.venue.posTillSecret);
  const expiresAt = new Date(Date.now() + env.VOUCHER_TOKEN_TTL_SECONDS * 1000);

  const token = await prisma.activeToken.create({
    data: {
      code,
      hash,
      channel: "TILL",
      status: "ACTIVE",
      userId: opts.userId,
      venueId: voucher.venueId,
      voucherId: voucher.id,
      promoterId: opts.promoterId,
      expiresAt,
    },
  });

  return {
    code: token.code, // shown to the student to read out / scan at the till
    expiresAt: token.expiresAt,
    ttlSeconds: env.VOUCHER_TOKEN_TTL_SECONDS,
    voucher: { id: voucher.id, title: voucher.title, priceCents: voucher.priceCents },
    venue: { id: voucher.venue.id, name: voucher.venue.name },
  };
}

/**
 * Till verifies a token. Atomic: a token can only ever settle into ONE scan.
 * On success we accrue the Tier-1 commission and check promoter surge rewards.
 */
export async function verifyTillToken(opts: {
  code: string;
  venueId: string;
  redeemedBy?: string;
}) {
  const venue = await prisma.venue.findUniqueOrThrow({ where: { id: opts.venueId } });
  const expectedHash = hashCode(opts.code, venue.posTillSecret);

  const token = await prisma.activeToken.findUnique({
    where: { code: opts.code.trim().toUpperCase() },
  });
  if (!token || token.venueId !== opts.venueId || !safeEqual(token.hash, expectedHash)) {
    throw new TokenError(404, "Invalid token");
  }
  if (token.status === "REDEEMED") throw new TokenError(409, "Token already redeemed");
  if (token.status !== "ACTIVE") throw new TokenError(410, "Token void");
  if (token.expiresAt <= new Date()) {
    await prisma.activeToken.update({ where: { id: token.id }, data: { status: "EXPIRED" } });
    throw new TokenError(410, "Token expired — ask the student to unlock again");
  }

  // Tier 1 venues accrue a per-scan commission; Tier 2 retainer venues = 0.
  const valueCents = venue.billingTier === "TIER1_COMMISSION" ? venue.commissionCents : 0;

  const scan = await prisma.$transaction(async (tx) => {
    const updated = await tx.activeToken.updateMany({
      where: { id: token.id, status: "ACTIVE" }, // optimistic lock
      data: { status: "REDEEMED", redeemedAt: new Date(), redeemedBy: opts.redeemedBy },
    });
    if (updated.count !== 1) throw new TokenError(409, "Token already redeemed");

    return tx.scan.create({
      data: {
        tokenId: token.id,
        userId: token.userId,
        venueId: token.venueId,
        voucherId: token.voucherId,
        promoterId: token.promoterId,
        channel: token.channel,
        valueCents,
      },
    });
  });

  if (token.promoterId) await maybeFirePromoterSurge(token.promoterId, token.venueId);

  return { scanId: scan.id, valueCents, redeemedAt: scan.scannedAt };
}

/** Track B — door staff manually admit by phone lookup (offline/dead battery). */
export async function doorOverrideAdmit(opts: {
  venueId: string;
  mobileNumber: string;
  voucherId?: string;
  redeemedBy: string;
}) {
  const venue = await prisma.venue.findUniqueOrThrow({ where: { id: opts.venueId } });
  const user = await prisma.user.findUnique({ where: { mobileNumber: opts.mobileNumber } });

  const code = generateCode();
  const token = await prisma.activeToken.create({
    data: {
      code,
      hash: hashCode(code, venue.posTillSecret),
      channel: "DOOR_OVERRIDE",
      status: "REDEEMED",
      userId: user?.id,
      venueId: venue.id,
      voucherId: opts.voucherId,
      expiresAt: new Date(),
      redeemedAt: new Date(),
      redeemedBy: opts.redeemedBy,
    },
  });

  const valueCents = venue.billingTier === "TIER1_COMMISSION" ? venue.commissionCents : 0;
  const scan = await prisma.scan.create({
    data: {
      tokenId: token.id,
      userId: user?.id,
      venueId: venue.id,
      voucherId: opts.voucherId,
      channel: "DOOR_OVERRIDE" as TokenChannel,
      valueCents,
    },
  });

  return { scanId: scan.id, matchedUser: !!user };
}

/** Sweep expired tokens (called on an interval from server.ts). */
export async function expireStaleTokens(): Promise<number> {
  const { count } = await prisma.activeToken.updateMany({
    where: { status: "ACTIVE", expiresAt: { lte: new Date() } },
    data: { status: "EXPIRED" },
  });
  return count;
}
