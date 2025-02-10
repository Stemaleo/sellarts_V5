import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import AddView from "./AddView";
import { use } from "react";
import { getMyPromos } from "@/actions/promo";
import { Switch } from "@/components/ui/switch";
import { Delete, Trash2 } from "lucide-react";
import PromoDeleteBtn from "./DeleteBtn";
import ActiveSwitch from "./ActiveSwtich";
import { getTranslations } from "next-intl/server";

const PromoCodes = () => {
  const res = use(getMyPromos());
  const t = use(getTranslations());

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">{t("your-promo-codes")}</h2>
        <AddView />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">{t("code")}</TableHead>
            <TableHead>{t("common.amount")}</TableHead>
            <TableHead>{t("active")}?</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell className="font-medium">{bid.code}</TableCell>
              <TableCell className="">{bid.amount.toLocaleString()}</TableCell>
              <TableCell>
                <ActiveSwitch promo={bid} />
              </TableCell>
              <TableCell>
                <PromoDeleteBtn promo={bid} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PromoCodes;
