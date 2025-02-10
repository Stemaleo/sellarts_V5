"use client";

import { MouseEventHandler, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, Twitter, Facebook, Linkedin, Link2, Check, Send } from "lucide-react";
import { toast } from "sonner";

export function NativeSharePopup({ url = "https://example.com", title = "Check out this link!", useWindow = true }: { url?: string; title?: string; useWindow?: boolean }) {
  const [copied, setCopied] = useState(false);

  const shareNatively = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: (useWindow ? window?.location.href + "/" : window.location.origin + "/") + url,
        });
        toast.success("Shared successfully", {
          description: "The link has been shared using your device's share menu.",
        });
      } catch (error) {}
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window?.location.href + "/" + url).then(() => {
      setCopied(true);
      toast.success("Coppied to clipboard");

      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Button
      variant="ghost"
      size={"sm"}
      className="w-full bg-white/40"
      onClick={(e) => {
        e.stopPropagation(); //
        e.preventDefault();
        shareNatively();
      }}
    >
      {/* <Send className=" text-primary h-4 w-4" /> */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-primary -rotate-12">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
      </svg>
    </Button>
  );
}
