import Image from "next/image";
import Link from "next/link";

import bg from "@/assets/bg.jpg";
import paint2 from "@/assets/paint2.avif";
import paint1 from "@/assets/paint1.avif";
import paint3 from "@/assets/paint3.avif";
import artist1 from "@/assets/artist.avif"; // New vertical image
import { ArtistProfile, FeaturedArtist } from "@/lib/type";
import { getTranslations } from "next-intl/server";

export default async function FeaturedArtists({ artists }: { artists: FeaturedArtist[] }) {
  const t = await getTranslations();

  return (
    <section className="bg-gray-50 py-5">
      <div className="  container mx-auto px-4 lg:px-4">
        <h6 className="text-lg lg:text-2xl font-bold mb-4 lg:mb-8 uppercase ">{t("home.featured-artist")}</h6>
        <div className="sm:h-128 sm:grid sm:grid-cols-12 gap-3">
          <div className="sm:h-full sm:col-span-8 grid sm:grid-rows-2 items-stretch gap-3">
            <Link href={"/artists/" + artists[0].artist?.id} className="h-96 sm:h-full">
              <div className="bg-gray-100 relative flex flex-col justify-end h-full w-full transition-transform duration-300 transform hover:scale-105">
                <div className="absolute inset-0">
                  <Image src={artists[0]?.artwork.mediaUrls[0] ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdO2DCDcfM7yDAtEo797CkSw_njibgz-lOgw&s"} alt={artists[0].artist.userInfo?.name ?? ""} layout="fill" objectFit="cover" />
                </div>
                {/* Apply a stronger black gradient at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
                <div className="p-3 text-white relative">
                  <h6 className="uppercase font-bold text-2xl">{artists[0].artist.userInfo?.name}</h6>
                </div>
              </div>
            </Link>

            <div className="grid sm:grid-cols-3 gap-3">
              {artists.slice(1, 4).map((artist, index) => (
                <Link key={index} href={"/artists/" + artist.artist?.id} className="aspect-square  ">
                  <div className="bg-gray-100  relative flex flex-col justify-end w-full h-full transition-transform duration-300 transform hover:scale-105">
                    <div className="absolute  inset-0">
                      <Image src={artist?.artwork.mediaUrls[0] ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdO2DCDcfM7yDAtEo797CkSw_njibgz-lOgw&s"} alt={artist.artist.userInfo?.name ?? ""} layout="fill" objectFit="cover" />
                    </div>
                    {/* Apply a stronger black gradient at the bottom */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
                    <div className="p-3 text-white relative">
                      <h6 className="uppercase font-bold text-2xl">{artist.artist.userInfo?.name}</h6>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link href={"/artists/" + artists[4].artist?.id} className="hidden sm:block sm:col-span-4 h-96 mt-3 sm:mt-0 sm:h-full">
            <div className="bg-gray-100 relative flex flex-col justify-end h-full w-full transition-transform duration-300 transform hover:scale-105">
              <div className="absolute inset-0">
                <Image src={artists[4]?.artwork.mediaUrls[0] ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdO2DCDcfM7yDAtEo797CkSw_njibgz-lOgw&s"} alt={artists[4].artist.userInfo?.name ?? ""} layout="fill" objectFit="cover" />
              </div>
              {/* Apply a stronger black gradient at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
              <div className="p-3 text-white relative">
                <h6 className="uppercase font-bold text-2xl">{artists[4].artist.userInfo?.name}</h6>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
