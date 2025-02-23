"use client";

import { updateColabRequest } from "@/actions/colab";
import { Button } from "@/components/ui/button";
import { useActions } from "@/lib/hooks";
import { ColabRequest } from "@/lib/type";
import { hasRole } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const ColabActions = ({ item }: { item: ColabRequest }) => {
  const { data, status } = useSession();
  const { execute, loading } = useActions<ColabRequest>();

  if (status === "loading") {
    return <div></div>;
  }
  if (loading) {
    return <Button loading={true}></Button>;
  }

  const handle = (status: string) => {
    execute(updateColabRequest, item.id.toString(), status).then((res) => {
      if (res?.success) {
        toast.success("Updated");
        item = res.data;
      }
    });
  };

  if (item.status != "PENDING") {
    return <div></div>;
  }

  return (
    <div>
      {hasRole(data, "ROLE_ARTIST") && (
        <div className="flex gap-4">
          <Button onClick={() => handle("ACCEPTED")}>Approve</Button>
          <Button onClick={() => handle("REJECTED")}>Reject</Button>
        </div>
      )}
      {hasRole(data, "ROLE_GALLERY") && (
        <div>
          <Button onClick={() => handle("REVOKED")}>Revoke</Button>
        </div>
      )}
    </div>
  );
};

export default ColabActions;
