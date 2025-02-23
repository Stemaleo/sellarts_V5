import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import paint2 from "@/assets/artist.avif";
import Image from "next/image";
import { ArtistProfile, FeaturedArtist } from "@/lib/type";
type Props = {
  galleries: FeaturedArtist[];
};

export default function FeaturedArtGalleries({ galleries }: Props) {
  return (
    <div className="bg-gray-50 w-full lg:py-5">
      <div className="container mx-auto px-4 lg:px-4">
        <h1 className="text-lg  lg:text-2xl font-bold mb-8 uppercase">Featured Art Galleries</h1>
        <div className="grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-3 gap-4">
          {galleries.map((gal, i) => {
            return (
              <div key={gal.artist.id + "sd" + gal.artwork.id + "" + i} className="lg:col-span-1 flex flex-col-reverse gap-2 transition-transform duration-300 transform  hover:scale-105 ">
                <div className="">
                  <p className="text-lg font-bold">{gal.artist.userInfo?.name}</p>
                  <p className="text-sm pr-4"> {gal.artist.location}</p>
                </div>

                <Link href={"/artists/" + gal.artist.id} className=" aspect-square   ">
                  <div className="bg-gray-100  relative flex flex-col justify-end w-full h-full   ">
                    <div className="absolute  inset-0">
                      <Image src={gal.artist.userInfo?.profileUrl ?? "https://sellarts.net"} alt={"artist.alt"} layout="fill" objectFit="cover" />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          <div className="col-span-full mt-4  flex items-end justify-center">
            <Button className="rounded-full hover:scale-105">Discover more galleries</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
