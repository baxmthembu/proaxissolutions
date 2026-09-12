import { useEffect, useState } from "react";
import { api, type Scarcity } from "../lib/api";

/**
 * Live scarcity ticker. Polls the backend (which derives every number from real
 * rows) and flashes the radioactive-lime micro-copy. No fabricated counts.
 */
export function ScarcityTicker({ voucherId, pollMs = 8000 }: { voucherId: string; pollMs?: number }) {
  const [scarcity, setScarcity] = useState<Scarcity | null>(null);
  const [line, setLine] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .get<Scarcity>(`/api/vouchers/${voucherId}/scarcity`)
        .then((s) => alive && setScarcity(s))
        .catch(() => {});
    load();
    const id = setInterval(load, pollMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [voucherId, pollMs]);

  useEffect(() => {
    if (!scarcity?.microcopy.length) return;
    const id = setInterval(() => setLine((l) => (l + 1) % scarcity.microcopy.length), 3500);
    return () => clearInterval(id);
  }, [scarcity?.microcopy.length]);

  if (!scarcity) return null;
  const low = scarcity.remaining > 0 && scarcity.remaining <= 10;

  return (
    <div className="rounded-xl bg-slate p-3 text-center">
      {scarcity.microcopy.length > 0 && (
        <p className="animate-flash font-display text-sm font-semibold text-radio">
          {scarcity.microcopy[line]}
        </p>
      )}
      <p className="mt-1 text-xs text-neutral-400">
        {scarcity.remaining > 0 ? (
          <>
            <span style={{ color: low ? "#39FF14" : "#00F0FF" }} className="font-bold">
              {scarcity.remaining}
            </span>{" "}
            of {scarcity.dailyQuantity} left today
          </>
        ) : (
          <span className="text-neutral-500">Sold out for today — back tomorrow</span>
        )}
      </p>
    </div>
  );
}
