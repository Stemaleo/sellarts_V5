"use client";
import { ArtWorkDTO } from "@/lib/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NativeSharePopup } from "./native-share-popup";
import { Badge } from "./ui/badge";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useActions } from "@/lib/hooks";
import { deleteArtWork } from "@/actions/artwork";

const ArtCard = ({ artwork }: { artwork: ArtWorkDTO }) => {
  const router = useRouter();



  return (
    <>
      <div key={artwork.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
        {artwork.inStock ? (
          <Badge className="absolute z-10 top-2 right-2 bg-green-500">In stock</Badge>
        ) : (
          <Badge className="absolute z-10 top-2 right-2 bg-red-500">Sold</Badge>
        )}
        <div className="relative h-48">
          <Image src={artwork.mediaUrls[0]} alt={artwork.title} layout="fill" objectFit="cover" />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 bg-primary/20 py-1 px-2 rounded-full inline h-auto">
              By, {artwork.ownerName}
            </span>
            <NativeSharePopup url={artwork.id} title={artwork.title} />
          </div>
          <h2 className="text-lg font-semibold mb-0 mt-1 line-clamp-1">{artwork.title}</h2>
          <p className="text-gray-500 mb-1 text-sm line-clamp-1">{artwork.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">FCFA {artwork.price}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{artwork.materialType.name}</Badge>
            <Badge variant="secondary">{artwork.paintingType.name}</Badge>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtCard;
