import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Palette, ShoppingBag, Star } from "lucide-react";
import bg from "@/assets/bg.jpg";
import paint2 from "@/assets/paint2.avif";
import paint1 from "@/assets/paint1.avif";
import paint3 from "@/assets/paint3.avif";
import artist from "@/assets/artist.avif";
import { useTranslations } from "next-intl";
import FeaturedArtistsCarousel from "@/components/Carosel";
import FeaturedArtists from "@/components/FeaturedArtists";
import ArtWork from "@/components/ArtWorkCarosel";
import FeaturedArtGalleries from "@/components/FeaturedArtGalleries";
import ArtistWorks from "@/components/ArtistWorks";
import { use } from "react";
import { getAllRandomArtworks, getARandomArtists, getARandomGallery, getRandomArtists } from "@/actions/home";
import { getAllArtistProfiles } from "@/actions/artists";
import Chatbot from "./chatbot";


export const metadata = {
  title: "Sellarts - Marketplace d'art africain contemporain",
  description:
    "Sellarts est une marketplace dédiée à l'art africain contemporain, mettant en relation artistes, collectionneurs et passionnés à l’échelle mondiale.",
  openGraph: {
    title: "Sellarts - Marketplace d'art africain contemporain",
    description:
      "Sellarts connecte artistes, collectionneurs et passionnés d’art africain contemporain à l’échelle mondiale.",
    type: "website",
    // images: ["https://sellarts.com/images/og-image.jpg"], // décommente si image disponible
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Sellarts - Marketplace d'art africain contemporain",
  //   description:
  //     "Sellarts connecte artistes, collectionneurs et passionnés d’art africain contemporain à l’échelle mondiale.",
  //   images: ["https://sellarts.com/images/twitter-image.jpg"],
  // },
};

export default function BentoLanding() {
  const res = use(getAllRandomArtworks());
  const futuresRes = use(getAllRandomArtworks());
  const featureArtists = use(getRandomArtists());
  const featureArtist = use(getARandomArtists());
  const artists = use(getARandomGallery());
  // const artists = use(getAllArtistProfiles(0, "", "GALLERY", 3));

  const t = useTranslations("hero");

  return (
    <div className="min-h-screen bg-gradient-to-b  pb-12">
      <FeaturedArtistsCarousel artworks={res.data} />
      <FeaturedArtists artists={featureArtists.data} />
      <ArtWork artworks={futuresRes.data} />
      {featureArtist.data != null && <ArtistWorks artist={featureArtist.data} />}
      <FeaturedArtGalleries galleries={artists.data} />
      {/* <Chatbot /> */}
    </div>
  );
}


