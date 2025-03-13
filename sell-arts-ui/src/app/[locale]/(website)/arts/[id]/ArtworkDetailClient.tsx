'use client'
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, ImageOff, Loader2 } from "lucide-react";
import { fetchMethodAndStyle, getArtWorkById } from "@/actions/artwork";
import { PaintingType, paintingTypeToText } from "@/lib/constants";
import AddToCartBtn from "./AddToCartBtn";
import SelectImage from "@/components/SelectImage";
import AddToFav from "./AddToFavBtn";
import Link from "next/link";
import ArtCard from "@/components/ArtCard";
import MakeProposalBtn from "./MakeProposalBtn";
import moment from "moment";
import { GET_ARTWORK_BY_ID } from "@/actions/queries/artwork/querieArtwork";
import { useState, useEffect } from "react";
import { MethodType, StyleType } from "@/lib/type";
import { useCurrency } from "@/context/CurrencyContext";
import { convertPrice } from '@/actions/currencyConverter';

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

export default function ArtworkDetail({ params, translations }: { 
  params: Promise<{ id: string }>,
  translations: {
    style: string;
    method: string;
    material: string;
    dimensions: string;
    date: string;
    'related-artworks': string;
  }
}) {
  const [artwork, setArtwork] = useState<any>(null);
  const [methodStyle, setMethodStyle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [res, setRes] = useState<any>(null);
  const [respo, setRespo] = useState<any>(null);
  const { currency } = useCurrency();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await params;
        
        const [artworkData, methodStyleData] = await Promise.all([
          getArtWorkById(response.id),
          fetchMethodAndStyle(response.id),
        ]);
        
        setRes(artworkData);
        setRespo(methodStyleData);
        console.log(methodStyleData, "methodStyleData");
        setArtwork(artworkData);
        setMethodStyle(methodStyleData);
      } catch (error) {
        console.error("Error fetching artwork:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  if (!res?.success) {
    return <div>Unable to load artwork</div>;
  }

  const art = res.data.artwork;
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <SelectImage art={art} />
        <div className="space-y-4">
          {art.inStock ? <Badge className="z-10 top-2 right-2 bg-green-500">In stock</Badge> : <Badge className="z-10 top-2 right-2 bg-red-500">Sold</Badge>}
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 mt-4">{art.title}</h1>
          <p className="text-lg sm:text-xl mb-2">
            by{" "}
            <Link href={`/artists/${art.artistProfile.id}`} className="underline underline-offset-2">
              {art.ownerName}
            </Link>
          </p>
          {art.ownerName !== art.artistName && (
            <p>
              Credits,{" "}
              <Link href={`/artists/${art.credits.id}`} className="underline underline-offset-2">
                {art.artistName}
              </Link>
            </p>
          )}
          <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 mt-2 sm:mt-4">
            {convertPrice(art.price, currency)} {currency}
          </p>
          <p className="mb-4 sm:mb-6">{art.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <p className="font-semibold">{translations.style}</p>
              <p>{respo?.data?.artworks?.edges?.[0]?.node?.style?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">{translations.method}</p>
              <p>{respo?.data?.artworks?.edges?.[0]?.node?.method?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">{translations.material}</p>
              <p>{art.materialType.name}</p>
            </div>
            <div>
              <p className="font-semibold">{translations.dimensions}</p>
              <p>{`${art.width} cm x ${art.height} cm`}</p>
            </div>
            <div>
              <p className="font-semibold">{translations.date}</p>
              <p>{moment(art.createdAt).format("D MMM Y")}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <AddToCartBtn art={art} />
            <MakeProposalBtn artWork={art} />
            <AddToFav art={art} />
          </div>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{translations['related-artworks']}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {res.data.relatedArtworks.map((relatedArtwork: any) => (
          <Link key={relatedArtwork.id} href={`/arts/${relatedArtwork.id}`}>
            <ArtCard artwork={relatedArtwork} />
          </Link>
        ))}
      </div>
    </div>
  );
}
