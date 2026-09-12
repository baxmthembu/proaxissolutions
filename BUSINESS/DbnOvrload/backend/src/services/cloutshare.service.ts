import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";

/**
 * Clout-share — when a student locks a premium pass or wins a ticket, mint a
 * platform-tailored shareable asset with an attached tracking link.
 */
type Channel = "whatsapp" | "tiktok" | "instagram";

const CAPTIONS: Record<Channel, (ctx: ShareContext) => string> = {
  whatsapp: (c) => `🎟️ Locked my ${c.passName} for ${c.venueName} tonight on DbnOvrload. Pull up. ${c.url}`,
  tiktok: (c) => `POV: you pulled up to ${c.venueName} with the DbnOvrload ${c.passName} 🔊⚡ #Gqom #Durban`,
  instagram: (c) => `${c.venueName} loading… ${c.passName} secured ⚡ via @dbnovrload`,
};

export interface ShareContext {
  passName: string;
  venueName: string;
  promoterId?: string;
  imageUrl?: string;
}

export async function createShareAsset(channel: Channel, ctx: ShareContext) {
  const trackingId = crypto.randomBytes(6).toString("base64url");
  const ref = ctx.promoterId
    ? (await prisma.promoter.findUnique({ where: { id: ctx.promoterId } }))?.referralCode
    : undefined;

  const url = `${env.WEB_BASE_URL}/s/${trackingId}${ref ? `?ref=${ref}` : ""}`;
  const caption = CAPTIONS[channel]({ ...ctx, url } as ShareContext & { url: string });

  const asset = await prisma.shareAsset.create({
    data: {
      channel,
      caption,
      imageUrl: ctx.imageUrl,
      trackingUrl: url,
      promoterId: ctx.promoterId,
    },
  });

  return {
    id: asset.id,
    channel,
    caption,
    trackingUrl: url,
    // Native share-intent deep links the frontend can open directly.
    intents: {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(caption)}`,
      instagram: url, // IG Stories is opened via the share sheet with the asset image
      tiktok: url,
    },
  };
}

export async function registerShareClick(trackingId: string): Promise<void> {
  const url = `${env.WEB_BASE_URL}/s/${trackingId}`;
  await prisma.shareAsset.updateMany({
    where: { trackingUrl: { startsWith: url } },
    data: { clicks: { increment: 1 } },
  });
}
