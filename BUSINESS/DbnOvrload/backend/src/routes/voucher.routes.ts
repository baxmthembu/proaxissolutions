import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { unlockTillToken, TokenError } from "../services/token.service";
import { voucherScarcity, scarcityMicrocopy } from "../lib/scarcity";

export const voucherRouter = Router();

/** Public list of live combos for a venue, each with honest scarcity numbers. */
voucherRouter.get("/venue/:venueId", async (req, res, next) => {
  try {
    const vouchers = await prisma.voucher.findMany({
      where: { venueId: req.params.venueId, isActive: true },
      include: { venue: { select: { name: true } } },
    });
    const withScarcity = await Promise.all(
      vouchers.map(async (v) => {
        const s = await voucherScarcity(v.id);
        return {
          id: v.id,
          title: v.title,
          slug: v.slug,
          blurb: v.blurb,
          priceCents: v.priceCents,
          premiumOnly: v.premiumOnly,
          windowStart: v.windowStart,
          windowEnd: v.windowEnd,
          remaining: s.remaining,
          dailyQuantity: s.dailyQuantity,
          microcopy: scarcityMicrocopy(s, v.venue.name),
        };
      })
    );
    res.json({ vouchers: withScarcity });
  } catch (err) {
    next(err);
  }
});

/** Live scarcity for a single voucher (polled by the scarcity ticker). */
voucherRouter.get("/:voucherId/scarcity", async (req, res, next) => {
  try {
    const voucher = await prisma.voucher.findUniqueOrThrow({
      where: { id: req.params.voucherId },
      include: { venue: { select: { name: true } } },
    });
    const s = await voucherScarcity(voucher.id);
    res.json({ ...s, microcopy: scarcityMicrocopy(s, voucher.venue.name) });
  } catch (err) {
    next(err);
  }
});

/** Unlock a single-use 60s till token. */
voucherRouter.post("/:voucherId/unlock", authenticate, async (req, res, next) => {
  try {
    const { promoterRef } = z
      .object({ promoterRef: z.string().optional() })
      .parse(req.body ?? {});
    let promoterId: string | undefined;
    if (promoterRef) {
      const p = await prisma.promoter.findUnique({ where: { referralCode: promoterRef } });
      promoterId = p?.id;
    }
    const result = await unlockTillToken({
      voucherId: req.params.voucherId,
      userId: req.auth!.sub,
      promoterId,
    });
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof TokenError) return res.status(err.status).json({ error: err.message });
    next(err);
  }
});
