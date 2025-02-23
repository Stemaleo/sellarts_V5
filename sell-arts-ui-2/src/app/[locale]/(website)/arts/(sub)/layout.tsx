"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Menu } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActions } from "@/lib/hooks";
import { MaterialType, PaintingType } from "@/lib/type";
import { getAllPaintingTypes } from "@/actions/paintingType";
import { getAllMaterialTypes } from "@/actions/materialType";
import { useTranslations } from "next-intl";

export default function ArtworkGallery({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("artsPage");

  const params = new URLSearchParams(searchParams.toString());
  let options: string[] = params.has("paintingType") && params.get("paintingType") ? params.get("paintingType")!.split(",") : [];
  let matTypesOption: string[] = params.has("materialType") && params.get("materialType") ? params.get("materialType")!.split(",") : [];
  let price: string | null = params.has("price") && params.get("price") ? params.get("price") : "";
  const { data: paintingTypes, execute: fetchPaintingTypes, loading: paintingTypeLoading } = useActions<PaintingType[]>();
  const { data: materialTypes, execute: fetchMaterialTypes, loading: materialTypesLoading } = useActions<MaterialType[]>();

  useEffect(() => {
    fetchPaintingTypes(getAllPaintingTypes);
    fetchMaterialTypes(getAllMaterialTypes);
  }, []);

  const handlePaintingTypeChange = (key: string, add: boolean) => {
    if (add) {
      if (!options.includes(key)) options.push(key);
    } else {
      options = options.filter((e) => e !== key);
    }

    if (options.length > 0) {
      params.set("paintingType", options.join(","));
      params.set("page", "0");
    } else {
      params.delete("paintingType");
      params.set("page", "0");
    }
    router.push(`?${params.toString().replaceAll("%2C", ",")}`);
  };

  const handleMaterialTypeChange = (key: string, add: boolean) => {
    if (add) {
      if (!matTypesOption.includes(key)) matTypesOption.push(key);
    } else {
      matTypesOption = matTypesOption.filter((e) => e !== key);
    }

    if (matTypesOption.length > 0) {
      params.set("materialType", matTypesOption.join(","));
      params.set("page", "0");
    } else {
      params.delete("materialType");
      params.set("page", "0");
    }

    console.log("Updated options 2:", params.toString().replaceAll("%2C", ","));
    router.push(`?${params.toString().replaceAll("%2C", ",")}`);
  };

  const handlePriceChange = (key: string, add: boolean) => {
    if (add) {
      if (!matTypesOption.includes(key)) matTypesOption.push(key);
    } else {
      matTypesOption = matTypesOption.filter((e) => e !== key);
    }

    if (matTypesOption.length > 0) {
      params.set("price", matTypesOption.join(","));
      params.set("page", "0");
    } else {
      params.delete("price");
      params.set("page", "0");
    }
    router.push(`?${params.toString().replaceAll("%2C", ",")}`);
  };

  const FilterContent = () => (
    <div className="">
      <h4 className="text font-semibold capitalize">{"Painting Types"}</h4>
      <div id="paintTypeFilter">
        {paintingTypes?.map((option) => (
          <div key={option.id} className="flex items-center mt-2">
            <Checkbox
              defaultChecked={options.includes(option.name)}
              id={`${"PaintingTypes"}-${option}`}
              onCheckedChange={(t) => {
                // router.push("/arts?paintingType=" + option);
                handlePaintingTypeChange(option.name, t as boolean);
              }}
            />
            <Label htmlFor={`${"PaintingTypes"}-${option}`} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option.name}
            </Label>
          </div>
        ))}
      </div>
      <h4 className="text font-semibold capitalize mt-6">{"Material Types"}</h4>
      <div id="materialTypeFilter">
        {materialTypes?.map((option) => (
          <div key={"mat_" + option.id} className="flex items-center mt-2">
            <Checkbox
              defaultChecked={matTypesOption.includes(option.id.toString())}
              id={`${"MaterialTypes"}-${option}`}
              onCheckedChange={(t) => {
                // router.push("/arts?materialType=" + option);
                handleMaterialTypeChange(option.id.toString(), t as boolean);
              }}
            />
            <Label htmlFor={`${"MaterialTypes"}-${option}`} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option.name}
            </Label>
          </div>
        ))}
      </div>
      {/* Money */}
      <h4 className="text font-semibold capitalize mt-6">{t("price")}</h4>
      <div id="materialTypeFilter">
        {[
          { id: 1, label: "less than 3,000" },
          { id: 2, label: "3,001 to 5,000" },
          { id: 3, label: "more than 5,001" },
        ]?.map((option) => (
          <div key={"mat_" + option.id} className="flex items-center mt-2">
            <Checkbox
              defaultChecked={price === option.id.toString()}
              id={`price-${option.id}`}
              onCheckedChange={(t) => {
                // router.push("/arts?materialType=" + option);
                handlePriceChange(option.id.toString(), t as boolean);
              }}
            />
            <Label htmlFor={`price-${option.id}`} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option.label}
            </Label>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Button
          onClick={() => {
            router.push(`?`);
          }}
        >
          {t("clear-filter")}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden" id="hamMenu">
              <Menu className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar with filters for larger screens */}
        <aside className="hidden lg:block w-64 mr-8 flex-shrink-0">
          <h2 className="text-2xl font-bold mb-4">Filters</h2>
          <FilterContent />
        </aside>

        {/* Main content area with artwork grid */}
        {children}
      </div>
    </div>
  );
}
