import { use, useState, useTransition } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Palette, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { getAllArtistProfiles } from "@/actions/artists";
import { StarRatingComponent } from "@/components/star-rating";
import CustomPagination from "@/components/ui/custom-pagination";
import { getTranslations } from "next-intl/server";

export default async function ArtistGrid({ searchParams }: any) {
  const search = await searchParams;

  const artists = await getAllArtistProfiles(search["page"] || 0, search["title"] || "", "GALLERY");

  const t = await getTranslations("artistsPage");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t("gallery")}</h1>

      {/* <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <Input type="text" placeholder="Search gallery" className="w-full" />
        </div>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t("Name")}</SelectItem>
            <SelectItem value="artworks">{t("Number of Artworks")}</SelectItem>
            <SelectItem value="purchases">{t("Number of Purchases")}</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.data.content.map((artist) => (
          <Link href={`/artists/${artist?.id}`} key={artist.id}>
            <Card key={artist.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4">
                  <Image src={artist.userInfo?.profileUrl ?? "https://picsum.photos/500?id=1"} alt={artist.userInfo?.name ?? ""} layout="fill" objectFit="cover" className="rounded-md" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{artist.userInfo?.name}</h2>
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
      <CustomPagination page={artists.data} />
    </div>
  );
}
