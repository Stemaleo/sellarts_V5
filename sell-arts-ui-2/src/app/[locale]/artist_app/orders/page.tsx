import { use, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllOrdersForArtist } from "@/actions/cart";
import Link from "next/link";
import RangeFilter from "./RangeFilter";
import { getTranslations } from "next-intl/server";

export default async function ArtistOrderHistory({ searchParams }: any) {
  const search = await searchParams;
  const res = await getAllOrdersForArtist(search["page"] || 0, search["range"] || "all");
  const t = await getTranslations();

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  const data = res.data;
  const orderPage = data.ordersPage;
  const orders = orderPage.content;

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">{t("your-sold-artworks")}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("sales-overview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold">{data.count}</p>
              <p className="text-sm text-muted-foreground">{t("total-artworks-sold")}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold">FCFA {data.total}</p>
              <p className="text-sm text-muted-foreground">{t("total-revenue")}</p>
            </div>
            <div className="flex justify-center sm:justify-start">
              <RangeFilter />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">{t("image")}</TableHead>
                  <TableHead>{t("common.artwork")}</TableHead>
                  <TableHead>{t("common.order")} #</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Etiquette</TableHead>
                  <TableHead className="text-right">{t("your-profit")}</TableHead>
                </TableRow>
              </TableHeader>
              <Dialog>
                <DialogTrigger asChild>
                  <TableBody>
                    {orders.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Image src={item.artWork.mediaUrls[0]} alt={item.artWork.title} width={50} height={50} className="rounded-md" />
                        </TableCell>
                        <TableCell className="font-medium">{item.artWork.title}</TableCell>
                        <TableCell>{item.order.id}</TableCell>
                        <TableCell>
                          <span className="hidden sm:inline">{format(new Date(item.order.createdAt), "MMM d, yyyy HH:mm")}</span>
                          <span className="sm:hidden">{format(new Date(item.order.createdAt), "MM/dd/yy")}</span>
                        </TableCell>
                        <TableCell>{"N/A"}</TableCell>
                        <TableCell className="text-right">FCFA {item.artistShare?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Etiquette</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez imprimer ou télécharger l'étiquette pour l'expédition de votre œuvre.
                    </p>
                    <p className="text-lg font-medium mt-4">Etiquette: {"N/A"} </p>
                  </DialogDescription>
                  <DialogFooter>
                    <Button variant="outline" >Imprimer l'étiquette</Button>
                    <Button variant="outline" >Télécharger l'étiquette</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
        <Button variant="outline" disabled={orderPage.page.number == 0} className="w-full sm:w-auto">
          <Link href={"/artist_app/orders?page=" + (orderPage.page.number - 1)} className="flex gap-2 items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {orderPage.page.number + 1} of {orderPage.page.totalPages}
        </span>
        <Button variant="outline" disabled={orderPage.page.number >= orderPage.page.totalPages - 1} className="w-full sm:w-auto">
          <Link href={"/artist_app/orders?page=" + (orderPage.page.number + 1)} className="flex gap-2 items-center">
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
      {orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Palette className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">No artworks sold yet</p>
            <p className="text-sm text-muted-foreground text-center">When you make a sale, your sold artworks will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
