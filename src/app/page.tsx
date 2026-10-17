import { Contact } from "@/components/Contact";
import { Cursor } from "@/components/Cursor";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { Metrics } from "@/components/Metrics";
import { Portfolio } from "@/components/Portfolio/Portfolio";
import { Process } from "@/components/Process";
import { ScrollEffects } from "@/components/ScrollEffects";
import { ScrollStory } from "@/components/ScrollStory/ScrollStory";
import { Services } from "@/components/Services/Services";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Statement } from "@/components/Statement";
import { Testimonials } from "@/components/Testimonials";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Intro />
      <Header />
      <main id="contenido">
        <ScrollStory />
        <Services />
        <Statement />
        <Portfolio />
        <Process />
        <Testimonials />
        <Metrics />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>
      <WhatsAppFloat />
      <Cursor />
      <SmoothScroll />
      <ScrollEffects />
    </>
  );
}
