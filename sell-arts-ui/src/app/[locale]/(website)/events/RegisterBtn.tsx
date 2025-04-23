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
        // Refresh the page to update the UI after successful registration
        window.location.reload();
      } else {
        toast.error(res?.message || "Registration failed");
      }
    }).catch(error => {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    });
  };

  return (
    <Button onClick={handle} loading={loading} disabled={loading} className="w-full">
      {t("register.register")}
    </Button>
  );    
};

export default RegisterEventButton;
