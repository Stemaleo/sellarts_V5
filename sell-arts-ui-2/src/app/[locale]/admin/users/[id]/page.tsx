import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, ShoppingCart, User } from "lucide-react";
import { use } from "react";
import { getArtistProfileWithInfo, getArtistProfileWithInfoADMIN } from "@/actions/artists";
import { PageProps } from "@/lib/api";
import { StarRatingComponent } from "@/components/star-rating";
import ArtCard from "@/components/ArtCard";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import VerificationSwitch from "./VerificationSwitch";

export default async function ArtistPage(props: PageProps) {
  const params = await props.params;
  const res = await getArtistProfileWithInfoADMIN(params.id);

  if (!res.success) {
    return <div>Unable to fetch</div>;
  }

  const artist = res.data.user;
  const artWorks = res.data.artWorks;

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div>
          <Image src={artist.profileImageUrl} alt={artist.name} width={300} height={300} className="rounded-lg shadow-lg aspect-square object-cover" />
        </div>
        <div>
          <VerificationSwitch artist={artist} />
          <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
          <StarRatingComponent totalStars={5} />

          <div className="flex gap-4 mb-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Palette className="w-4 h-4" />
              {res.data.noOfArtWorks} Artworks
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              {res.data.noOfOrders} Purchases
            </Badge>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Biography</h2>
          <p className="text-gray-700 mb-6">{artist.artistProfile?.bio}</p>
        </div>
      </div>
    </div>
  );
}
