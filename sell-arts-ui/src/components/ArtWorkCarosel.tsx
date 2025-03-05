"use client";

import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/context/CurrencyContext";
import { ArtWorkDTO } from "@/lib/type";

export default function ArtWork({ artworks }: { artworks: ArtWorkDTO[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, slidesToScroll: 1 });
  const t = useTranslations();
  const { currency } = useCurrency();

  const exchangeRates: Record<string, number> = {
    XOF: 1,
    USD: 600,  
    EUR: 655,  
  };

  // (pour les prix de base en USD ou EURO, on va multiplier)
  const convertPrice = (priceXOF: number, targetCurrency: string) => {
    return (priceXOF / exchangeRates[targetCurrency]).toFixed(4);
  };

  return (
    <div className="container mx-auto px-4 lg:px-4 lg:py-5 p-4 bg-white">
      <h1 className="text-lg lg:text-2xl font-bold mb-8 uppercase">
        {t("home.the-virtual-catalog-discover-the-featured-works")}
      </h1>
      <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 4000 })]} className="w-full">
        <CarouselContent ref={emblaRef}>
          {artworks.map((artwork) => (
            <CarouselItem key={artwork.id} className="md:basis-1/2 lg:basis-1/3">
              <Link href={`/arts/${artwork.id}`}>
                <Card key={artwork.id} className="border-none shadow-none rounded-none">
                  <div className="p-0 overflow-hidden items-center h-full flex flex-col justify-between w-full">
                    <Image
                      src={artwork.mediaUrls[0]}
                      alt={artwork.title}
                      width={300}
                      height={300}
                      className="max-h-[300px] bg-gray-50 p-4 w-full flex-1 object-contain"
                    />
                    <div className="space-y-1 w-full bottom-0 p-1 text-center">
                      <h2 className="font-bold text-lg">{artwork.ownerName}</h2>
                      <p className="text-orange-500 font-semibold">
                        {convertPrice(artwork.price, currency)} {currency}
                      </p>
                      <p className="text-sm text-muted-foreground italic">{artwork.title}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
