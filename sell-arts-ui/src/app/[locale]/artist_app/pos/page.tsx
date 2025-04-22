"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Download, Loader2, Palette, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllOrdersForArtist } from "@/actions/cart";
import Link from "next/link";
import RangeFilter from "./RangeFilter";
import { useTranslations } from "next-intl";
import { SHIPPING_QUERY } from "@/actions/queries/orders/ordersQueries";
import { toast } from "sonner";
import { FEATURE_UPDATE_ARTWORK_STOCK } from "@/actions/mutation/artwork/mutationsArtwork";
import { FEATURE_UPDATE_ORDER_STATUS } from "@/actions/mutation/artwork/mutationsArtwork";
interface OrderItem {
  id: string;
  artWork: {
    id: string;
    title: string;
    mediaUrls: string[];
    stock?: number;
    inStock?: boolean;
  };
  order: {
    id: string;
    createdAt: string;
    status?: string;
  };
  artistShare: number;
}



export default function ArtistOrderHistory({ searchParams, initialData }: any) {
  const t = useTranslations();
  const [data, setData] = useState(initialData || { ordersPage: { content: [], page: { number: 0, totalPages: 0 } }, count: 0, total: 0 });
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [shippingInfos, setShippingInfos] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);
  const [loadingShipping, setLoadingShipping] = useState(false);
  
  const updateArtworkStock = async (artworkId: string, stock: number, orderId: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          query: FEATURE_UPDATE_ARTWORK_STOCK,
          variables: { artwork: artworkId, stock: stock },
        }),
      });
      const result = await response.json();
      const updateResult = result.data.featureUpdateArtworkStock;
      
      if (updateResult.success) {
        // const updateOrderStatus = await fetch(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     query: FEATURE_UPDATE_ORDER_STATUS,
        //     variables: { order: orderId, status: "ACCEPTED" },
        //   }),
        // });
        toast.success("Stock updated successfully");
        // const updateOrderStatusResult = await updateOrderStatus.json(); 
        // if (updateOrderStatusResult.success) {
        //   toast.success("Stock updated successfully");
        // } else {
        //   toast.error(updateOrderStatusResult.message || "Failed to update stock");
        // }
      } else {
        toast.error(updateResult.message || "Failed to update stock");
      }
      
      return updateResult;
    } catch (error) {
      toast.error("An error occurred while updating stock");
      console.error("Error updating artwork stock:", error);
      return { success: false, message: "An error occurred" };
    }
  };
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getAllOrdersForArtist(searchParams?.page || 0, searchParams?.range || "all");
        if (result?.success) {
          setData(result.data);
          const formattedOrders = result.data.ordersPage?.content.map((order: any) => ({
            ...order,
            order: {
              ...order.order,
              createdAt: order.order.createdAt.toString()
            }
          })) || [];
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchParams?.page, searchParams?.range]);

  useEffect(() => {
    const loadShippingInfos = async () => {
      setLoadingShipping(true);
      const infos: {[key: string]: any} = {};
      for (const item of orders) {
        if (item?.order?.id) {
          const info = await getShippingInfo(item.order.id);
          infos[item.order.id] = info;
        }
      }
      setShippingInfos(infos);
      setLoadingShipping(false);
    };

    if (orders.length > 0) {
      loadShippingInfos();
    }
  }, [orders]);

  const getShippingInfo = async (orderId: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: SHIPPING_QUERY,
          variables: { order: orderId }
        }),
      });
      const result = await response.json();
      return result.data.shipping.edges[0]?.node;
    } catch (error) {
      console.error("Error fetching shipping info:", error);
      return null;
    }
  };

  const handleDownload = (base64Data: string, fileName: string) => {
    const linkSource = `data:application/pdf;base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("nav.pos")}</h1>
      
      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">{t("nav.pos")}</CardTitle>
        </CardHeader> */}
        {/* <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-bold">{data?.count || 0}</p>
              <p className="text-sm text-muted-foreground">{t("total-artworks-sold")}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-bold">FCFA {data?.total || 0}</p>
              <p className="text-sm text-muted-foreground">{t("total-revenue")}</p>
            </div>
            <div className="flex justify-center md:justify-end">
              <RangeFilter />
            </div>
          </div>
        </CardContent> */}
      {/* </Card> */}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] md:w-[100px]">{t("image")}</TableHead>
                <TableHead className="min-w-[120px]">{t("common.artwork")}</TableHead>
                <TableHead className="min-w-[100px]">{t("common.order")} #</TableHead>
                <TableHead className="min-w-[120px]">Date & Time</TableHead>
                <TableHead className="min-w-[200px]">Shipping Infos</TableHead>
                <TableHead className="min-w-[100px]">Action</TableHead>
                <TableHead className="min-w-[80px]">Paid</TableHead>
                <TableHead className="text-right min-w-[100px]">{t("your-profit")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((item: OrderItem) => {
                const shippingInfo = shippingInfos[item?.order?.id];
                const isOutOfStock = item?.artWork?.stock === 0;
                // const isWaitingPayment = item?.order?.status === "WAITING_PAYMENT";
                console.log(item?.order?.status);
                console.log(item.artWork.stock)
                return (
                  <TableRow key={item?.id}>
                    <TableCell>
                      <Image src={item?.artWork?.mediaUrls?.[0]} alt={item?.artWork?.title} width={50} height={50} className="rounded-md" />
                    </TableCell>
                    <TableCell className="font-medium">{item?.artWork?.title}</TableCell>
                    <TableCell className="text-sm">{item?.order?.id}</TableCell>
                    <TableCell>
                      <span className="hidden md:inline">{format(new Date(item?.order?.createdAt), "MMM d, yyyy HH:mm")}</span>
                      <span className="md:hidden">{format(new Date(item?.order?.createdAt), "MM/dd/yy")}</span>
                    </TableCell>
                    <TableCell>
                      {loadingShipping ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Loading shipping info...</span>
                        </div>
                      ) : shippingInfo ? (
                        <div className="flex flex-col md:flex-row gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Ref:</span>
                            <span 
                              className="text-sm cursor-pointer hover:text-blue-500"
                              onClick={() => {
                                navigator.clipboard.writeText(shippingInfo.label);
                                toast.success("Référence copiée!"); // Show message to user
                              }}
                              title="Click to copy"
                            >
                              {shippingInfo.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownload(shippingInfo.labelPdf, `shipping-label-${item.order.id}.pdf`)}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Label
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(shippingInfo.invoicePdf, `invoice-${item.order.id}.pdf`)}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Invoice
                            </Button>                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`https://parcelsapp.com/en/tracking/${shippingInfo.label}`, '_blank')}
                              className="text-xs"
                            >
                              <ChevronRight className="h-3 w-3 mr-1" />
                              Tracking
                            </Button>
                            
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No documents</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item?.artWork?.inStock !== false ? (
                        <Button 
                          variant="default" 
                          size="sm"
                          className="text-xs"
                          onClick={() => updateArtworkStock(item?.artWork?.id, 0, item?.order?.id)}
                        >
                          Payer
                        </Button>
                      ) : 
                        <span className="text-red-500 font-medium">Plus disponible</span>
                      }
                    </TableCell>
                    <TableCell>
                      {item?.order?.status === "WAITING_PAYMENT" ? (
                        <span className="text-amber-500 font-medium">En attente</span>
                      ) : (
                        <span className="text-green-500 font-medium">Payé</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">FCFA {item?.artistShare?.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <Button variant="outline" disabled={data?.ordersPage?.page?.number == 0} className="w-full md:w-auto">
          <Link href={"/artist_app/orders?page=" + (data?.ordersPage?.page?.number - 1)} className="flex gap-2 items-center">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {(data?.ordersPage?.page?.number || 0) + 1} of {data?.ordersPage?.page?.totalPages || 1}
        </span>
        <Button variant="outline" disabled={data?.ordersPage?.page?.number >= (data?.ordersPage?.page?.totalPages || 1) - 1} className="w-full md:w-auto">
          <Link href={"/artist_app/orders?page=" + (data?.ordersPage?.page?.number + 1)} className="flex gap-2 items-center">
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {orders.length === 0 && !loading && (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Palette className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4" />
            <p className="text-base md:text-lg font-semibold text-center">No artworks sold yet</p>
            <p className="text-sm text-muted-foreground text-center mt-2">When you make a sale, your sold artworks will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
