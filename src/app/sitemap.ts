import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/** Vacío hasta que se configure el dominio (NEXT_PUBLIC_SITE_URL). */
export default function sitemap(): MetadataRoute.Sitemap {
  return site.url ? [{ url: site.url, changeFrequency: "monthly", priority: 1 }] : [];
}
