"use client";
import { ArtWorkDTO } from "@/lib/type";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Button } from "./ui/button";
import { CubeIcon } from "@radix-ui/react-icons";

type Props = {
  art: ArtWorkDTO;
};

declare global {
  interface Window {
    ArtPlacer: any;
  }
}

const SelectImage = ({ art }: Props) => {
  const [selectImage, setSelectImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const artPlacerLoaded = useRef(false);
  const instanceIds = useRef<string[]>([]);

  // Nettoyage complet des widgets ArtPlacer
  const cleanup = () => {
    // vider les ancres
    ["one", "two", "three"].forEach((s) => {
      const el = document.getElementById(`artplacer-widget-anchor-${s}`);
      if (el) el.innerHTML = "";
    });
    // supprimer tout élément créé
    instanceIds.current.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    instanceIds.current = [];
  };

  // Initialisation
  const initWidgets = () => {
    if (!window.ArtPlacer || !art) return;
    cleanup();
    const cfg = {
      gallery: "78181",
      artwork_url: art.mediaUrls[selectImage],
      height: art.height,
      width: art.width,
      title: art.title,
      size: `${art.height} x ${art.width}`,
      price: art.price,
      artist: art.artistName,
      default_style: "true",
      button_width: "auto",
      resizable: "true",
      frames: "true",
      rotate: "true",
      catalog: "true",
      data_capture_form: "false" as const,
    };

    // 3 instances
    [
      { suffix: "one", type: "1", extra: { dimensions_standard: "hxw", unit: "cm" } },
      { suffix: "two", type: "2", extra: { space: "114277", additional_spaces: "114277,73831,73863,46373,73739,73591,122633,32468,73946" } },
      { suffix: "three", type: "3", extra: { unit: "cm" } },
    ].forEach(({ suffix, type, extra }) => {
      const id = `ap-${Date.now()}-${suffix}`;
      window.ArtPlacer.insert({
        ...cfg,
        type,
        after: `#artplacer-widget-anchor-${suffix}`,
        id,
        ...extra,
      });
      instanceIds.current.push(id);
    });
    
    setIsLoading(false);
  };

  // Charger le script une fois
  useEffect(() => {
    if (artPlacerLoaded.current) return;
    const src = "https://widget.artplacer.com/js/script.js";
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => (artPlacerLoaded.current = true);
      document.body.appendChild(s);
    } else {
      artPlacerLoaded.current = true;
    }
  }, []);

  // Ré-init à chaque image change si popup ouvert
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      initWidgets();
    }
  }, [selectImage]);

  const openPopup = () => {
    setIsOpen(true);
    setIsLoading(true);
    // initWidgets sera appelé par useEffect juste après le render
    // Initialiser les widgets après l'ouverture de la popup
    setTimeout(() => {
      if (artPlacerLoaded.current) {
        initWidgets();
      } else {
        // Si le script n'est pas encore chargé, attendre qu'il le soit
        const checkLoaded = setInterval(() => {
          if (artPlacerLoaded.current) {
            clearInterval(checkLoaded);
            initWidgets();
          }
        }, 200);
        // Nettoyer l'intervalle après 5 secondes si le chargement échoue
        setTimeout(() => {
          clearInterval(checkLoaded);
          setIsLoading(false);
        }, 5000);
      }
    }, 100);
  };
  const closePopup = () => {
    cleanup();
    setIsOpen(false);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col-reverse gap-4">
      {/* vignettes */}
      <div className="md:max-w-full max-w-[92vw] overflow-scroll overflow-x-hidden">
        <div className="h-20 space-x-4 p-1 flex">
          {art.mediaUrls.map((url, idx) => (
            <div
              key={url}
              onMouseEnter={() => setSelectImage(idx)}
              onClick={() => setSelectImage(idx)}
              className={`h-full relative aspect-square cursor-pointer rounded-lg ${
                selectImage === idx ? "ring-4" : ""
              }`}
            >
              <Image
                src={url}
                alt={art.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* aperçu + bouton */}
      <div className="relative h-[400px] md:h-[600px] rounded-lg overflow-hidden">
        <Button
          className="absolute bottom-4 right-4 border-blue-600 bg-white/40 text-blue-600"
          variant="outline"
          onClick={openPopup}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          ) : (
            <>
              <CubeIcon className="mr-2" />
              3D View
            </>
          )}
        </Button>

        {/* popup démonté/remonté selon isOpen */}
        {isOpen && (
          <div
            id="artplacer-popup"
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && closePopup()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-[90%] max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">View in AR</h3>
                <Button variant="ghost" size="sm" onClick={closePopup}>
                  Close
                </Button>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm text-gray-500">Loading 3D view...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 flex flex-col items-center">
                  {[
                    { id: "one", label: "View on Wall" },
                    { id: "two", label: "View in Room" },
                    { id: "three", label: "Try in Your Space" },
                  ].map((w) => (
                    <div key={w.id} className="text-center w-full">
                      <h4 className="text-md font-medium mb-2">{w.label}</h4>
                      <div
                        id={`artplacer-widget-anchor-${w.id}`}
                        className="mb-3 mx-auto"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* visionneuse photo */}
        <PhotoProvider
          maskOpacity={0.5}
          toolbarRender={({ onScale, scale, rotate, onRotate }) => (
            <div className="fixed bottom-2 left-0 right-0 flex justify-center">
              <div className="bg-black/70 px-6 py-2 space-x-3">
                <Button variant="ghost" size="icon" onClick={() => onScale(scale - 0.5)}>
                  Zoom Out
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onScale(1)}>
                  Fullscreen
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onScale(scale + 0.5)}>
                  Zoom In
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onRotate(rotate + 90)}>
                  Rotate
                </Button>
              </div>
            </div>
          )}
        >
          <PhotoView src={art.mediaUrls[selectImage]}>
            <img
              className="object-cover w-full h-full aspect-square"
              src={art.mediaUrls[selectImage]}
              alt={art.title}
            />
          </PhotoView>
        </PhotoProvider>
      </div>
    </div>
  );
};

export default SelectImage;
