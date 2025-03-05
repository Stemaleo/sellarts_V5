'use client'
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
      
    params.then( async(response: any) => {
      // const t = await getTranslations()
      Promise.all([
        getArtWorkById(response.id),
        fetchMethodAndStyle(response.id),
       
      ])
      .then(([artworkData, methodStyleData]) => {
        setRes(artworkData);
        setRespo(methodStyleData);
        // setT(translations); 
        setArtwork(artworkData);
        setMethodStyle(methodStyleData);
      })
      .catch((error) => {
        console.error("Error fetching artwork:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    });
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!res?.success) {
    return <div>Unable to load artwork</div>;
  }

  const art = res.data.artwork;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <SelectImage art={art} />
        <div>
          {art.inStock ? <Badge className="z-10 top-2 right-2 bg-green-500">In stock</Badge> : <Badge className="z-10 top-2 right-2 bg-red-500">Sold</Badge>}
          <h1 className="text-3xl font-bold mb-2 mt-4">{art.title}</h1>
          <p className="text-xl mb-2">
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
          <p className="text-2xl font-bold mb-6 mt-4">
            {convertPrice(art.price, currency)} {currency}
          </p>
          <p className="mb-6">{art.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold">{translations.style}</p>
              <p>{respo.data.artworks.edges[0].node.style.name}</p>
            </div>
            <div>
              <p className="font-semibold">{translations.method}</p>
              <p>{respo.data.artworks.edges[0].node.method.name}</p>
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
          <div className="flex space-x-4">
            <AddToCartBtn art={art} />
            <MakeProposalBtn artWork={art} />
            <AddToFav art={art} />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">{translations['related-artworks']}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {res.data.relatedArtworks.map((relatedArtwork: any) => (
          <Link key={relatedArtwork.id} href={`/arts/${relatedArtwork.id}`}>
            <ArtCard artwork={relatedArtwork} />
          </Link>
        ))}
      </div>
    </div>
  );
}
