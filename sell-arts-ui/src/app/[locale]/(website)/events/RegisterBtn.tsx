"use client";
import { registerEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { useActions } from "@/lib/hooks";
import { Event } from "@/lib/type";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const RegisterEventButton = ({ event }: { event: Event }) => {
  const { loading, execute } = useActions();
  const t = useTranslations();
  const handle = () => {
    execute(registerEvent, event.id).then((res) => {
      if (res?.success) {
        toast.success("Registered...");
      }
    });
  };

  return (
    <Button onClick={handle} loading={loading} disabled={loading} className="w-full">
      {t("register.register")}
    </Button>
  );
};

export default RegisterEventButton;
