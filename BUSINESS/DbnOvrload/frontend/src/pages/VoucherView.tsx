import { useCallback, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api, formatRand, type UnlockedToken } from "../lib/api";
import { VoucherCountdown } from "../components/VoucherCountdown";
import { ScarcityTicker } from "../components/ScarcityTicker";
import { CloutShare } from "../components/CloutShare";

type Phase = "ready" | "unlocking" | "live" | "expired" | "error";

/**
 * Student voucher view — the dynamic checkout. Unlock a combo, the 60s ring
 * starts, and the student walks the code to the till before it expires.
 */
export function VoucherView() {
  const { voucherId = "" } = useParams();
  const [search] = useSearchParams();
  const promoterRef = search.get("ref") ?? undefined;

  const [phase, setPhase] = useState<Phase>("ready");
  const [token, setToken] = useState<UnlockedToken | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unlock = useCallback(async () => {
    setPhase("unlocking");
    setError(null);
    try {
      const t = await api.post<UnlockedToken>(`/api/vouchers/${voucherId}/unlock`, { promoterRef });
      setToken(t);
      setPhase("live");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not unlock");
      setPhase("error");
    }
  }, [voucherId, promoterRef]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-5 bg-pitch px-4 py-8">
      <header className="flex items-center justify-between">
        <span className="font-display text-xl font-bold tracking-tight text-volt">DbnOvrload</span>
        <span className="rounded-full border border-volt/40 px-3 py-1 text-[11px] uppercase tracking-widest text-volt">
          Pay at the till
        </span>
      </header>

      <ScarcityTicker voucherId={voucherId} />

      {phase === "live" && token ? (
        <section className="flex flex-col items-center gap-6 rounded-2xl bg-slate p-6 animate-pulseVolt">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-white">{token.voucher.title}</h1>
            <p className="text-sm text-neutral-400">
              {token.venue.name} · {formatRand(token.voucher.priceCents)} at the till
            </p>
          </div>

          <VoucherCountdown
            expiresAt={token.expiresAt}
            ttlSeconds={token.ttlSeconds}
            onExpire={() => setPhase("expired")}
          />

          <div className="w-full rounded-xl border-2 border-dashed border-volt bg-pitch p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-neutral-400">Show this code</p>
            <p className="font-display text-4xl font-bold tracking-[0.2em] text-volt">{token.code}</p>
          </div>

          <CloutShare passName={token.voucher.title} venueName={token.venue.name} promoterId={promoterRef} />
        </section>
      ) : phase === "expired" ? (
        <section className="rounded-2xl bg-slate p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-neutral-300">Window closed</h2>
          <p className="mt-2 text-sm text-neutral-500">
            That 60-second pass expired. Numbers move fast — grab another while stock lasts.
          </p>
          <button
            onClick={unlock}
            className="mt-5 w-full rounded-xl bg-volt py-3 font-display font-bold text-pitch shadow-volt"
          >
            Unlock again
          </button>
        </section>
      ) : (
        <section className="rounded-2xl bg-slate p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white">Lock your combo</h2>
          <p className="mt-2 text-sm text-neutral-400">
            One tap unlocks a single-use code. You'll have 60 seconds to show it at the till.
          </p>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <button
            onClick={unlock}
            disabled={phase === "unlocking"}
            className="mt-6 w-full rounded-xl bg-volt py-4 font-display text-lg font-bold text-pitch shadow-volt transition active:scale-[0.98] disabled:opacity-60"
          >
            {phase === "unlocking" ? "Unlocking…" : "Unlock voucher"}
          </button>
          <p className="mt-3 text-[11px] text-neutral-600">
            No payment here. You pay cash/card at the venue's own till.
          </p>
        </section>
      )}
    </main>
  );
}
