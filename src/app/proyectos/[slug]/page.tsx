import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { Header } from "@/components/Header";
import { ProjectPage } from "@/components/Project/ProjectPage";
import { ScrollEffects } from "@/components/ScrollEffects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const title = `${p.name} — ${p.category} | Fary Labs`;
  return {
    title,
    description: `${p.description} Concepto de Fary Labs.`,
    openGraph: { title, description: p.description, images: [{ url: p.thumbnail, width: 1600, height: 900 }] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return (
    <>
      <Header home={false} />
      <main id="contenido">
        <ProjectPage project={project} />
      </main>
      <ScrollEffects />
    </>
  );
}
