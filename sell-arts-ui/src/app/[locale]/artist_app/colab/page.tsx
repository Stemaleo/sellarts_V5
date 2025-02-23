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
import { getAllColabRequest } from "@/actions/colab";
import moment from "moment";
import CustomPagination from "@/components/ui/custom-pagination";
import ColabActions from "./ColabActions";

export default async function ArtistOrderHistory({ searchParams }: any) {
  const search = await searchParams;
  const res = await getAllColabRequest(search["page"] || 0);

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  const data = res.data;

  const colabRequests = data.content;

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Your Colab Requests</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colabRequests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{moment(item.createdAt).format("D MMM Y")}</TableCell>
                    <TableCell>
                      <Link href={"/artists/" + item.requester.artistProfile?.id}>
                        <Button size={"sm"} variant={"link"}>
                          {item.requester.name}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={"/artists/" + item.artist.artistProfile?.id}>
                        <Button size={"sm"} variant={"link"}>
                          {item.artist.name}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>{item.status}</TableCell>

                    <TableCell className="gap-4 flex">
                      <ColabActions item={item} />
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
            <p className="text-lg font-semibold">No colab request yet</p>
            <p className="text-sm text-muted-foreground text-center">When you get/make a colab request it will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
