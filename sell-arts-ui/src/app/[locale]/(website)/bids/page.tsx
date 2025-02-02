import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { getMyBids } from "@/actions/bid";
import { use } from "react";
import { getTranslations } from "next-intl/server";

const MyBids = () => {
  const res = use(getMyBids());
  const t = use(getTranslations());

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">{t("bids.your-bids")}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("bids.bid-id")}</TableHead>
            <TableHead>{t("common.artwork")}</TableHead>
            <TableHead className="text-right">{t("common.amount")}</TableHead>
            <TableHead className="text-center">{t("common.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell className="font-medium">{bid.id}</TableCell>
              <TableCell>{bid.artwork.title}</TableCell>
              <TableCell className="text-right">${bid.amount.toLocaleString()}</TableCell>
              <TableCell className="text-center">
                <Badge variant={bid.status === "REJECTED" ? "destructive" : "default"}>{bid.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyBids;
