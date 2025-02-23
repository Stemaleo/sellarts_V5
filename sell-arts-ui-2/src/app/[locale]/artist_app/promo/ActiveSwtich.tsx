"use client";

import { updatePromo } from "@/actions/promo";
import { Switch } from "@/components/ui/switch";
import { useActions } from "@/lib/hooks";
import { Promo } from "@/lib/type";

const ActiveSwitch = ({ promo }: { promo: Promo }) => {
  const { loading, execute } = useActions();

  return (
    <Switch
      defaultChecked={promo.active}
      onCheckedChange={(chec) => {
        execute(updatePromo, promo.id, chec ? "active" : "inactive");
      }}
    />
  );
};

export default ActiveSwitch;
