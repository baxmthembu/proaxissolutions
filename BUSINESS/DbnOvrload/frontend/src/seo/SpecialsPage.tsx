import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatRand } from "../lib/api";
import { MetaInjector } from "./MetaInjector";
import { specialsMeta, labelFromSlug, type MetaTags } from "./templates";

interface SpecialsResponse {
  campusSlug: string;
  day: string;
  specials: {
    id: string;
    title: string;
    blurb: string;
    priceCents: number;
    venueName: string;
    venueSlug: string;
    neighborhood: string;
    neighborhoodTag: string;
  }[];
}

/** /specials/[campus-slug]/[day-of-week] */
export function SpecialsPage() {
  const { campusSlug = "", day = "" } = useParams();
  const [data, setData] = useState<SpecialsResponse | null>(null);
  const [meta, setMeta] = useState<MetaTags | null>(null);

  useEffect(() => {
    api
      .get<SpecialsResponse>(`/api/seo/specials/${campusSlug}/${day}`)
      .then((d) => {
        setData(d);
        setMeta(specialsMeta(d.campusSlug, d.day, d.specials));
      })
      .catch(() => setData({ campusSlug, day, specials: [] }));
  }, [campusSlug, day]);

  if (!data) return <main className="p-8 text-neutral-500">Loading…</main>;

  return (
    <main className="mx-auto max-w-3xl bg-pitch px-4 py-8">
      {meta && <MetaInjector meta={meta} />}

      <h1 className="font-display text-3xl font-bold text-white">
        {labelFromSlug(day)} specials near {labelFromSlug(campusSlug)}
      </h1>
      <p className="mt-2 text-neutral-400">
        Off-peak combos and party deals close to campus. Pay at the till.
      </p>

      <div className="mt-6 grid gap-3">
        {data.specials.map((s) => (
          <Link
            key={s.id}
            to={`/v/${s.id}`}
            className="flex items-center justify-between rounded-xl bg-slate p-4 transition hover:shadow-volt"
          >
            <div>
              <p className="font-display font-semibold text-white">{s.title}</p>
              <p className="text-sm text-neutral-400">
                {s.venueName} · {s.neighborhoodTag}
              </p>
            </div>
            <p className="font-display font-bold text-volt">{formatRand(s.priceCents)}</p>
          </Link>
        ))}
        {data.specials.length === 0 && (
          <p className="text-neutral-600">No specials listed for {labelFromSlug(day)} yet.</p>
        )}
      </div>
    </main>
  );
}
