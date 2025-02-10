import { ArrowLeft, Package, Truck } from "lucide-react";
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

export default async function OrderDetails({ params }: any) {
  const meta = await params;
  const res = await getAOrder(meta.id);
  const t = await getTranslations();
  if (!res.success) {
    return <div>Unable to load data</div>;
  }
  const orderData = res.data;
  // Mock data for demonstration
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
            <CardTitle>{t("order-timeline")}</CardTitle>
            <CardDescription>{t("track-your-order-status")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-muted">
              <li className="mb-10 ml-4">
                <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-background"></div>
                <time className="mb-1 text-sm font-normal leading-none text-muted-foreground">May 1, 2023</time>
                <h3 className="text-lg font-semibold">Order Placed</h3>
                <p className="mb-4 text-base font-normal text-muted-foreground">Your order has been received and is being processed.</p>
              </li>
              <li className="mb-10 ml-4">
                <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-background"></div>
                <time className="mb-1 text-sm font-normal leading-none text-muted-foreground">May 2, 2023</time>
                <h3 className="text-lg font-semibold">Order Shipped</h3>
                <p className="text-base font-normal text-muted-foreground">Your order has been shipped. Estimated delivery: May 5, 2023.</p>
              </li>
            </ol>
          </CardContent>
        </Card>
        <div className="flex justify-between items-center">
          <Button className="w-full sm:w-auto mt-4 sm:mt-0">
            <Truck className="mr-2 h-4 w-4" /> {t("track-shipment")}
          </Button>
        </div>
      </div>
    </div>
  );
}
