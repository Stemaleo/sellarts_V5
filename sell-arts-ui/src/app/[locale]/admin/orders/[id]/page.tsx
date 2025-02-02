import { useState } from "react";
import { ArrowLeft, Package, Truck } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAOrder, getAOrderForAdmin } from "@/actions/cart";
import moment from "moment";
import { cn } from "@/lib/utils";

export default async function AdminOrderDetails({ params }: any) {
  const meta = await params;
  const res = await getAOrderForAdmin(meta.id);
  if (!res.success) {
    return <div>{res.message}</div>;
  }
  const orderData = res.data;
  // Mock data for demonstration
  // Mock data for demonstration
  const order = {
    id: res.data.id,
    date: moment(orderData.createdAt).format("D MMM Y"),
    status: orderData.status,
    total: orderData.totalAmount,

    items: orderData.orderItems,
  };

  return (
    <div className="">
      <div className="mb-6">
        <Link href="/admin/orders" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <Badge variant={order.status === "DELIVERED" ? "default" : order.status === "PENDING" ? "secondary" : "outline"} className="text-lg py-1 px-3">
            {order.status}
          </Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Order Date</dt>
                  <dd>{order.date}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Total Amount</dt>
                  <dd className="font-bold">{order.total}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-2 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Name</dt>
                  <dd>{orderData.owner?.name}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Email</dt>
                  <dd>{orderData.owner?.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Phone</dt>
                  <dd>{orderData.phone}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <address className="text-sm not-italic">
              {orderData.owner?.name}
              <br />
              {orderData.address}
              <br />
              {orderData.city}, {orderData.state}, {orderData.postalCode} <br />
              {orderData.phone}
            </address>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
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
                    <TableCell className="text-right">FCFA {item.price}</TableCell>
                    <TableCell className="text-right font-medium">{item.price}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right font-medium">FCFA {order.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>List of payments and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {res.data.payments.length == 0 && <div>No Payments made yet</div>}
            {res.data.payments.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Date Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {res.data.payments.map((pay) => {
                    return (
                      <TableRow key={pay.id}>
                        <TableCell>{pay.paymentId}</TableCell>
                        <TableCell>{moment(pay.createdAt).format("D MMM Y, h:m:ss")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={"outline"}
                            className={cn({
                              "text-red-500 border-red-500": pay.orderStatus == "FAILED",
                              "text-green-500 border-green-500": pay.orderStatus == "SUCCESS",
                              "text-blue-500 border-blue-500": pay.orderStatus == "PENDING",
                            })}
                          >
                            {pay.orderStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Update Order Status</CardTitle>
            <CardDescription>Change the current status of the order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  New Status
                </label>
                <Select defaultValue={order.status}>
                  <SelectTrigger id="status" className="col-span-3">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="note" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Status Note
                </label>
                <Textarea id="note" placeholder="Add a note about this status change" className="col-span-3" />
              </div>
            </div>
          </CardContent>
          <Separator className="my-4" />
          <div className="p-4 flex justify-end">
            <Button>Update Status</Button>
          </div>
        </Card>
        <div className="flex justify-between items-center">
          {/* <Button variant="outline" className="w-full sm:w-auto">
            <Package className="mr-2 h-4 w-4" /> Download Invoice
          </Button> */}
          <Button className="w-full sm:w-auto mt-4 sm:mt-0">
            <Truck className="mr-2 h-4 w-4" /> Track Shipment
          </Button>
        </div>
      </div>
    </div>
  );
}
