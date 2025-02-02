"use client";
 
import { deleteBlog } from "@/actions/blog";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const DeleteButton = ({ blogId }: { blogId: string }) => {
  const router = useRouter();
  return (
    <AlertDialogAction
      onClick={async () => {
        const res = await deleteBlog(blogId);
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
