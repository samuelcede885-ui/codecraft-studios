import FinalCTA from "@/components/FinalCTA";
import Header from "@/components/Header";
import Showcase from "@/components/Showcase";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <a href="#contacto" className="skip-link">
        Saltar al contacto
      </a>
      <Header />
      <main>
        <Showcase />
        <FinalCTA />
      </main>
    </>
  );
}
