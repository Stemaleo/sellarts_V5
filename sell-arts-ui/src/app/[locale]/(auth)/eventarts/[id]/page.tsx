"use server"
import { getTranslations } from "next-intl/server";
import ArtworkDetailClient from "./ArtworkDetailClient";
import Navbar from "@/components/NavBar";

export default async function ArtworkDetail({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations('common');
  
  // Create an object with the needed translations
  const translations = {
    style: t('style'),
    method: t('method'),
    material: t('material'),
    dimensions: t('dimensions'),
    date: t('date'),
    'related-artworks': t('related-artworks')
  };

  return (
    <>
      <Navbar />
      <ArtworkDetailClient params={Promise.resolve(params)} translations={translations} />
    </>
  );
}
