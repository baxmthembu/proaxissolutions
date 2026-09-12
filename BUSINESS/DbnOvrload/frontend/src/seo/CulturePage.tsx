import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatRand } from "../lib/api";
import { MetaInjector } from "./MetaInjector";
import { cultureMeta, type CultureVenue, type MetaTags } from "./templates";

interface CultureResponse {
  venue: CultureVenue & { id: string };
  vouchers: { id: string; title: string; blurb: string; priceCents: number; remaining: number }[];
  ugc: { id: string; videoUrl: string; posterUrl?: string; energy: string; createdAt: string }[];
  ugcUpdatedAt: string;
}

/** /culture/[neighborhood]/[venue-slug] */
export function CulturePage() {
  const { neighborhood = "", venueSlug = "" } = useParams();
  const [data, setData] = useState<CultureResponse | null>(null);
  const [meta, setMeta] = useState<MetaTags | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get<CultureResponse>(`/api/seo/culture/${neighborhood}/${venueSlug}`)
      .then((d) => {
        setData(d);
        setMeta(cultureMeta(d.venue, d.vouchers, d.ugcUpdatedAt));
      })
      .catch(() => setNotFound(true));
  }, [neighborhood, venueSlug]);

  if (notFound) return <main className="p-8 text-neutral-400">Venue not found.</main>;
  if (!data || !meta) return <main className="p-8 text-neutral-500">Loading…</main>;

  return (
    <main className="mx-auto max-w-3xl bg-pitch px-4 py-8">
      <MetaInjector meta={meta} />

      {/* H1 carries the high-intent phrase for on-page SEO. */}
      <h1 className="font-display text-3xl font-bold text-white">
        {data.venue.name} — {data.venue.neighborhoodTag}
      </h1>
      <p className="mt-2 text-neutral-400">{data.venue.description}</p>

      <h2 className="mt-8 font-display text-lg font-semibold text-volt">Student specials today</h2>
      <div className="mt-3 grid gap-3">
        {data.vouchers.map((v) => (
          <Link
            key={v.id}
            to={`/v/${v.id}`}
            className="flex items-center justify-between rounded-xl bg-slate p-4 transition hover:shadow-volt"
          >
            <div>
              <p className="font-display font-semibold text-white">{v.title}</p>
              <p className="text-sm text-neutral-400">{v.blurb}</p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-volt">{formatRand(v.priceCents)}</p>
              {v.remaining > 0 && v.remaining <= 10 && (
                <p className="animate-flash text-xs font-semibold text-radio">{v.remaining} left</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {data.ugc.length > 0 && (
        <>
          <h2 className="mt-8 font-display text-lg font-semibold text-volt">Live on the floor</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {data.ugc.map((c) => (
              <video
                key={c.id}
                src={c.videoUrl}
                poster={c.posterUrl}
                muted
                loop
                playsInline
                className="aspect-[9/16] w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
