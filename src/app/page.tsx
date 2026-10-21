import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { HeroShowcase } from "@/components/Hero/HeroShowcase";
import { Featured } from "@/components/Featured/Featured";
import { Catalog } from "@/components/Catalog/Catalog";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { FinalCTA } from "@/components/FinalCTA";
import { ScrollEffects } from "@/components/ScrollEffects";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function Home() {
  return (
    <>
      <Intro />
      <Header />
      <main id="contenido">
        <HeroShowcase />
        <Featured />
        <Catalog />
        <Services />
        <Process />
        <FinalCTA />
      </main>
      <SmoothScroll />
      <ScrollEffects />
    </>
  );
}
