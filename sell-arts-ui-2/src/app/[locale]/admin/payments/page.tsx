import { CalendarIcon, ChevronDownIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import { getAllOrdersForAdmin } from "@/actions/cart";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import moment from "moment";
import Link from "next/link";
import { getAllPayments } from "@/actions/payment";
import { cn } from "@/lib/utils";

export default async function Component({ searchParams }: any) {
  const search = await searchParams;

  const res = await getAllPayments(search["page"] || 0);

  if (!res.success) {
    return <div>Unable to load...</div>;
  }

  const ordersData = res.data;
  const orders = ordersData.content;

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-5">Payment History</h1>
      {/* <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex w-full sm:w-auto space-x-2">
          <Input placeholder="Search payment..." className="max-w-sm" />
          <Button variant="outline" size="icon">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2"></div>
      </div> */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Payment ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.orderId}</TableCell>
                <TableCell>FCFA {payment.amount}</TableCell>
                <TableCell>{moment(payment.createdAt).format("D MMM Y, h:m:ss")}</TableCell>
                <TableCell>{payment.ownerName}</TableCell>
                <TableCell>
                  <Badge
                    variant={"outline"}
                    className={cn({
                      "text-red-500 border-red-500": payment.orderStatus == "FAILED",
                      "text-green-500 border-green-500": payment.orderStatus == "SUCCESS",
                      "text-blue-500 border-blue-500": payment.orderStatus == "PENDING",
                    })}
                  >
                    {payment.orderStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8 flex justify-center items-center">
        <Button variant="outline" disabled={res.data.page.number == 0} className="mx-2">
          <Link href={"/admin/orders?page=" + (res.data.page.number - 1)}>Previous</Link>
        </Button>
        <p className="min-w-64 text-center text-muted-foreground">
          Page {ordersData.page.number + 1} of {ordersData.page.totalPages}
        </p>
        <Button variant="outline" disabled={res.data.page.number >= res.data.page.totalPages - 1} className="mx-2">
          <Link href={"/admin/orders?page=" + (res.data.page.number + 1)}>Next</Link>
        </Button>
      </div>
    </div>
  );
}
