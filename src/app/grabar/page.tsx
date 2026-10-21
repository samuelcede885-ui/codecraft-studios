import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordStage } from "@/components/reel/RecordStage";

export const metadata: Metadata = { title: "Grabación", robots: { index: false, follow: false } };

/**
 * Página de trabajo para grabar las bobinas a video (scripts/record-reels.mjs).
 * Solo existe con `npm run dev`; en producción devuelve 404.
 */
export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <RecordStage />;
}
