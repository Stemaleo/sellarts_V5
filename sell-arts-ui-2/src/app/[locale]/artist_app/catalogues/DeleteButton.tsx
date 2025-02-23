"use client";
import { deleteACatalog } from "@/actions/catalog";
import { deleteMaterialType } from "@/actions/materialType";
import { deletePaintingType } from "@/actions/paintingType";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useActions } from "@/lib/hooks";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const DeleteCatalogButton = ({ catalogId }: { catalogId: string }) => {
  const router = useRouter();
  const { execute, loading } = useActions();
  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      loading={loading}
      onClick={async () => {
        const res = await execute(deleteACatalog, catalogId);
        if (res?.success) {
          router.refresh();
        }
      }}
    >
      <Trash2Icon />
    </Button>
  );
};

export default DeleteCatalogButton;
