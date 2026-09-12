import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { api, formatRand, type DashboardData } from "../lib/api";

/**
 * Private B2B Venue Owner performance dashboard.
 * Surfaces Total Foot Traffic, Off-Peak Utilisation %, Gross Revenue Injected,
 * and the ranked promoter conversion table — which is INTENTIONALLY never shown
 * in the student app.
 */
export function OwnerDashboard() {
  const { venueId = "" } = useParams();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<DashboardData>(`/api/dashboard/${venueId}?days=${days}`)
      .then(setData)
      .catch((e) => setError(e?.message ?? "Failed to load"));
  }, [venueId, days]);

  if (error) return <Shell><p className="text-red-400">{error}</p></Shell>;
  if (!data) return <Shell><p className="text-neutral-500">Loading…</p></Shell>;

  const m = data.metrics;
  const peak = Math.max(1, ...data.footTrafficSeries.map((d) => d.count));

  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{data.venue.name}</h1>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            {data.venue.billingTier === "TIER2_RETAINER" ? "Premium retainer" : "Commission tier"} ·
            owner analytics
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-neutral-700 bg-slate px-3 py-2 text-sm text-neutral-200"
        >
          {[7, 30, 90].map((d) => (
            <option key={d} value={d}>Last {d} days</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Foot traffic" value={m.totalFootTraffic.toLocaleString("en-ZA")} accent="volt" />
        <Metric label="Revenue injected" value={formatRand(m.grossRevenueInjectedCents)} accent="radio" />
        <Metric
          label="Off-peak utilisation"
          value={m.offPeakCapacityUtilisation == null ? "—" : `${m.offPeakCapacityUtilisation}%`}
          accent="volt"
        />
        <Metric label="Commission due" value={formatRand(m.commissionDueCents)} accent="volt" />
      </div>

      <section className="mt-6 rounded-2xl bg-slate p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-neutral-300">Daily foot traffic</h2>
        <div className="flex h-40 items-end gap-1">
          {data.footTrafficSeries.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center justify-end" title={`${d.date}: ${d.count}`}>
              <div
                className="w-full rounded-t"
                style={{ height: `${(d.count / peak) * 100}%`, background: "#00F0FF", minHeight: 2 }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-slate p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-neutral-300">
            Promoter conversion (private)
          </h2>
          <span className="rounded-full bg-pitch px-2 py-1 text-[10px] uppercase tracking-widest text-radio">
            Owners only
          </span>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-widest text-neutral-500">
              <th className="pb-2">#</th>
              <th className="pb-2">Promoter</th>
              <th className="pb-2">Campus</th>
              <th className="pb-2 text-right">Entries</th>
              <th className="pb-2 text-right">Commission</th>
            </tr>
          </thead>
          <tbody>
            {data.promoterLeaderboard.map((p, i) => (
              <tr key={p.promoterId} className="border-t border-neutral-800">
                <td className="py-2 text-neutral-500">{i + 1}</td>
                <td className="py-2 font-semibold text-volt">{p.handle}</td>
                <td className="py-2 text-neutral-400">{p.campus ?? "—"}</td>
                <td className="py-2 text-right text-white">{p.entries}</td>
                <td className="py-2 text-right text-neutral-300">{formatRand(p.commissionCents)}</td>
              </tr>
            ))}
            {data.promoterLeaderboard.length === 0 && (
              <tr><td colSpan={5} className="py-4 text-center text-neutral-600">No promoter-attributed entries yet</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <main className="mx-auto min-h-screen max-w-5xl bg-pitch px-4 py-8">{children}</main>;
}

function Metric({ label, value, accent }: { label: string; value: string; accent: "volt" | "radio" }) {
  return (
    <div className="rounded-2xl bg-slate p-4">
      <p className="text-[11px] uppercase tracking-widest text-neutral-500">{label}</p>
      <p
        className="mt-1 font-display text-2xl font-bold"
        style={{ color: accent === "radio" ? "#39FF14" : "#00F0FF" }}
      >
        {value}
      </p>
    </div>
  );
}
