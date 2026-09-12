import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

async function main() {
  // ── Venues ────────────────────────────────────────────────────────────────
  const wiseman = await prisma.venue.upsert({
    where: { slug: "wiseman-shisanyama-carwash" },
    update: {},
    create: {
      name: "Wiseman Shisanyama & Carwash",
      slug: "wiseman-shisanyama-carwash",
      neighborhood: "kwamashu-g-section",
      neighborhoodTag: "KwaMashu G-Section",
      description:
        "G-Section institution — carwash by day, shisanyama and Gqom basslines into the night.",
      billingTier: "TIER1_COMMISSION",
      commissionCents: 1500,
      capacity: 400,
      priorityRank: 50,
      posTillSecret: crypto.randomBytes(24).toString("hex"),
      lat: -29.7396,
      lng: 30.9836,
    },
  });

  const mkhize = await prisma.venue.upsert({
    where: { slug: "mkhize-rooftop" },
    update: {},
    create: {
      name: "Mkhize Rooftop",
      slug: "mkhize-rooftop",
      neighborhood: "kwamashu-d-section",
      neighborhoodTag: "KwaMashu D-Section",
      description: "D-Section rooftop sundowner sessions and late-night sets.",
      billingTier: "TIER2_RETAINER",
      retainerCents: 150000,
      capacity: 250,
      priorityRank: 80,
      posTillSecret: crypto.randomBytes(24).toString("hex"),
    },
  });

  // ── Owner + door staff ──────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "owner@wiseman.co.za" },
    update: {},
    create: {
      role: "VENUE_OWNER",
      fullName: "Wiseman Owner",
      mobileNumber: "0820000001",
      email: "owner@wiseman.co.za",
      passwordHash: hashPassword("changeme123"),
      doorAtVenueId: wiseman.id,
      consentPopiaAt: new Date(),
    },
  });
  await prisma.user.upsert({
    where: { email: "door@wiseman.co.za" },
    update: {},
    create: {
      role: "DOOR_STAFF",
      fullName: "Wiseman Door",
      mobileNumber: "0820000002",
      email: "door@wiseman.co.za",
      passwordHash: hashPassword("changeme123"),
      doorAtVenueId: wiseman.id,
      consentPopiaAt: new Date(),
    },
  });

  // ── Vouchers ────────────────────────────────────────────────────────────────
  await prisma.voucher.upsert({
    where: { venueId_slug: { venueId: wiseman.id, slug: "wash-chow-warmup" } },
    update: {},
    create: {
      venueId: wiseman.id,
      title: "The Wash, Chow & Warm-Up",
      slug: "wash-chow-warmup",
      blurb: "Carwash + a plate + early entry. R150 off-peak combo.",
      priceCents: 15000,
      dailyQuantity: 40,
      validDays: [0, 1, 2, 3, 4],
      windowStart: "11:00",
      windowEnd: "18:00",
    },
  });
  await prisma.voucher.upsert({
    where: { venueId_slug: { venueId: mkhize.id, slug: "rooftop-sunset-session" } },
    update: {},
    create: {
      venueId: mkhize.id,
      title: "Rooftop Sunset Session",
      slug: "rooftop-sunset-session",
      blurb: "Pre-game on the rooftop. R120 sundowner pass.",
      priceCents: 12000,
      dailyQuantity: 30,
      validDays: [0, 1, 2, 3, 4],
      windowStart: "16:00",
      windowEnd: "19:00",
    },
  });

  // ── Promoters + a student ───────────────────────────────────────────────────
  await prisma.promoter.upsert({
    where: { handle: "@kwamashu_kid" },
    update: {},
    create: {
      handle: "@kwamashu_kid",
      fullName: "S’bonelo Khumalo",
      mobileNumber: "0830000001",
      campusSlug: "ukzn-howard-college",
      venueId: wiseman.id,
      referralCode: "KK" + crypto.randomBytes(3).toString("hex").toUpperCase(),
    },
  });
  await prisma.user.upsert({
    where: { mobileNumber: "0840000001" },
    update: {},
    create: {
      role: "STUDENT",
      fullName: "Thando Student",
      mobileNumber: "0840000001",
      campusSlug: "ukzn-howard-college",
      consentPopiaAt: new Date(),
    },
  });

  // eslint-disable-next-line no-console
  console.log("Seed complete:", { wiseman: wiseman.slug, mkhize: mkhize.slug });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
