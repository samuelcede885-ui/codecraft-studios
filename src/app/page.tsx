import { preload } from "react-dom";
import { site } from "@/config/site";
import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { HeroExperience } from "@/components/hero/HeroExperience";
import { FeaturedProject } from "@/components/portfolio/FeaturedProject";
import { ProjectCategories } from "@/components/portfolio/ProjectCategories";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { ServicesAccordion } from "@/components/services/ServicesAccordion";
import { PricingPlans } from "@/components/plans/PricingPlans";
import { ProcessTimeline } from "@/components/process/ProcessTimeline";
import { FinalCTA } from "@/components/FinalCTA";
import { ScrollEffects } from "@/components/ScrollEffects";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ContextCursor } from "@/components/ContextCursor";
import { InspirationShowreel } from "@/components/showreel/InspirationShowreel";
import { MobileQuoteBar } from "@/components/MobileQuoteBar";
import { withBase } from "@/lib/paths";

/** Datos estructurados: solo lo que es real (nombre, descripción y, si existe, el dominio). */
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  description: site.description,
  ...(site.url ? { url: site.url } : {}),
};

export default function Home() {
  // Póster del video del hero: solo en la portada, que es donde se usa.
  preload(withBase("/projects/gramercy/poster.webp"), { as: "image", fetchPriority: "high" });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <Intro />
      <Header />
      <main id="contenido">
        <HeroExperience />
        <FeaturedProject />
        <ProjectGrid />
        <ProjectCategories />
        <ServicesAccordion />
        <PricingPlans />
        <ProcessTimeline />
        <FinalCTA />
      </main>
      <SmoothScroll />
      <ScrollEffects />
      <ContextCursor />
      <InspirationShowreel />
      <MobileQuoteBar />
    </>
  );
}
