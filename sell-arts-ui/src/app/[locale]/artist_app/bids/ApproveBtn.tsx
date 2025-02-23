"use client";

import { updateBid } from "@/actions/bid";
import { Button } from "@/components/ui/button";
import { useActions } from "@/lib/hooks";
import { Bid } from "@/lib/type";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const ApproveBtn = ({ bid }: { bid: Bid }) => {
  const { execute, loading } = useActions();
  const router = useRouter();
  const t = useTranslations();
  return (
    <Button
      disabled={loading}
      loading={loading}
      size={"sm"}
      onClick={() => {
        execute(updateBid, bid.id, "APPROVED");
        router.refresh();
      }}
    >
      {t("approve")}
    </Button>
  );
};

export default ApproveBtn;
