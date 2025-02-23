"use client";
import { sendColabRequest } from "@/actions/colab";
import { subscribeArtist } from "@/actions/subscribe";
import { Button } from "@/components/ui/button";
import { useActions } from "@/lib/hooks";
import { hasRole } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SubscribeButton = ({ artistId, sub }: { artistId: number; sub: boolean }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { execute, loading } = useActions();
  const t = useTranslations();
  if (status == "loading") {
    return <div></div>;
  }

  const handle = () => {
    execute(subscribeArtist, artistId).then((res) => {
      if (res?.success) {
        // toast.success("Colab Request sent...");
        router.refresh();
      }
    });
  };

  return (
    <Button variant={sub ? "outline" : "default"} loading={loading} size={"sm"} onClick={handle}>
      {sub ? t("common.subscribed") : t("common.subscribe")}
    </Button>
  );
};

export default SubscribeButton;
