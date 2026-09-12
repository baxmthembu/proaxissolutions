import { useState } from "react";
import { api } from "../lib/api";

interface ShareAsset {
  id: string;
  channel: string;
  caption: string;
  trackingUrl: string;
  intents: { whatsapp: string; instagram: string; tiktok: string };
}

/**
 * Clout-Share — when a student locks a premium pass / wins a ticket, mint a
 * platform-tailored shareable asset with an attached tracking link.
 */
export function CloutShare({
  passName,
  venueName,
  promoterId,
}: {
  passName: string;
  venueName: string;
  promoterId?: string;
}) {
  const [assets, setAssets] = useState<Record<string, ShareAsset>>({});
  const [busy, setBusy] = useState<string | null>(null);

  async function generate(channel: "whatsapp" | "tiktok" | "instagram") {
    setBusy(channel);
    try {
      const asset = await api.post<ShareAsset>("/api/cloutshare", {
        channel,
        passName,
        venueName,
        promoterId,
      });
      setAssets((a) => ({ ...a, [channel]: asset }));
      const url = asset.intents[channel];
      if (url) window.open(url, "_blank", "noopener");
    } finally {
      setBusy(null);
    }
  }

  const channels: { key: "whatsapp" | "tiktok" | "instagram"; label: string }[] = [
    { key: "whatsapp", label: "WhatsApp Status" },
    { key: "tiktok", label: "TikTok" },
    { key: "instagram", label: "IG Stories" },
  ];

  return (
    <div className="rounded-xl border border-volt/30 bg-slate p-4">
      <h3 className="font-display text-sm font-semibold text-volt">Flex it · Clout-Share</h3>
      <p className="mt-1 text-xs text-neutral-400">
        Drop your pass to the timeline. Tracked link attached.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {channels.map((c) => (
          <button
            key={c.key}
            onClick={() => generate(c.key)}
            disabled={busy === c.key}
            className="rounded-lg border border-volt/40 px-2 py-2 text-xs font-semibold text-volt
                       transition hover:bg-volt hover:text-pitch disabled:opacity-50"
          >
            {busy === c.key ? "…" : c.label}
          </button>
        ))}
      </div>
      {Object.values(assets).map((a) => (
        <p key={a.id} className="mt-2 truncate text-[11px] text-neutral-500" title={a.caption}>
          {a.channel}: {a.trackingUrl}
        </p>
      ))}
    </div>
  );
}
