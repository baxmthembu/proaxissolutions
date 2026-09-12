import { useEffect } from "react";
import type { MetaTags } from "./templates";

/**
 * Runtime meta/JSON-LD injector. Writes <title>, description, canonical,
 * Open Graph, Twitter, and structured-data <script> tags into <head>, and a
 * freshness signal so crawlers see active content loops when new UGC lands.
 *
 * For first-paint indexability, run the same builders server-side (or via a
 * prerender step) — see seo/prerender notes in the README.
 */
export function MetaInjector({ meta }: { meta: MetaTags }) {
  useEffect(() => {
    document.title = meta.title;

    setMeta("name", "description", meta.description);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", meta.canonical);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    if (meta.ogImage) {
      setMeta("property", "og:image", meta.ogImage);
      setMeta("name", "twitter:image", meta.ogImage);
    }
    if (meta.contentFreshness) {
      // Tells crawlers the page has active content loops (latest UGC timestamp).
      setMeta("name", "last-content-update", meta.contentFreshness);
      setMeta("property", "article:modified_time", meta.contentFreshness);
    }

    setCanonical(meta.canonical);
    setJsonLd(meta.jsonLd);

    return () => removeJsonLd();
  }, [meta]);

  return null;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

const JSONLD_ID = "dbnovrload-jsonld";
function setJsonLd(blocks: Record<string, unknown>[]) {
  removeJsonLd();
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = JSONLD_ID;
  script.textContent = JSON.stringify(blocks.length === 1 ? blocks[0] : blocks);
  document.head.appendChild(script);
}
function removeJsonLd() {
  document.getElementById(JSONLD_ID)?.remove();
}
