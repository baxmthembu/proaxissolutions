import { prisma } from "../lib/prisma";
import { env } from "../config/env";

/**
 * Promoter surge rewards.
 * When a promoter drives more than PROMOTER_SURGE_THRESHOLD (default 50) entries
 * in a single afternoon, pipe a real-time message into the team's Slack/Discord
 * so rewards are triggered promptly. Deduped per promoter per day.
 */
const firedToday = new Map<string, string>(); // promoterId -> yyyy-mm-dd

function afternoonWindow(now = new Date()): { start: Date; key: string } {
  const start = new Date(now);
  start.setHours(12, 0, 0, 0); // 12:00 local = "afternoon"
  const key = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  return { start, key };
}

export async function maybeFirePromoterSurge(promoterId: string, venueId: string): Promise<void> {
  const { start, key } = afternoonWindow();
  if (firedToday.get(promoterId) === key) return;

  const entries = await prisma.scan.count({
    where: { promoterId, scannedAt: { gte: start } },
  });
  if (entries <= env.PROMOTER_SURGE_THRESHOLD) return;

  firedToday.set(promoterId, key);

  const [promoter, venue] = await Promise.all([
    prisma.promoter.findUnique({ where: { id: promoterId } }),
    prisma.venue.findUnique({ where: { id: venueId } }),
  ]);

  await postTeamWebhook({
    title: "🔥 Promoter surge",
    text: `${promoter?.handle ?? promoterId} just passed ${entries} entries this afternoon at ${
      venue?.name ?? venueId
    }. Trigger their reward.`,
    fields: [
      { name: "Promoter", value: promoter?.handle ?? promoterId },
      { name: "Entries (since 12:00)", value: String(entries) },
      { name: "Venue", value: venue?.name ?? venueId },
    ],
  });
}

/** Posts a payload that both Slack and Discord incoming webhooks accept. */
export async function postTeamWebhook(msg: {
  title: string;
  text: string;
  fields?: { name: string; value: string }[];
}): Promise<void> {
  if (!env.PROMOTER_WEBHOOK_URL) return;
  const lines = [msg.text, ...(msg.fields ?? []).map((f) => `• *${f.name}:* ${f.value}`)];
  const content = `*${msg.title}*\n${lines.join("\n")}`;
  try {
    await fetch(env.PROMOTER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `text` => Slack, `content` => Discord. Sending both is harmless.
      body: JSON.stringify({ text: content, content }),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Team webhook failed", err);
  }
}
