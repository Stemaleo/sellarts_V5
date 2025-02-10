"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn, hasRole } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Banknote, Bell, ChevronDown, Code, DollarSign, FlagIcon, Home, LayoutDashboard, Menu, PaintBucket, PaintRoller, Search, Settings, ShoppingCart, TicketsIcon, Users, Users2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import NotificationButton from "@/components/notification-button";
import artist from "@/assets/logo/Fluent Emoji Artist.svg";
import art from "@/assets/logo/Fluent Color Icons.svg";
import unjs from "@/assets/logo/UnJS Theme Colors.svg";
import cart from "@/assets/logo/Shopping Cart Icon.svg";
import flag from "@/assets/logo/Fluent Emoji Flag in Hole.svg";
import ticket from "@/assets/logo/Noto Ticket Icon.svg";
import money from "@/assets/logo/Money with Wings Icon.svg";
import currency from "@/assets/logo/Currency Exchange Icon.svg";
import settings from "@/assets/logo/Settings Icon.svg";
import people from "@/assets/logo/Fluent Color People 24.svg";
import Image from "next/image";
interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  show: boolean;
}

export default function ArtistLayout() {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const { data, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/login");
    },
  });

  const navItems: NavItem[] = [
    // { title: t("nav.Home"), href: "/artist_app", icon: <LayoutDashboard className="h-4 w-4" />, show: true },
    { title: t("nav.Arts"), href: "/artist_app/arts", icon: <Image src={unjs} width={50} alt="" />, show: true },
    { title: t("nav.orders"), href: "/artist_app/orders", icon: <Image src={cart} width={50} alt="" />, show: true },
    { title: t("nav.account"), href: "/artist_app/accounts", icon: <Image src={art} width={50} alt="" />, show: true },
    { title: t("nav.colab"), href: "/artist_app/colab", icon: <Image src={people} width={50} alt="" />, show: true },
    { title: t("nav.Artists"), href: "/artist_app/artists", icon: <Image src={artist} width={50} alt="" />, show: hasRole(data, "ROLE_GALLERY") },
    { title: "Events", href: "/artist_app/events", icon: <Image src={flag} width={50} alt="" />, show: hasRole(data, "ROLE_GALLERY") },
    { title: "Tickets", href: "/artist_app/tickets", icon: <Image src={ticket} width={50} alt="" />, show: true },
    { title: t("nav.my-bids"), href: "/artist_app/bids", icon: <Image src={money} width={50} alt="" />, show: true },
    { title: t("nav.promo-codes"), href: "/artist_app/promo", icon: <Image src={currency} width={50} alt="" />, show: true },
    { title: t("nav.settings"), href: "/artist_app/settings", icon: <Image src={settings} width={50} alt="" />, show: true },
  ];

  if (status == "loading") {
    return <div>Loading...</div>;
  }

  if (data != null && data.user.artistProfile == null) {
    toast.error("Create your artist profile first");
    router.push("/");
  }

  return (
    <div className="relative h-[91vh] w-full">
      <div className="fixed bottom-0 left-0 right-0 h-[80vh] bg-slate-100 rounded-t-full lg:rounded-t-[100%] -z-10"></div>
      <div className="max-w-2xl pt-32 mx-auto grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4 gap-8 lg:gap-12">
        {navItems.map((nav, index) => {
          return (
            <Link href={nav.href} key={index}>
              <div className="bg-white shadow-lg hover:shadow rounded-lg aspect-square flex justify-center items-center" key={index}>
                {nav.icon}
              </div>
              <p className="text-center mt-4">{nav.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
