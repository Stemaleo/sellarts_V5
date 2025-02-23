"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Pour l'indicateur de chargement

const ViewMessagesButton = ({ ticketId }: { ticketId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push(`/artist_app/tickets/${ticketId}`);
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      aria-label="View ticket messages"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        "Voir Messages" // À remplacer par une traduction dynamique
      )}
    </Button>
  );
};

export default ViewMessagesButton;