"use client";

import { deletePromo } from "@/actions/promo";
import { Button } from "@/components/ui/button";
import { useActions } from "@/lib/hooks";
import { Promo } from "@/lib/type";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PromoDeleteBtn = ({ promo }: { promo: Promo }) => {
  const { execute, loading } = useActions();
  const router = useRouter();
  return (
    <Button
      loading={loading}
      disabled={loading}
      onClick={() => {
        execute(deletePromo, promo.id).then((res) => {
          if (res?.success) {
            toast.warning("Deleted...");
            router.refresh();
          }
        });
      }}
      size={"icon"}
      variant={"outline"}
    >
      <Trash2 className="size-4" />
    </Button>
  );
};

export default PromoDeleteBtn;
