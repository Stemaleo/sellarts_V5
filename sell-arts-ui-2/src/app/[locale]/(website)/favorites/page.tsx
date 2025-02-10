import { getMyFav } from "@/actions/fav";
import ArtCard from "@/components/ArtCard";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const FavPage = async () => {
  const res = await getMyFav();
  const t = await getTranslations();
  if (!res.success) {
    return <div>Unable to load</div>;
  }
  const artworks = res.data;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("common.favorite-artworks")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6" id="artGrid">
        {artworks.map((artwork) => (
          <Link key={artwork.id} href={`arts/${artwork.id}`}>
            <ArtCard artwork={artwork} />
          </Link>
        ))}
      </div>
      {res.data.length === 0 && <p className="text-center text-gray-500 mt-8">{t("common.no-favorites-yet")}</p>}
    </div>
  );
};

export default FavPage;
