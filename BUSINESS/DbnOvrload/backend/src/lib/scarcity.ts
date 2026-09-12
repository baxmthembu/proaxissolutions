import { prisma } from "./prisma";

/**
 * Honest scarcity.
 * Every "only N left" / "X students just claimed" figure the UI flashes is
 * computed from real rows here — never a fabricated number. Displaying false
 * scarcity is a prohibited practice under the SA Consumer Protection Act, so
 * this module is the single source of truth for the FOMO engine.
 */

function startOfLocalDay(d = new Date()): Date {
  const day = new Date(d);
  day.setHours(0, 0, 0, 0);
  return day;
}

export interface VoucherScarcity {
  voucherId: string;
  dailyQuantity: number;
  claimedToday: number; // settled scans today
  heldNow: number; // tokens active in their 60s window right now
  remaining: number; // dailyQuantity - claimed - held (never < 0)
  claimedByCampus: { campusSlug: string; count: number }[];
}

export async function voucherScarcity(voucherId: string): Promise<VoucherScarcity> {
  const voucher = await prisma.voucher.findUniqueOrThrow({ where: { id: voucherId } });
  const since = startOfLocalDay();

  const [claimedToday, heldNow, byCampus] = await Promise.all([
    prisma.scan.count({ where: { voucherId, scannedAt: { gte: since } } }),
    prisma.activeToken.count({
      where: { voucherId, status: "ACTIVE", expiresAt: { gt: new Date() } },
    }),
    prisma.scan.findMany({
      where: { voucherId, scannedAt: { gte: since }, user: { campusSlug: { not: null } } },
      select: { user: { select: { campusSlug: true } } },
    }),
  ]);

  const campusCounts = new Map<string, number>();
  for (const s of byCampus) {
    const c = s.user?.campusSlug;
    if (c) campusCounts.set(c, (campusCounts.get(c) ?? 0) + 1);
  }

  const remaining = Math.max(0, voucher.dailyQuantity - claimedToday - heldNow);

  return {
    voucherId,
    dailyQuantity: voucher.dailyQuantity,
    claimedToday,
    heldNow,
    remaining,
    claimedByCampus: [...campusCounts.entries()]
      .map(([campusSlug, count]) => ({ campusSlug, count }))
      .sort((a, b) => b.count - a.count),
  };
}

/** Builds the flashing micro-copy from real numbers only. */
export function scarcityMicrocopy(s: VoucherScarcity, venueName: string): string[] {
  const lines: string[] = [];
  if (s.remaining > 0 && s.remaining <= Math.max(10, Math.ceil(s.dailyQuantity * 0.2))) {
    lines.push(`Only ${s.remaining} vouchers left for ${venueName} today`);
  }
  const top = s.claimedByCampus[0];
  if (top && top.count >= 3) {
    lines.push(`${top.count} students from ${campusLabel(top.campusSlug)} just claimed this pass`);
  }
  return lines;
}

export function campusLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
