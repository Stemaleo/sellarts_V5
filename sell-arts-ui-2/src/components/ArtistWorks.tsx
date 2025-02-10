import React from "react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Artist from "@/assets/artist.avif";
import paint1 from "@/assets/paint1.avif";
import paint2 from "@/assets/paint2.avif";
import paint3 from "@/assets/paint3.avif";
import Image from "next/image";
import { Button } from "./ui/button";
import { ArtistProfileDetails } from "@/lib/type";
import Link from "next/link";

type Props = {
  artist: ArtistProfileDetails;
};

export default function ArtistWorks({ artist }: Props) {
  return (
    <section className="bg-gray-50 w-full  lg:py-5">
      <div className="container mx-auto px-4 lg:px-4">
        <h1 className="text-lg  lg:text-2xl font-bold mb-8 uppercase">The works of {artist.user?.name}</h1>
        <div className="grid grid-rows-2  md:grid-cols-4 gap-4">
          <div className="col-span-2 relative row-span-4 overflow-hidden aspect-square  rounded-xl ">
            <Image width={600} height={600} src={artist.user.artistProfile?.coverUrl ?? "https://sellarts.net"} alt="sss" className="object-cover h-full w-full inset-0 rounded-md absolute" />
            <div className="bg-black/50 absolute  w-full h-full"></div>

            <div className="absolute bottom-0 min-h-[200px] flex flex-col gap-2.5 p-6">
              <div className="">
                <Badge className=" m-0  bg-red-500  ">artist</Badge>
              </div>
              <h1 className="text-3xl text-primary-foreground font-semibold ">{artist.user?.email}</h1>
              <p className="text-primary-foreground text-sm mb-4">{artist.user.artistProfile?.bio}</p>
              <div className="flex gap-4 items-center ">
                <Avatar>
                  <AvatarImage className="object-cover" src={artist.user.profileImageUrl} alt={""} />
                  <AvatarFallback className="bg-primary text-primary-foreground">M</AvatarFallback>
                </Avatar>
                <h1 className="text-primary-foreground text-lg font-semibold">{artist.user?.name.toLocaleUpperCase()}</h1>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-2 aspect-square  overflow-hidden hidden md:flex flex-col gap-4">
            <div className="w-full h-1/2   gap-4 hidden md:flex">
              {artist.artWorks.length > 0 && (
                <div className="w-1/2 h-full bg-red-400 rounded-md overflow-hidden">
                  <Image width={400} height={400} src={artist.artWorks[0].mediaUrls[0]} alt="sss" className="object-cover h-full w-full inset-0" />
                </div>
              )}
              {artist.artWorks.length > 1 && (
                <div className="lg:w-1/2 h-full bg-red-400 rounded-md overflow-hidden">
                  <Image width={400} height={400} src={artist.artWorks[1].mediaUrls[0]} alt="sss" className="object-cover h-full w-full inset-0" />
                </div>
              )}
            </div>
            {artist.artWorks.length > 2 && (
              <div className="w-full h-1/2 rounded-md overflow-hidden hidden md:block">
                <Image width={400} height={400} src={artist.artWorks[2].mediaUrls[0]} alt="sss" className="object-cover h-full w-full inset-0" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full mt-4  flex items-end justify-center">
          <Link href={`/artists/${artist.user?.artistProfile?.id}`}>
            <Button className="rounded-full hover:scale-105">View the Artist</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
