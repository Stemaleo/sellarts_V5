import { ArrowLeft, Download, Loader2, Package, Truck } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { use } from "react";
import { getAOrder } from "@/actions/cart";
import moment from "moment";
import { getTranslations } from "next-intl/server";
import { SHIPPING_QUERY } from "@/actions/queries/orders/ordersQueries";
import ShippingActions from "./ShippingActions";

interface ShippingInfo {
  id: string;
  label: string;
  // Add other properties as needed
}

async function getShippingInfo(orderId: string) {
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
    console.log(result)
    if (!result.data?.shipping?.edges?.length) {
      return [];
    }
    return result.data.shipping.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error("Error fetching shipping info:", error);
    return [];
  }
}

export default async function OrderDetails({ params }: any) {
  const meta = await params;
  const res = await getAOrder(meta.id);
  const t = await getTranslations();
  const shippingInfos = await getShippingInfo(meta.id);

  if (!res.success) {
    return <div>Unable to load data</div>;
  }

  const orderData = res.data;
  const order = {
    id: res.data.id,
    date: moment(orderData.createdAt).format("D MMM Y"),
    status: orderData.status,
    total: orderData.totalAmount,
    items: orderData.orderItems,
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/orders" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back-to-orders")}
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">
            {t("common.order")} #{order.id}
          </h1>
          <Badge variant={order.status === "SHIPPED" ? "default" : "secondary"} className="text-lg py-1 px-3">
            {order.status}
          </Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("common.order-summary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">
                    {t("common.order")} {t("common.date")}
                  </dt>
                  <dd>{order.date}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">{t("total-amount")}</dt>
                  <dd className="font-bold">{order.total}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("shipping-address")}</CardTitle>
            </CardHeader>
            <CardContent>
              <address className="text-sm not-italic">
                {orderData.address} <br />
                {orderData.city}, {orderData.state}, {orderData.postalCode} <br />
                {orderData.phone}
              </address>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t("order-items")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("product")}</TableHead>
                  <TableHead className="text-right">{t("quantity")}</TableHead>
                  <TableHead className="text-right">{t("artsPage.price")}</TableHead>
                  <TableHead className="text-right">{t("common.total")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img src={item.artWork.mediaUrls[0]} alt={item.artWork.title} className="h-20 w-20 rounded-md object-cover" />
                        <div>
                          <div className="font-medium">{item.artWork.title}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.price}</TableCell>
                    <TableCell className="text-right font-medium">{item.price}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    {t("subtotal")}
                  </TableCell>
                  <TableCell className="text-right font-medium">{order.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Shipping Informations</CardTitle>
          </CardHeader>
          <CardContent>
            {!shippingInfos.length ? (
              <div className="text-center text-muted-foreground">
                No Shipping infos
              </div>
            ) : (
              <div className="space-y-6">
                {shippingInfos.map((shippingInfo: ShippingInfo, index: number) => (
                  <div key={shippingInfo.id || index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex items-center gap-2">
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <ShippingActions 
                          orderId={order.id}
                          shippingInfo={shippingInfo}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
