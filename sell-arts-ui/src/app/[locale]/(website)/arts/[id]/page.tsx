
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { fetchMethodAndStyle, getArtWorkById } from "@/actions/artwork";
import { PaintingType, paintingTypeToText } from "@/lib/constants";
import AddToCartBtn from "./AddToCartBtn";
import SelectImage from "@/components/SelectImage";
import AddToFav from "./AddToFavBtn";
import Link from "next/link";
import ArtCard from "@/components/ArtCard";
import MakeProposalBtn from "./MakeProposalBtn";
import moment from "moment";
import { getTranslations } from "next-intl/server";
import { GET_ARTWORK_BY_ID } from "@/actions/queries/artwork/querieArtwork";
import axios from "axios";
import { useState } from "react";
import { MethodType, StyleType } from "@/lib/type";

interface Artwork {
  id: number;
  imageUrl: string;
  title: string;
  artistName: string;
  price: number;
  description: string;
  type: string;
  category: string;
  material: string;
  dimensions: string;
}

const relatedArtworks: Artwork[] = [
  {
    id: 2,
    imageUrl: "/placeholder.svg?height=300&width=400",
    title: "Colorful Chaos",
    artistName: "Alex Rivera",
    price: 950,
    description: "A bold and energetic abstract piece.",
    type: "Painting",
    category: "Abstract",
    material: "Oil on Canvas",
    dimensions: '24" x 36"',
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg?height=300&width=400",
    title: "Geometric Dreams",
    artistName: "Sophia Lee",
    price: 1100,
    description: "An intricate composition of geometric shapes.",
    type: "Digital Print",
    category: "Abstract",
    material: "Archival Ink on Paper",
    dimensions: '30" x 30"',
  },
  {
    id: 4,
    imageUrl: "/placeholder.svg?height=300&width=400",
    title: "Textured Waves",
    artistName: "Marcus Johnson",
    price: 1350,
    description: "A textured abstract representation of ocean waves.",
    type: "Mixed Media",
    category: "Abstract",
    material: "Acrylic and Sand on Canvas",
    dimensions: '40" x 30"',
  },
];

export default async function ArtworkDetail({ params }: any) {
  const pars = await params;
  const res = await getArtWorkById(pars.id);
  const t = await getTranslations();
  const respo = await fetchMethodAndStyle(pars.id)
  



  if (!res.success) {
    return <div>Unable to load</div>;
  }

  const art = res.data.artwork;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2  gap-4 mb-6">
        <SelectImage art={art} />
        <div>
          {art.inStock ? <Badge className="z-10 top-2 right-2 bg-green-500">In stock</Badge> : <Badge className=" z-10 top-2 right-2 bg-red-500">Sold</Badge>}
          <h1 className="text-3xl font-bold mb-2 mt-4">{art.title}</h1>
          <p className="text-xl mb-2">
            by{" "}
            <Link href={`/artists/${art.artistProfile.id}`} className="underline underline-offset-2">
              {art.ownerName}
            </Link>
          </p>
          {art.ownerName != art.artistName && (
            <p>
              Credits,{" "}
              <Link href={`/artists/${art.credits.id}`} className="underline underline-offset-2">
                {art.artistName}
              </Link>
            </p>
          )}
          <p className="text-2xl font-bold mb-6 mt-4">FCFA {art.price}</p>
          <p className="mb-6">{art.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold">{t("common.style")}</p>
              <p>{respo.data.artworks.edges[0].node.style.name}</p>
            </div>
            <div>
              <p className="font-semibold">{t("common.method")}</p>
              <p>{respo.data.artworks.edges[0].node.method.name}</p>
            </div>
            <div>
              <p className="font-semibold">{t("common.material")}</p>
              <p>{art.materialType.name}</p>
            </div>
            <div>
              <p className="font-semibold">{t("common.dimensions")}</p>
              <p>{`${art.width} cm x ${art.height} cm`}</p>
            </div>
            <div>
              <p className="font-semibold">{t("common.date")}</p>
              <p>{moment(art.createdAt).format("D MMM Y")}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <AddToCartBtn art={art} />
            <MakeProposalBtn artWork={art} />
            <AddToFav art={art} />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">{t("common.related-artworks")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {res.data.relatedArtworks.map((relatedArtwork) => (
          <Link key={relatedArtwork.id} href={`/arts/${relatedArtwork.id}`}>
            <ArtCard artwork={relatedArtwork} />
          </Link>
        ))}
      </div>
    </div>
  );
}
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

