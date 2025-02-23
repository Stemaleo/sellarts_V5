import { use, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllOrdersForArtist } from "@/actions/cart";
import Link from "next/link";
import { getAllColabArtists, getAllColabRequest } from "@/actions/colab";
import moment from "moment";
import CustomPagination from "@/components/ui/custom-pagination";
import { getTranslations } from "next-intl/server";

export default async function ArtistOrderHistory({ searchParams }: any) {
  const search = await searchParams;
  const res = await getAllColabArtists(search["page"] || 0);
  const t = await getTranslations();

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  const data = res.data;

  const colabRequests = data.content;

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">{t("common.artists")}</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.date-and-time")}</TableHead>
                  <TableHead>{t("common.artists")}</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colabRequests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{moment(item.createdAt).format("D MMM Y")}</TableCell>
                    <TableCell>
                      <Link href={"/artists/" + item.artist.artistProfile?.id}>
                        <Button size={"sm"} variant={"link"}>
                          {item.artist.name}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/artist_app/arts/create?artistId=${item.artist.artistProfile?.id}&artistName=${item.artist.name}`}>
                        <Button size={"sm"}>
                          {t("create-artwork-for")} {item.artist.name}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <CustomPagination page={res.data} />

      {colabRequests.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Palette className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">{t("artists.no-colab-request-yet")}</p>
            <p className="text-sm text-muted-foreground text-center">{t("artists.when-you-get-make-a-colab-request-it-will-appear-here")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
