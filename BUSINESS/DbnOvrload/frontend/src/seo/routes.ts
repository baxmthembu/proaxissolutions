// Declarative registry of the programmatic SEO route templates. A prerender /
// sitemap build step (or an SSR layer) reads this together with GET /api/seo/sitemap
// to emit one statically-indexable page per URL.

export interface SeoRouteTemplate {
  id: string;
  pattern: string; // react-router path
  /** High-intent queries each generated page targets. */
  targetQueries: string[];
  /** Builds the API path that hydrates the page from its route params. */
  apiPath: (params: Record<string, string>) => string;
}

export const SEO_ROUTES: SeoRouteTemplate[] = [
  {
    id: "culture-venue",
    pattern: "/culture/:neighborhood/:venueSlug",
    targetQueries: [
      "Best Gqom clubs in Durban CBD",
      "Wiseman Carwash KwaMashu G section student specials",
      "KwaMashu shisanyama Gqom night",
    ],
    apiPath: (p) => `/api/seo/culture/${p.neighborhood}/${p.venueSlug}`,
  },
  {
    id: "campus-specials",
    pattern: "/specials/:campusSlug/:day",
    targetQueries: [
      "Student drink specials Florida Road tonight",
      "DUT Steve Biko Campus mid-week party deals",
      "UKZN Howard College student specials Wednesday",
    ],
    apiPath: (p) => `/api/seo/specials/${p.campusSlug}/${p.day}`,
  },
];

export const DAYS_OF_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;
