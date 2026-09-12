import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import { createShareAsset, registerShareClick } from "../services/cloutshare.service";

export const cloutshareRouter = Router();

/** Generate a platform-tailored shareable asset with a tracking link. */
cloutshareRouter.post("/", authenticate, async (req, res, next) => {
  try {
    const body = z
      .object({
        channel: z.enum(["whatsapp", "tiktok", "instagram"]),
        passName: z.string(),
        venueName: z.string(),
        promoterId: z.string().optional(),
        imageUrl: z.string().url().optional(),
      })
      .parse(req.body);
    const asset = await createShareAsset(body.channel, body);
    res.status(201).json(asset);
  } catch (err) {
    next(err);
  }
});

/** Tracking-link landing — count the click, then bounce to the app. */
cloutshareRouter.get("/s/:trackingId", async (req, res, next) => {
  try {
    await registerShareClick(req.params.trackingId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
