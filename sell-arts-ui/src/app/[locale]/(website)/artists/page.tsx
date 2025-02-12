import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getAllArtistProfiles } from "@/actions/artists";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, ShoppingCart } from "lucide-react";
import ArtistFilter from "./ArtistFilter";

export default async function ArtistGrid() {
  const t = await getTranslations("artistsPage");

  // Fonction pour charger tous les artistes
  async function fetchAllArtists() {
    let allArtists: any[] = [];
    let page = 0;
    let pageSize = 10;
    let hasMore = true;

    while (hasMore) {
      const response = await getAllArtistProfiles(page, "", "ARTIST", pageSize);
      allArtists = [...allArtists, ...response.data.content];

      if (response.data.content.length < pageSize) {
        hasMore = false; // Si la dernière page a moins d'éléments, on arrête
      } else {
        page++;
      }
    }
    return allArtists;
  }

  const artists = await fetchAllArtists(); // Récupère **tous les artistes** avant l'affichage

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t("Artists")}</h1>
      <ArtistFilter />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <Link href={`/artists/${artist?.id}`} key={artist.id}>
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4">
                <Image src={artist.userInfo?.profileUrl ?? "https://picsum.photos/500?id=1"} alt={artist.userInfo?.name ?? ""} layout="fill" objectFit="cover" className="rounded-md" />
                </div>
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{artist.userInfo?.name}</h2>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Palette className="w-4 h-4 mr-2" />
                  {artist.noOfArtWorks?.toString()} {t("Artworks")}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {artist.noOfOrders} {t("Purchases")}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
