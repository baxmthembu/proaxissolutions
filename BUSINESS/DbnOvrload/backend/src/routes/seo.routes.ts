import { Router } from "express";
import { prisma } from "../lib/prisma";
import { voucherScarcity } from "../lib/scarcity";

/**
 * Data backbone for the programmatic SEO engine. The frontend router consumes
 * these to render indexable pages and inject meta/JSON-LD.
 *   /culture/[neighborhood]/[venue-slug]
 *   /specials/[campus-slug]/[day-of-week]
 */
export const seoRouter = Router();

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

/** Sitemap feed — every indexable culture + specials URL. */
seoRouter.get("/sitemap", async (_req, res, next) => {
  try {
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      select: { slug: true, neighborhood: true, updatedAt: true },
    });
    const campuses = await prisma.user.findMany({
      where: { campusSlug: { not: null } },
      distinct: ["campusSlug"],
      select: { campusSlug: true },
    });
    const culture = venues.map((v) => ({
      loc: `/culture/${v.neighborhood}/${v.slug}`,
      lastmod: v.updatedAt.toISOString(),
    }));
    const specials = campuses.flatMap((c) =>
      DAYS.map((d) => ({ loc: `/specials/${c.campusSlug}/${d}`, lastmod: new Date().toISOString() }))
    );
    res.json({ urls: [...culture, ...specials] });
  } catch (err) {
    next(err);
  }
});

/** Venue culture page payload. */
seoRouter.get("/culture/:neighborhood/:venueSlug", async (req, res, next) => {
  try {
    const venue = await prisma.venue.findUnique({
      where: { slug: req.params.venueSlug },
      include: {
        vouchers: { where: { isActive: true } },
        ugcClips: {
          where: { approved: true },
          orderBy: { createdAt: "desc" },
          take: 6,
          select: { id: true, videoUrl: true, posterUrl: true, energy: true, createdAt: true },
        },
      },
    });
    if (!venue || venue.neighborhood !== req.params.neighborhood) {
      return res.status(404).json({ error: "Venue not found" });
    }

    const vouchers = await Promise.all(
      venue.vouchers.map(async (v) => ({
        id: v.id,
        title: v.title,
        blurb: v.blurb,
        priceCents: v.priceCents,
        remaining: (await voucherScarcity(v.id)).remaining,
      }))
    );

    res.json({
      venue: {
        id: venue.id,
        name: venue.name,
        slug: venue.slug,
        neighborhood: venue.neighborhood,
        neighborhoodTag: venue.neighborhoodTag,
        description: venue.description,
        heroImageUrl: venue.heroImageUrl,
        lat: venue.lat,
        lng: venue.lng,
      },
      vouchers,
      ugc: venue.ugcClips, // freshness signal: latest approved clips
      ugcUpdatedAt: venue.ugcClips[0]?.createdAt ?? venue.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});

/** Campus + day-of-week specials page payload. */
seoRouter.get("/specials/:campusSlug/:day", async (req, res, next) => {
  try {
    const dayIndex = DAYS.indexOf(req.params.day.toLowerCase());
    if (dayIndex === -1) return res.status(404).json({ error: "Unknown day" });

    // Combos valid on this weekday, ranked by venue priority (Tier 2 placement perk).
    const vouchers = await prisma.voucher.findMany({
      where: { isActive: true, validDays: { has: dayIndex } },
      include: { venue: { select: { name: true, slug: true, neighborhood: true, neighborhoodTag: true, priorityRank: true } } },
      orderBy: [{ venue: { priorityRank: "desc" } }],
      take: 50,
    });

    res.json({
      campusSlug: req.params.campusSlug,
      day: req.params.day.toLowerCase(),
      specials: vouchers.map((v) => ({
        id: v.id,
        title: v.title,
        blurb: v.blurb,
        priceCents: v.priceCents,
        venueName: v.venue.name,
        venueSlug: v.venue.slug,
        neighborhood: v.venue.neighborhood,
        neighborhoodTag: v.venue.neighborhoodTag,
      })),
    });
  } catch (err) {
    next(err);
  }
});
