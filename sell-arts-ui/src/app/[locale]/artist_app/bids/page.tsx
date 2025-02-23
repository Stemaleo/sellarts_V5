import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { getArtistBids, getMyBids } from "@/actions/bid";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ApproveBtn from "./ApproveBtn";
import RejectBtn from "./RejectBtn";
import { getTranslations } from "next-intl/server";

const MyBids = () => {
  const res = use(getArtistBids());
  const t = use(getTranslations());

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">{t("bids.your-bids")}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("bids.bid-id")}</TableHead>
            <TableHead>{t("common.artwork")}</TableHead>
            <TableHead className="text-right">{t("common.amount")}</TableHead>
            <TableHead className="text-center">{t("common.status")}</TableHead>
            <TableHead className="">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell className="font-medium">{bid.id}</TableCell>
              <TableCell>
                <Link className="underline underline-offset-2" href={`/arts/${bid.artwork.id}`}>
                  {bid.artwork.title}
                </Link>
              </TableCell>
              <TableCell className="text-right">FCFA {bid.amount.toLocaleString()}</TableCell>
              <TableCell className="text-center">
                <Badge variant={bid.status === "REJECTED" ? "destructive" : "default"}>{bid.status}</Badge>
              </TableCell>
              <TableCell>
                {bid.status == "CREATED" && (
                  <div className="flex gap-4">
                    <ApproveBtn bid={bid} />
                    <RejectBtn bid={bid} />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyBids;
