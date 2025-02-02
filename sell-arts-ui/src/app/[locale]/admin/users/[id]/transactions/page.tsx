import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { use } from "react";
import { getAllArtistTransactions, getArtistTransactionsAdmin } from "@/actions/account";
import moment from "moment";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomPagination from "@/components/ui/custom-pagination";

export default async function AccountPage({ searchParams, params }: any) {
  const paramData = await params;
  const search = await searchParams;
  const res = await getArtistTransactionsAdmin(paramData.id, search["page"] || 0);

  if (!res.success) {
    return <div>Unable to load data. {res.message}</div>;
  }

  const accountInfo = {
    totalSales: res.data.totalAmount,
    accountBalance: res.data.balanceAmount,
  };

  return (
    <div className="">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${accountInfo.totalSales?.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${accountInfo.accountBalance?.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payout Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${accountInfo.accountBalance?.toFixed(2)}</div>
          </CardContent>
          <CardFooter>
            <Link href={accountInfo.accountBalance <= 0 ? "#" : "pay"}>
              <Button disabled={accountInfo.accountBalance <= 0}>Pay</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {res.data.transactions.content.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{moment(transaction.createdAt).format("D MMM Y")}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === "CREDIT" ? "outline" : "destructive"}>{transaction.type}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <CardFooter>
            <CustomPagination page={res.data.transactions} />
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
