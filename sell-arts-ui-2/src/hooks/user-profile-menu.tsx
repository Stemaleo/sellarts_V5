"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Palette, FlameKindling, Wrench, ShoppingBag, Heart, DollarSign } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function UserProfileMenu({ data }: { data: Session }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleViewProfile = () => {
    console.log("View Profile clicked");
    // Add your logic here
  };

  const handleSettings = () => {
    console.log("Settings clicked");
    // Add your logic here
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="relative inline-block" id="profileMenu">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 h-auto " onClick={toggleMenu}>
            <Avatar className="h-10 w-10 border-2 outline-none ring-0 border-primary transition-all duration-300 ease-in-out hover:scale-110">
              <AvatarImage className="object-cover" src={data.user?.profileImageUrl} alt={data?.user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {data.user?.name
                  ?.split(" ")
                  .map((n: any) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Open user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mt-2" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{data.user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{data.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={"/profile"}>
            <DropdownMenuItem onClick={handleViewProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>{t("nav.view-profile")}</span>
            </DropdownMenuItem>
          </Link>
          {/* <DropdownMenuItem onClick={handleSettings}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t("nav.settings")}</span>
          </DropdownMenuItem> */}
          {data.user && (
            <Link href={"/orders"}>
              <DropdownMenuItem>
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>{t("nav.my-orders")}</span>
              </DropdownMenuItem>
            </Link>
          )}
          {data.user && (
            <Link href={"/favorites"}>
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                <span>{t("nav.my-favorites")}</span>
              </DropdownMenuItem>
            </Link>
          )}
          {data.user && (
            <Link href={"/bids"}>
              <DropdownMenuItem>
                <DollarSign className="mr-2 h-4 w-4" />
                <span>{t("nav.my-bids")}</span>
              </DropdownMenuItem>
            </Link>
          )}
          {data.user?.artistProfile != null && (
            <Link href={"/artist_app"}>
              <DropdownMenuItem>
                <Palette className="mr-2 h-4 w-4" />
                <span>{t("nav.dashboard")}</span>
              </DropdownMenuItem>
            </Link>
          )}
          {data.user?.authorities.map((a) => a.authority).includes("ROLE_ADMIN") && (
            <Link href={"/admin"}>
              <DropdownMenuItem>
                <Wrench className="mr-2 h-4 w-4" />
                <span>{t("nav.admin-panel")}</span>
              </DropdownMenuItem>
            </Link>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("nav.log-out")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
