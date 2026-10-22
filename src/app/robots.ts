import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/** Todo indexable salvo la página de grabación (solo existe en desarrollo). Sitemap solo con dominio. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/grabar" },
    ...(site.url ? { sitemap: `${site.url}/sitemap.xml` } : {}),
  };
}
