import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";

/**
 * UGC — 5s low-bandwidth dancefloor clips + energy ratings on a venue profile.
 * New approved clips bump the venue's freshness signal (consumed by the SEO
 * meta injector to tell crawlers the page has active content loops).
 */
export const ugcRouter = Router();

const ENERGY = ["CHILLED", "WARMING", "LIT", "GQOM_OVERLOAD"] as const;

ugcRouter.post("/:venueId/clips", authenticate, async (req, res, next) => {
  try {
    const body = z
      .object({
        videoUrl: z.string().url(), // pre-uploaded to object storage by the client
        posterUrl: z.string().url().optional(),
        energy: z.enum(ENERGY).default("LIT"),
      })
      .parse(req.body);

    const clip = await prisma.ugcClip.create({
      data: {
        venueId: req.params.venueId,
        userId: req.auth!.sub,
        videoUrl: body.videoUrl,
        posterUrl: body.posterUrl,
        energy: body.energy,
        approved: false, // moderation gate before it influences SEO metadata
      },
    });
    res.status(201).json({ id: clip.id, status: "pending_moderation" });
  } catch (err) {
    next(err);
  }
});

/** Public, approved clips for a venue profile block. */
ugcRouter.get("/:venueId/clips", async (req, res, next) => {
  try {
    const clips = await prisma.ugcClip.findMany({
      where: { venueId: req.params.venueId, approved: true },
      orderBy: { createdAt: "desc" },
      take: 24,
      select: { id: true, videoUrl: true, posterUrl: true, energy: true, createdAt: true },
    });

    // Aggregate energy rating (1–4) for the venue.
    const score = clips.length
      ? clips.reduce((s, c) => s + (ENERGY.indexOf(c.energy) + 1), 0) / clips.length
      : null;

    res.json({ clips, energyScore: score, count: clips.length });
  } catch (err) {
    next(err);
  }
});
