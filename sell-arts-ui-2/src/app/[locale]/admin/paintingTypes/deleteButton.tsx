"use client";
import { deletePaintingType } from "@/actions/paintingType";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const DeleteButton = ({ paintId }: { paintId: number }) => {
  const router = useRouter();
  return (
    <AlertDialogAction
      onClick={async () => {
        const res = await deletePaintingType(paintId);
        if (res.success) {
          router.refresh();
        }
      }}
    >
      Continue
    </AlertDialogAction>
  );
};

export default DeleteButton;
