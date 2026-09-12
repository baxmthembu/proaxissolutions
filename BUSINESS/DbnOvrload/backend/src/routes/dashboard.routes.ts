import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate, requireRole, requireVenueScope } from "../middleware/auth";

/**
 * Private B2B Owner analytics. NEVER exposed to the student app.
 * The promoter leaderboard lives ONLY here — it is deliberately hidden from
 * students to avoid demotivating lower-tier promoters.
 */
export const dashboardRouter = Router();

dashboardRouter.use(authenticate, requireRole("VENUE_OWNER", "ADMIN"));

function rangeFrom(query: unknown) {
  const { days } = z.object({ days: z.coerce.number().min(1).max(90).default(30) }).parse(query ?? {});
  const since = new Date();
  since.setDate(since.getDate() - days);
  return { since, days };
}

dashboardRouter.get("/:venueId", requireVenueScope("venueId"), async (req, res, next) => {
  try {
    const { venueId } = req.params;
    const { since, days } = rangeFrom(req.query);

    const venue = await prisma.venue.findUniqueOrThrow({ where: { id: venueId } });

    const scans = await prisma.scan.findMany({
      where: { venueId, scannedAt: { gte: since } },
      select: { scannedAt: true, valueCents: true, promoterId: true, channel: true },
    });

    // ── Total foot traffic generated ────────────────────────────────────────
    const totalFootTraffic = scans.length;

    // ── Gross revenue injected into the venue (till value of redeemed combos) ─
    const redeemedVoucherScans = await prisma.scan.findMany({
      where: { venueId, scannedAt: { gte: since }, voucherId: { not: null } },
      select: { voucher: { select: { priceCents: true } } },
    });
    const grossRevenueInjectedCents = redeemedVoucherScans.reduce(
      (sum, s) => sum + (s.voucher?.priceCents ?? 0),
      0
    );

    // ── Commission DbnOvrload bills the venue (Tier 1 only) ──────────────────
    const commissionDueCents = scans.reduce((sum, s) => sum + s.valueCents, 0);

    // ── Off-peak capacity utilisation % (off-peak = 11:00–18:00) ─────────────
    const offPeak = scans.filter((s) => {
      const h = s.scannedAt.getHours();
      return h >= 11 && h < 18;
    }).length;
    const offPeakCapacityUtilisation =
      venue.capacity > 0 ? Math.min(100, Math.round((offPeak / (venue.capacity * days)) * 100)) : null;

    // ── Daily foot-traffic series for the chart ──────────────────────────────
    const byDay = new Map<string, number>();
    for (const s of scans) {
      const key = s.scannedAt.toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }
    const footTrafficSeries = [...byDay.entries()]
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // ── Ranked promoter conversion table (PRIVATE) ───────────────────────────
    const promoterAgg = await prisma.scan.groupBy({
      by: ["promoterId"],
      where: { venueId, scannedAt: { gte: since }, promoterId: { not: null } },
      _count: { _all: true },
      _sum: { valueCents: true },
    });
    const promoterIds = promoterAgg.map((p) => p.promoterId!).filter(Boolean);
    const promoters = await prisma.promoter.findMany({
      where: { id: { in: promoterIds } },
      select: { id: true, handle: true, campusSlug: true },
    });
    const promoterMap = new Map(promoters.map((p) => [p.id, p]));
    const promoterLeaderboard = promoterAgg
      .map((p) => ({
        promoterId: p.promoterId,
        handle: promoterMap.get(p.promoterId!)?.handle ?? "unknown",
        campus: promoterMap.get(p.promoterId!)?.campusSlug ?? null,
        entries: p._count._all,
        commissionCents: p._sum.valueCents ?? 0,
      }))
      .sort((a, b) => b.entries - a.entries);

    res.json({
      venue: { id: venue.id, name: venue.name, billingTier: venue.billingTier },
      rangeDays: days,
      metrics: {
        totalFootTraffic,
        grossRevenueInjectedCents,
        commissionDueCents,
        offPeakCapacityUtilisation,
      },
      footTrafficSeries,
      promoterLeaderboard, // private to owners — never surfaced in the student app
    });
  } catch (err) {
    next(err);
  }
});
