"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getAllArtistProfiles } from "@/actions/artists";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, ShoppingCart } from "lucide-react";
import ArtistFilter from "./ArtistFilter";

export default function ArtistGrid() {
  const [artists, setArtists] = useState<any[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>(""); // Filtre par nom

  useEffect(() => {
    async function fetchAllArtists() {
      let allArtists: any[] = [];
      let page = 0;
      let pageSize = 10;
      let hasMore = true;

      while (hasMore) {
        const response = await getAllArtistProfiles(page, "", "ARTIST", pageSize);
        allArtists = [...allArtists, ...response.data.content];

        if (response.data.content.length < pageSize) {
          hasMore = false; // Arrêter si on a récupéré tous les artistes
        } else {
          page++;
        }
      }
      setArtists(allArtists);
      setFilteredArtists(allArtists);
    }

    fetchAllArtists();
  }, []);

  // Met à jour la liste des artistes filtrés quand le filtre change
  useEffect(() => {
    if (filter) {
      setFilteredArtists(artists.filter(artist => artist.userInfo?.name.toLowerCase().includes(filter.toLowerCase())));
    } else {
      setFilteredArtists(artists);
    }
  }, [filter, artists]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Artistes</h1>
      <ArtistFilter onFilterChange={setFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredArtists.map((artist) => (
          <Link href={`/artists/${artist?.id}`} key={artist.id}>
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4">
                  <Image src={artist.userInfo?.profileUrl ?? "https://picsum.photos/500?id=1"} alt={artist.userInfo?.name ?? ""} layout="fill" objectFit="cover" className="rounded-md" />
                </div>
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{artist.userInfo?.name}</h2>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Palette className="w-4 h-4 mr-2" />
                  {artist.noOfArtWorks?.toString()} œuvres
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {artist.noOfOrders} achats
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
