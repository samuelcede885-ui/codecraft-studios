import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

/** Portada y case studies. Sin dominio público (site.url) queda vacío: un sitemap exige URLs absolutas. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({ url: `${site.url}/proyectos/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
