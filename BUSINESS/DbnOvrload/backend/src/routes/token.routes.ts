import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole, requireVenueScope } from "../middleware/auth";
import { verifyTillToken, TokenError } from "../services/token.service";
import { currentEntranceCode, verifyEntranceCode } from "../lib/totp";

export const tokenRouter = Router();

/**
 * Track A — rotating entrance QR.
 * The screen at the door polls this and re-renders a fresh code every 60s.
 * Public: the code alone is useless without the matching venue + time step.
 */
tokenRouter.get("/entrance/:venueId", (req, res) => {
  const { code, expiresInMs } = currentEntranceCode(req.params.venueId);
  res.json({
    venueId: req.params.venueId,
    code,
    expiresInMs,
    // The QR payload the door screen encodes.
    qrPayload: `dbnovrload://entry/${req.params.venueId}/${code}`,
  });
});

/**
 * Till verification (Track A redemption).
 * Called by the venue's POS/till app. Staff-authenticated and venue-scoped.
 */
const verifySchema = z.object({ code: z.string().min(4), venueId: z.string() });

tokenRouter.post(
  "/verify",
  authenticate,
  requireRole("DOOR_STAFF", "VENUE_OWNER", "ADMIN"),
  requireVenueScope("venueId"),
  async (req, res, next) => {
    try {
      const { code, venueId } = verifySchema.parse(req.body);
      const result = await verifyTillToken({ code, venueId, redeemedBy: req.auth!.sub });
      res.json({ ok: true, ...result });
    } catch (err) {
      if (err instanceof TokenError) return res.status(err.status).json({ ok: false, error: err.message });
      next(err);
    }
  }
);

/** Validate a scanned entrance TOTP (e.g. a roaming staffer's handheld). */
tokenRouter.post(
  "/entrance/verify",
  authenticate,
  requireRole("DOOR_STAFF", "VENUE_OWNER", "ADMIN"),
  requireVenueScope("venueId"),
  (req, res) => {
    const { venueId, code } = z.object({ venueId: z.string(), code: z.string() }).parse(req.body);
    res.json({ valid: verifyEntranceCode(venueId, code) });
  }
);
