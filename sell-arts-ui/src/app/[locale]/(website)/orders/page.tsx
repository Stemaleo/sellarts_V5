// "use client";

import Image from "next/image";
import { Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { use } from "react";
import { getAllOrders } from "@/actions/cart";
import moment from "moment";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default function OrderHistoryGrid() {
  const res = use(getAllOrders());
  const t = use(getTranslations());
  if (!res.success) {
    return <div>Unable to load</div>;
  }

  const orders = res.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("order-history")}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {t("common.order")} #{order.id}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {t("view-items")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <h3 className="font-semibold mb-2">{t("order-items")}:</h3>
                    <ScrollArea className="h-[300px] pr-4">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 mb-4">
                          <Image src={item.artWork.mediaUrls[0]} alt={item.artWork.title} width={60} height={60} className="rounded-md aspect-square object-cover" />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.artWork.title}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  <p>
                    {t("common.date")}: {moment(order.createdAt).format("D M Y")}
                  </p>
                  <p>
                    {t("common.status")}: {order.status?.toLocaleLowerCase()}
                  </p>
                </div>
                <p className="font-semibold">
                  {t("common.total")}: ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              {order.status == "WAITING_PAYMENT" && (
                <Link href={`/checkout/${order.id}/2`}>
                  <Button size={"sm"}>{t("complete-payment")}</Button>
                </Link>
              )}
              <Link href={`/orders/${order.id}`}>
                <Button size={"sm"}>{t("view-details")}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">{t("no-orders-found")}</p>
            <p className="text-sm text-muted-foreground">{t("when-you-make-a-purchase-your-orders-will-appear-here")}.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
