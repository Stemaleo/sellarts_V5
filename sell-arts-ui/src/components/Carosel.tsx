"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SImage1 from "@/assets/paint1.avif";
import SImage2 from "@/assets/paint2.avif";
import SImage3 from "@/assets/paint3.avif";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { ArtWorkDTO } from "@/lib/type";

const carouselItems = [
  { id: 1, artist: "KEZE", title: "Opposition", image: SImage1 },
  { id: 2, artist: "ADJOBA", title: "Untitled", image: SImage2 },
  { id: 3, artist: "MIMI BRIGNON WILFRIED", title: "Abstract Green", image: SImage3 },
  { id: 4, artist: "MIMI BRIGNON WILFRIED", title: "Abstract Green", image: SImage3 },
  { id: 5, artist: "MIMI BRIGNON WILFRIED", title: "Abstract Green", image: SImage3 },
  { id: 6, artist: "MIMI BRIGNON WILFRIED", title: "Mixed Media", image: SImage2 },
];

const options: EmblaOptionsType = { loop: true };
const AUTOPLAY_INTERVAL = 5000; // 5 seconds

export default function FeaturedArtistsCarousel({ artworks }: { artworks: ArtWorkDTO[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
    setIsPlaying(false);
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
    setIsPlaying(false);
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
      setIsPlaying(false);
    },
    [emblaApi],
  );

  const toggleAutoplay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, setScrollSnaps, onSelect]);

  useEffect(() => {
    if (!emblaApi || !isPlaying) return;

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, AUTOPLAY_INTERVAL);

    return () => {
      clearInterval(autoplay);
    };
  }, [emblaApi, isPlaying]);

  return (
    <main className="w-full bg-background">
      {/* Hero Carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {artworks.map((item) => (
              <div key={item.id} className="flex-[0_0_100%] min-w-0 relative h-[500px]">
                <Image src={item.mediaUrls[0]} alt={`${item.title} - ${item.title}`} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-10 left-10">
                    <Link href={`/arts/${item.id}`}>
                      <h2 className="text-white text-4xl font-bold">{item.ownerName}</h2>
                      <p className="text-white/90 text-xl">{item.title}</p>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50" onClick={scrollPrev}>
          <ChevronLeft className="h-8 w-8" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button variant="ghost" size="icon" className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50" onClick={scrollNext}>
          <ChevronRight className="h-8 w-8" />
          <span className="sr-only">Next slide</span>
        </Button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {scrollSnaps.map((_, index) => (
            <button key={index} className={`w-3 h-3 rounded-full transition-colors ${index === selectedIndex ? "bg-white" : "bg-white/50"}`} onClick={() => scrollTo(index)}>
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="absolute bottom-4 right-4 bg-black/30 text-white hover:bg-black/50" onClick={toggleAutoplay}>
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          <span className="sr-only">{isPlaying ? "Pause autoplay" : "Start autoplay"}</span>
        </Button>
      </div>
    </main>
  );
}
