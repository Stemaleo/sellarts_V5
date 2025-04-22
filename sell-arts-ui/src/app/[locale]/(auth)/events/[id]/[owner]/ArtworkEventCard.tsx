"use client";

import Image from "next/image";
import Link from "next/link";

interface ArtworkData {
  id: string;
  price: number;
  description: string;
  stock: number;
  title: string;
  isFeatured: boolean;
  createdAt: string;
  size: string;
  width: number;
  height: number;
  method: {
    id: string;
    name: string;
  };
  style: {
    id: string;
    name: string;
  };
  materialType: {
    id: string;
    name: string;
  };
  mediasSet: Array<{
    publicUrl: string;
    contentSize: number;
    contentType: string;
    key: string;
  }>;
  artist: {
    name: string;
    artistProfile: {
      id: string;
      artistType: string;
      bio: string;
      coverUrl: string;
      location: string;
      portfolioUrl: string;
    };
  };
  owner: {
    id: string;
    name: string;
    artistProfile: {
      id: string;
      location: string;
    };
  };
}

const ArtworkEventCard = ({ artwork , eventId , owner }: { artwork: ArtworkData , eventId: string, owner: string }) => {
  return (
    <Link href={`/eventarts/${artwork.id}`} className="block h-full">
      <div className="group h-full overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px]">
        {/* Image Container - Larger and more prominent */}
        {artwork.mediasSet && artwork.mediasSet.length > 0 && (
          <div className="relative h-72 w-full overflow-hidden">
            <Image 
              src={artwork.mediasSet[0].publicUrl} 
              alt={artwork.title} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-all duration-500 group-hover:scale-110"
            />
            {artwork.isFeatured && (
              <div className="absolute top-3 right-3 z-10 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 shadow-md">
                Featured
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
        )}
        
        {/* Content Container */}
        <div className="p-4">
          {/* Title and Price */}
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {artwork.title}
            </h3>
            <span className="font-medium text-lg text-primary">${artwork.price}</span>
          </div>
          
          {/* Artist Info */}
          <div className="mb-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <span className="font-medium">Artist:</span>
              <span>{artwork.artist?.name}</span>
            </div>
            {artwork.owner?.artistProfile?.location && (
              <div className="text-xs text-gray-500">
                {artwork.owner.artistProfile.location}
              </div>
            )}
          </div>
          
          {/* Artwork Details */}
          <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
            {artwork.style && (
              <div className="flex items-center">
                <span className="font-semibold mr-1">Style:</span> {artwork.style.name}
              </div>
            )}
            {artwork.method && (
              <div className="flex items-center">
                <span className="font-semibold mr-1">Method:</span> {artwork.method.name}
              </div>
            )}
            {(artwork.width || artwork.height) && (
              <div className="flex items-center">
                <span className="font-semibold mr-1">Size:</span> {artwork.width}×{artwork.height}
              </div>
            )}
            {artwork.stock > 0 ? (
              <div className="flex items-center text-green-600">
                <span className="font-semibold mr-1">Stock:</span> {artwork.stock}
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <span className="font-semibold mr-1">Status:</span> Sold out
              </div>
            )}
          </div>
          
          {/* Call to action */}
          <div className="mt-4 text-center">
            <span className="inline-block w-full rounded-full bg-primary py-2 text-sm font-medium text-white transition-all duration-300 group-hover:bg-primary/90">
              View Artwork
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArtworkEventCard;