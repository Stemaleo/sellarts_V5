"use client";
import { ArtWorkDTO } from "@/lib/type";
import Image from "next/image";
import React, { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { CubeIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import ImagePreview from "./ImagePreview";
import { LucideFullscreen, RotateCwIcon, ZoomIn, ZoomOut } from "lucide-react";

type Props = {
  art: ArtWorkDTO;
};

const SelectImage = (props: Props) => {
  const [selectImage, setImage] = useState<number>(0);
  return (
    <div className="flex flex-col-reverse gap-4 ">
      <div className="md:max-w-full max-w-[92vw] overflow-scroll overflow-x-hidden ">
        <div className="h-20 space-x-4 p-1 flex w-full  max-w-1/2">
          {props.art.mediaUrls.map((items, index) => {
            return (
              <div key={items} onMouseEnter={() => setImage(index)} onClick={() => setImage(index)} className={`h-full relative aspect-square  ${selectImage == index ? "ring-4" : ""} cursor-pointer hover:ring-4 rounded-lg ob `}>
                <Image src={props.art.mediaUrls[index]} alt={props.art.title} layout="fill" objectFit="cover" className="rounded-lg shadow-lg aspect-square" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative h-[400px]  md:h-[600px] rounded-lg overflow-hidden">
        <Link className="absolute bottom-4 right-4" rel="ar" href="https://s3.oswinjerome.in/art/Monalisa%20Painting.usdz">
          <Button className=" border-blue-600 bg-white/40 text-blue-600" variant={"outline"}>
            <CubeIcon />
            View in AR
          </Button>
        </Link>
        {/* <Image src={props.art.mediaUrls[selectImage]} alt={props.art.title} layout="fill" objectFit="cover" className="rounded-lg shadow-lg" /> */}
        <PhotoProvider
          maskOpacity={0.5}
          toolbarRender={({ onScale, scale, rotate, onRotate }) => {
            return (
              <div className="fixed bottom-2 left-0 right-0 flex justify-center">
                <div className="bg-black/70 px-6 py-2 space-x-3">
                  <Button variant={"ghost"} size={"icon"} onClick={() => onScale(scale - 0.5)}>
                    <ZoomOut />
                  </Button>
                  <Button variant={"ghost"} size={"icon"} onClick={() => onScale(1)}>
                    <LucideFullscreen />
                  </Button>
                  <Button variant={"ghost"} size={"icon"} onClick={() => onScale(scale + 0.5)}>
                    <ZoomIn />
                  </Button>
                  <Button variant={"ghost"} size={"icon"} onClick={() => onRotate(rotate + 90)}>
                    <RotateCwIcon />
                  </Button>
                </div>
              </div>
            );
          }}
        >
          <PhotoView src={props.art.mediaUrls[selectImage]}>
            <img className="object-cover w-full h-full aspect-square" src={props.art.mediaUrls[selectImage]} alt="" />
          </PhotoView>
        </PhotoProvider>
        {/* <ImagePreview src={} /> */}
      </div>

      {/* <Zoom>
      <img
        src={props.art.mediaUrls[selectImage]}
        alt="Zoomable"
        className="w-64 h-64 object-cover"
      />
    </Zoom> */}
    </div>
  );
};

export default SelectImage;
