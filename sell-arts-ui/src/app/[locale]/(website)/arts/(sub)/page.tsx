import { getAllArtWorks, getMyArtWorks } from "@/actions/artwork";
import ArtCard from "@/components/ArtCard";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/ui/custom-pagination";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

const ArtsPage = async ({ searchParams }: any) => {
  const search = await searchParams;
  const res = await getAllArtWorks(search["page"] || 0, search["paintingType"] || "", search["materialType"] || "", search["price"] || "", search["title"] || "");
  const t = await getTranslations("artsPage");

  if (!res.success) {
    return <div>Unable to load</div>;
  }
  const artworks = res.data.content;

  return (
    <main className="flex-grow">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6" id="artGrid">
        {artworks.map((artwork) => (
          <Link key={artwork.id} href={`arts/${artwork.id}`}>
            <ArtCard artwork={artwork} />
          </Link>
        ))}
      </div>
      {res.data.content.length === 0 && <p className="text-center text-gray-500 mt-8">{t("noArt")}</p>}

      {/* Pagination placeholder */}
      <CustomPagination page={res.data} />
    </main>
  );
};

export default ArtsPage;
