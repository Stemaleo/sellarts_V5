"use client";
import { ArtWorkDTO } from "@/lib/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NativeSharePopup } from "./native-share-popup";
import { Badge } from "./ui/badge";
import { Button } from "@/components/ui/button";
import { Trash, Pencil, Loader2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useActions } from "@/lib/hooks";
import { deleteArtWork } from "@/actions/artwork";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { convertPrice } from "@/actions/currencyConverter";

interface ArtCardProps {
  artwork: ArtWorkDTO;
}

const ArtCard = ({ artwork }: ArtCardProps) => {
  const router = useRouter();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(true);

  const copyArtworkLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/arts/${artwork.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Link href={`/arts/${artwork.id}`}>
      <Card className="overflow-hidden group cursor-pointer">
        <CardContent className="p-0 relative">
          <div className="aspect-square overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                <Loader2 className="animate-spin" />
              </div>
            )}
            <Image
              src={artwork.mediaUrls[0]}
              alt={artwork.title}
              width={400}
              height={400}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              onLoadingComplete={() => setLoading(false)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={copyArtworkLink}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="p-4 flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{artwork.title}</h3>
            {artwork.inStock ? (
              <Badge className="bg-green-500">In stock</Badge>
            ) : (
              <Badge className="bg-red-500">Sold</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">By {artwork.ownerName}</p>
          <div className="flex gap-2">
            <Badge variant="secondary">{artwork.materialType.name}</Badge>
            <Badge variant="secondary">{artwork.paintingType.name}</Badge>
          </div>
          <p className="font-bold">{convertPrice(artwork.price, currency)} {currency}</p>
        </CardFooter>
        <ToastContainer />
      </Card>
    </Link>
  );
};

export default ArtCard;
