import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate, requireRole, requireVenueScope } from "../middleware/auth";
import { doorOverrideAdmit } from "../services/token.service";

/**
 * Track B — zero-latency door-staff portal.
 * Manual overrides for offline / dead-battery exceptions, by phone lookup.
 * Returns only the minimum a doorperson needs (POPIA data-minimisation).
 */
export const doorRouter = Router();

doorRouter.use(authenticate, requireRole("DOOR_STAFF", "VENUE_OWNER", "ADMIN"));

doorRouter.post("/lookup", async (req, res, next) => {
  try {
    const { mobileNumber } = z.object({ mobileNumber: z.string().min(7) }).parse(req.body);
    const user = await prisma.user.findUnique({
      where: { mobileNumber },
      select: { id: true, fullName: true, membershipTier: true, campusSlug: true },
    });
    if (!user) return res.json({ found: false });

    const membership = await prisma.membership.findUnique({
      where: { userId: user.id },
      select: { active: true, currentEnd: true },
    });
    const premiumActive = !!(membership?.active && membership.currentEnd && membership.currentEnd > new Date());

    res.json({
      found: true,
      firstName: user.fullName.split(" ")[0],
      membershipTier: user.membershipTier,
      premiumActive,
      campus: user.campusSlug,
    });
  } catch (err) {
    next(err);
  }
});

doorRouter.post("/admit", requireVenueScope("venueId"), async (req, res, next) => {
  try {
    const { venueId, mobileNumber, voucherId } = z
      .object({ venueId: z.string(), mobileNumber: z.string().min(7), voucherId: z.string().optional() })
      .parse(req.body);
    const result = await doorOverrideAdmit({
      venueId,
      mobileNumber,
      voucherId,
      redeemedBy: req.auth!.sub,
    });
    res.status(201).json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
});
