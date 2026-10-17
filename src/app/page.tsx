import { Header } from "@/components/Header";
import { ShowcaseStory } from "@/components/ShowcaseStory";
import { Portfolio, Process, Services } from "@/components/Sections";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollEffects } from "@/components/ScrollEffects";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <ShowcaseStory />
        <Services />
        <Portfolio />
        <Process />
        <Contact />
      </main>
      <Footer />
      <SmoothScroll />
      <ScrollEffects />
    </>
  );
}
