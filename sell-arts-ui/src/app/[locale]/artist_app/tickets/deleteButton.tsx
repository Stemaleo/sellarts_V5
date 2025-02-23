"use client";
 
import { deleteBlog } from "@/actions/blog";
import { deleteTicket } from "@/actions/tickets";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const DeleteButton = ({ ticketId }: { ticketId: string }) => {
  const router = useRouter();
  return (
    <AlertDialogAction
      onClick={async () => {
        const res = await deleteTicket(ticketId);
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
