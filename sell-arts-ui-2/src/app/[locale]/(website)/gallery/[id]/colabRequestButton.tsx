"use client";
import { sendColabRequest } from "@/actions/colab";
import { Button } from "@/components/ui/button";
import { useActions } from "@/lib/hooks";
import { hasRole } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const ColabRequestButton = ({ artistId }: { artistId: string }) => {
  const { data: session, status } = useSession();
  const { execute, loading } = useActions();
  if (status == "loading") {
    return <div></div>;
  }

  const handle = () => {
    execute(sendColabRequest, artistId).then((res) => {
      if (res?.success) {
        toast.success("Colab Request sent...");
      }
    });
  };

  return (
    hasRole(session, "ROLE_GALLERY") && (
      <Button loading={loading} size={"sm"} onClick={handle}>
        Send Colab Request {session?.user.name}{" "}
      </Button>
    )
  );
};

export default ColabRequestButton;
