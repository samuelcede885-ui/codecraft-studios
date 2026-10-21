import { preload } from "react-dom";
import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { HeroShowcase } from "@/components/Hero/HeroShowcase";
import { Featured } from "@/components/Featured/Featured";
import { Build } from "@/components/Build";
import { Catalog } from "@/components/Catalog/Catalog";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { FinalCTA } from "@/components/FinalCTA";
import { ScrollEffects } from "@/components/ScrollEffects";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ContextCursor } from "@/components/ContextCursor";
import { Showreel } from "@/components/Showreel/Showreel";
import { MobileQuoteBar } from "@/components/MobileQuoteBar";

export default function Home() {
  // Póster del video del hero: solo en la portada, que es donde se usa.
  preload("/projects/gramercy/poster.webp", { as: "image", fetchPriority: "high" });
  return (
    <>
      <Intro />
      <Header />
      <main id="contenido">
        <HeroShowcase />
        <Featured />
        <Catalog />
        <Build />
        <Services />
        <Process />
        <FinalCTA />
      </main>
      <SmoothScroll />
      <ScrollEffects />
      <ContextCursor />
      <Showreel />
      <MobileQuoteBar />
    </>
  );
}
