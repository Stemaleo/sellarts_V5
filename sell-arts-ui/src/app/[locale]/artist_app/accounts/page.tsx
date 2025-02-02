import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { use } from "react";
import { getAllArtistTransactions } from "@/actions/account";
import moment from "moment";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomPagination from "@/components/ui/custom-pagination";
import { getTranslations } from "next-intl/server";

export default async function AccountPage({ searchParams }: any) {
  const search = await searchParams;
  const res = await getAllArtistTransactions(search["page"] || 0);
  const t = await getTranslations();

  if (!res.success) {
    return <div>Unable to load data. {res.message}</div>;
  }

  const accountInfo = {
    totalSales: res.data.totalAmount,
    accountBalance: res.data.balanceAmount,
  };

  return (
    <div className="">
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total-sales")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">FCFA {accountInfo.totalSales?.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("current-balance")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">FCFA {accountInfo.accountBalance?.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("recent-transactions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.date")}</TableHead>
                <TableHead>{t("description")}</TableHead>
                <TableHead>{t("common.amount")}</TableHead>
                <TableHead>{t("common.type")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {res.data.transactions.content.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{moment(transaction.createdAt).format("D MMM Y")}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>FCFA {transaction.amount.toFixed(2)}</TableCell>
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
