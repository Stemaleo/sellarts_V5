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

export default async function UserArtworkGallery({ searchParams }: any) {
  const search = await searchParams;
  const res = await getMyArtWorks(search["page"] || 0, search["title"] || "", search["paintingType"] || "");
  const res2 = await getAllPaintingTypes();
  if (!res.success || !res2.success) {
    return <div>Unable to load</div>;
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Art Works</h1>
      <ArtFilter paintingTypes={res2.data} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {res.data.content.map((artwork) => (
          <ArtCard key={artwork.id} artwork={artwork}></ArtCard>
        ))}
      </div>

      {res.data.content.length === 0 && <p className="text-center text-gray-500 mt-8">No artwork found.</p>}

      {/* Pagination placeholder */}
      <div className="mt-8 flex justify-center">
        <Button variant="outline" disabled={res.data.page.number == 0} className="mx-2">
          <Link href={"/artist_app/arts?page=" + (res.data.page.number - 1)}>Previous</Link>
        </Button>
        <Button variant="outline" disabled={res.data.page.number >= res.data.page.totalPages - 1} className="mx-2">
          <Link href={"/artist_app/arts?page=" + (res.data.page.number + 1)}>Next</Link>
        </Button>
      </div>
    </div>
  );
}
