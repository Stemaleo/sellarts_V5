import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, ShoppingCart, User, Verified } from "lucide-react";
import { ReactNode, use } from "react";
import { getArtistProfileWithInfo } from "@/actions/artists";
import { PageProps } from "@/lib/api";
import { StarRatingComponent } from "@/components/star-rating";
import ArtCard from "@/components/ArtCard";
import Link from "next/link";
import ColabRequestButton from "./colabRequestButton";
import { Button } from "@/components/ui/button";
import SubscribeButton from "./subscribeBtn";
import ArtistNav from "./ArtistNav";
import { getTranslations } from "next-intl/server";

export default async function ArtistPage({ params, children }: any) {
  const param = await params;
  const res = await getArtistProfileWithInfo(param.id);
  const t = await getTranslations();

  if (!res.success) {
    return <div>Unable to fetch</div>;
  }

  const artist = res.data.user;
  const artWorks = res.data.artWorks;

  return (
    <div className="container mx-auto p-4">
      <div className="relative">
        <Image src={artist.artistProfile?.coverUrl ?? "/"} className="h-72 w-full object-cover rounded-lg" alt={artist.name} width={900} height={300} />
        <div className="absolute h-32 w-32">
          <Image src={artist.profileImageUrl} alt={artist.name} width={300} height={300} className="rounded-full border-2 absolute left-4 bottom-0 -translate-y-[50%] shadow-lg aspect-square object-cover" />
        </div>
      </div>

      <div className="grid gap-8 mt-20">
        <div>
          <div className="flex gap-4 items-center">
            <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>

            <div className="flex gap-2">
              {artist.verified && <Verified className="text-primary" />}
              <p>
                {res.data.subscribeCount} {t("common.subscribers")}
              </p>
            </div>
          </div>
          <StarRatingComponent totalStars={5} />

          <div className="flex gap-4 mb-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Palette className="w-4 h-4" />
              {res.data.noOfArtWorks} {t("artistsPage.Artworks")}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              {res.data.noOfOrders} {t("artistsPage.Purchases")}
            </Badge>
            {res.data.user.artistProfile?.artistType == "ARTIST" && <ColabRequestButton artistId={res.data.user.id.toString()} />}

            <SubscribeButton sub={res.data.subscribed} artistId={res.data.user.id} />
          </div>
          {artist.artistProfile?.bio && <h2 className="text-2xl font-semibold mb-2">{t("artistsPage.biography")}</h2>}
          <p className="text-gray-700 mb-6">{artist.artistProfile?.bio}</p>
        </div>
      </div>

      <ArtistNav param={param} artist={artist} />

      {children}
    </div>
  );
}
