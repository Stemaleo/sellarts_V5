import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { getMyArtWorks } from "@/actions/artwork";
import Form from "next/form";
import ArtFilter from "./ArtFilter";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ArtCard from "@/components/ArtCard";
import { getAllPaintingTypes } from "@/actions/paintingType";
import ArtCardManage from "@/components/ArtCardManage";
import { getTranslations } from "next-intl/server";
import CustomPagination from "@/components/ui/custom-pagination";

export default async function UserArtworkGallery({ searchParams }: any) {
  const search = await searchParams;
  const res = await getMyArtWorks(search["page"] || 0, search["title"] || "", search["paintingType"] || "");
  const res2 = await getAllPaintingTypes();
  const t = await getTranslations();
  if (!res.success || !res2.success) {
    return <div>Unable to load</div>;
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("my-art-works")}</h1>
      <ArtFilter paintingTypes={res2.data} />
     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {res.data.content.map((artwork) => (
              <ArtCardManage key={artwork.id} artwork={artwork}></ArtCardManage>
          ))}
        </div>


      {res.data.content.length === 0 && <p className="text-center text-gray-500 mt-8">{t("artistsPage.no-artwork-found")}.</p>}

      {/* Pagination placeholder */}
      <CustomPagination page={res.data} />
    </div>
  );
}
