import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { coverOf, getProject, projects } from "@/data/projects";
import { site } from "@/config/site";
import { Header } from "@/components/Header";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { ScrollEffects } from "@/components/ScrollEffects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const title = `${p.name} — ${p.category}`;
  const description = p.projectType === "concept" ? `${p.description} Concepto de Fary Labs.` : p.description;
  return {
    title,
    description,
    ...(site.url ? { alternates: { canonical: `/proyectos/${p.slug}` } } : {}),
    openGraph: {
      type: "article",
      title,
      description,
      ...(site.url ? { images: [{ url: coverOf(p), width: 1600, height: 900, alt: `Portada de ${p.name}` }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return (
    <>
      <Header home={false} />
      <main id="contenido">
        <CaseStudy project={project} />
      </main>
      <ScrollEffects />
    </>
  );
}
