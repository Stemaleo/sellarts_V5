"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { PaintingType } from "@/lib/type";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ArtFilter = ({ paintingTypes }: { paintingTypes: PaintingType[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [paintingType, setPaintingType] = useState(searchParams.get("paintingType") || "");

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-grow">
        <Input
          type="text"
          value={title}
          onChange={(e) => {
            handleFilterChange("title", e.target.value);
            setTitle(e.target.value);
          }}
          placeholder="Search Title"
          className="w-full"
        />
      </div>
      <Select
        defaultValue={paintingType}
        onValueChange={(val) => {
          if (val == "all") {
            handleFilterChange("paintingType", "");
            setPaintingType("");
          } else {
            handleFilterChange("paintingType", val);
            setPaintingType(val);
          }
        }}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Painting Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("all-painting")}</SelectItem>
          {paintingTypes.map((type, i) => {
            return (
              <SelectItem key={i} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Link href={"arts/create"}>
        <Button className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> {t("create-new-art")}
        </Button>
      </Link>
    </div>
  );
};

export default ArtFilter;
