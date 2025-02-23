import { use, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllOrdersForArtist, getAllOrdersForArtistAdmin } from "@/actions/cart";
import Link from "next/link";
import CustomPagination from "@/components/ui/custom-pagination";

export default async function ArtistOrderHistory({ searchParams, params }: any) {
  const paramData = await params;
  const search = await searchParams;
  const res = await getAllOrdersForArtistAdmin(paramData.id, search["page"] || 0);

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  const data = res.data;
  const orderPage = data.ordersPage;
  const orders = orderPage.content;

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Sold Artworks</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold">{data.count}</p>
              <p className="text-sm text-muted-foreground">Total Artworks Sold</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold">${data.totalAmount}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold">${data.adminShare}</p>
              <p className="text-sm text-muted-foreground">Total Commission</p>
            </div>
            <div className="flex justify-center sm:justify-start">
              <Select defaultValue="all-time">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {orders.length != 0 && (
        <div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Artwork</TableHead>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead className="text-right">Artist Profit</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                    </TableRow>
                  </TableHeader>
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
                        <TableCell className="text-right">${item.artistShare?.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.adminShare?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <CustomPagination page={orderPage} />
        </div>
      )}
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
