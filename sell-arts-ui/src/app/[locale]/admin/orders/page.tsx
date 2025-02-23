import { CalendarIcon, ChevronDownIcon, SearchIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { use } from "react";
import { getAllOrdersForAdmin } from "@/actions/cart";
import moment from "moment";

export default async function Component({ searchParams }: any) {
  const search = await searchParams;

  const res = await getAllOrdersForAdmin(search["page"] || 0, search["orderId"] || "");

  if (!res.success) {
    return <div>Unable to load...</div>;
  }

  const ordersData = res.data;
  const orders = ordersData.content;

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-5">Order History</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <form action={""} className="flex w-full sm:w-auto space-x-2">
          <input name="page" value={"0"} hidden readOnly />
          <Input placeholder="Search orders..." type="number" defaultValue={search["orderId"] ?? ""} name="orderId" className="max-w-sm" />
          <Button variant="outline" size="icon">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex space-x-2"></div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.owner?.name}</TableCell>
                <TableCell>{moment(order.createdAt).format("D MMM Y")}</TableCell>
                <TableCell>FCFA {order.totalAmount}</TableCell>
                <TableCell>{order.adminShare}</TableCell>
                <TableCell>
                  <Badge variant={order.status === "DELIVERED" ? "default" : order.status === "PENDING" ? "secondary" : order.status === "SHIPPED" ? "outline" : "destructive"}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
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
