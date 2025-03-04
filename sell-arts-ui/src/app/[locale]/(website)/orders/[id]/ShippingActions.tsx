"use client";

import { useState } from "react";
import { Download, Loader2, Package, Truck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShippingActionsProps {
  orderId: string;
  shippingInfo: {
    id: string;
    label: string;
    labelPdf?: string;
    invoicePdf?: string;
    trackingUrl?: string;
    trackingNumber?: string;
  };
}

export default function ShippingActions({ orderId, shippingInfo }: ShippingActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = (base64Data: string | undefined, fileName: string) => {
    if (!base64Data) {
      toast.error("No document available");
      return;
    }
    
    const linkSource = `data:application/pdf;base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  const handleCopyReference = () => {
    if (shippingInfo.label) {
      navigator.clipboard.writeText(shippingInfo.label);
      toast.success("Référence copiée!");
    }
  };

  const handleTrackShipment = () => {
    if (shippingInfo.label) {
      window.open(`https://parcelsapp.com/en/tracking/${shippingInfo.label}`, '_blank');
    } else {
      toast.error("No tracking information available");
    }
  };

  return (
    <>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleTrackShipment}
        className="text-xs"
      >
        <ChevronRight className="h-3 w-3 mr-1" />
        Tracking
      </Button>
      
      <span 
        className="text-sm font-medium cursor-pointer"
        onClick={handleCopyReference}
        title="Click to copy"
      >Ref: {shippingInfo.label}
      </span>
    </>
  );
}
