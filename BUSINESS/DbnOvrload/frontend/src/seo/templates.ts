// Programmatic SEO templates. High-intent query templates drive hyper-targeted,
// indexable titles, descriptions and JSON-LD for each dynamic page. No generic
// boilerplate — every string is built from the venue/campus/day variables.

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://dbnovrload.co.za";

const DAY_LABEL: Record<string, string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  jsonLd: Record<string, unknown>[];
  ogImage?: string;
  /** Increments when fresh UGC lands, signalling crawlers to revisit. */
  contentFreshness?: string;
}

export interface CultureVenue {
  name: string;
  slug: string;
  neighborhood: string;
  neighborhoodTag: string;
  description: string;
  heroImageUrl?: string | null;
  lat?: number | null;
  lng?: number | null;
}

export function cultureMeta(
  venue: CultureVenue,
  vouchers: { title: string; priceCents: number }[],
  ugcUpdatedAt?: string
): MetaTags {
  const cheapest = vouchers.length
    ? Math.min(...vouchers.map((v) => v.priceCents)) / 100
    : null;

  // e.g. "Wiseman Carwash KwaMashu G-Section — Gqom student specials | DbnOvrload"
  const title = `${venue.name} ${venue.neighborhoodTag} — Gqom student specials | DbnOvrload`;
  const description =
    `${venue.name} in ${venue.neighborhoodTag}, Durban. ` +
    (cheapest != null
      ? `Off-peak student combos from R${cheapest.toFixed(0)}. `
      : "") +
    `Live Gqom energy, line-skip passes, pay at the till. ${venue.description}`;

  const canonical = `${SITE_URL}/culture/${venue.neighborhood}/${venue.slug}`;

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "NightClub",
      name: venue.name,
      description: venue.description,
      url: canonical,
      address: {
        "@type": "PostalAddress",
        addressLocality: venue.neighborhoodTag,
        addressRegion: "KwaZulu-Natal",
        addressCountry: "ZA",
      },
      ...(venue.lat && venue.lng
        ? { geo: { "@type": "GeoCoordinates", latitude: venue.lat, longitude: venue.lng } }
        : {}),
      ...(venue.heroImageUrl ? { image: venue.heroImageUrl } : {}),
      makesOffer: vouchers.map((v) => ({
        "@type": "Offer",
        name: v.title,
        price: (v.priceCents / 100).toFixed(2),
        priceCurrency: "ZAR",
      })),
    },
    breadcrumb([
      { name: "Culture", url: `${SITE_URL}/culture` },
      { name: venue.neighborhoodTag, url: `${SITE_URL}/culture/${venue.neighborhood}` },
      { name: venue.name, url: canonical },
    ]),
  ];

  return {
    title,
    description,
    canonical,
    jsonLd,
    ogImage: venue.heroImageUrl ?? undefined,
    contentFreshness: ugcUpdatedAt,
  };
}

export function specialsMeta(
  campusSlug: string,
  day: string,
  specials: { title: string; venueName: string; priceCents: number; neighborhoodTag: string }[]
): MetaTags {
  const campusName = labelFromSlug(campusSlug);
  const dayLabel = DAY_LABEL[day] ?? day;

  // e.g. "Student drink specials near DUT Steve Biko — Wednesday | DbnOvrload"
  const title = `Student specials near ${campusName} — ${dayLabel} tonight | DbnOvrload`;
  const description =
    `${dayLabel} student specials and party deals near ${campusName}, Durban. ` +
    specials
      .slice(0, 3)
      .map((s) => `${s.title} at ${s.venueName} (R${(s.priceCents / 100).toFixed(0)})`)
      .join(", ") +
    ". Pay at the till.";

  const canonical = `${SITE_URL}/specials/${campusSlug}/${day}`;

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${dayLabel} student specials near ${campusName}`,
      itemListElement: specials.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${s.title} — ${s.venueName}`,
      })),
    },
    breadcrumb([
      { name: "Specials", url: `${SITE_URL}/specials` },
      { name: campusName, url: `${SITE_URL}/specials/${campusSlug}` },
      { name: dayLabel, url: canonical },
    ]),
  ];

  return { title, description, canonical, jsonLd };
}

function breadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function labelFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length <= 4 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}
