import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { ScrollStory } from "@/components/ScrollStory/ScrollStory";
import { StoryCTA } from "@/components/StoryCTA";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
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
        <ScrollStory />
        <StoryCTA />
        <Services />
        <Portfolio />
        <Process />
        <FinalCTA />
      </main>
      <SmoothScroll />
      <ScrollEffects />
    </>
  );
}
