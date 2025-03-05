"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, LogInIcon, LogOutIcon, Menu, ShoppingBag, User2Icon, X } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import UserProfileMenu from "@/hooks/user-profile-menu";
import { Input } from "./ui/input";
import { CartPopupComponent } from "./cart-popup";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import SearchSheet from "./SearchSheet";
import NotificationButton from "./notification-button";
import { LocaleSwitcher } from "./LocalSwitch";
import CurrencySelector from "./CurrencySelector";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useParams();
  const t = useTranslations("nav");
  const { status, data } = useSession();

  const navItems = [
    { name: t("Artists"), href: "/artists" },
    { name: t("Arts"), href: "/arts" },
    { name: t("the-news"), href: "/posts" },
    { name: t("paint"), href: "/arts?paintingType=Paint" },
    { name: t("sculpture"), href: "/arts?paintingType=Sculpture" },
    { name: t("photography"), href: "/arts?paintingType=Photography" },
    { name: t("drawing"), href: "/arts?paintingType=Drawing" },
    { name: t("Gallery"), href: "/gallery" },
    { name: t("events"), href: "/events" },
    { name: t("blogs"), href: "/blogs" },
  ];

  return (
    <nav className="bg-white shadow  top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center sm:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:hidden flex flex-col">
                <SheetTitle className="font-bold text-xl">Menu</SheetTitle>
                <div className="mt-6 flow-root flex-1">
                  <div className="flex items-center justify-between"></div>
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navItems.map((item) => (
                        <Link key={item.name} href={item.href} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  {(status == "unauthenticated" || status == "loading") && (
                    <Link href={"/login"} className="block w-full mt-8 text-sm font-medium text-gray-500 hover:text-gray-900">
                      <Button className="w-full">{t("Login")}</Button>
                    </Link>
                  )}
                  {status == "authenticated" && <UserProfileMenu data={data} />}
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <div className="block">
              <SearchSheet />
            </div>
          </div>
          <div className="hidden md:block">
            <SearchSheet />
          </div>
          <Link href="/" className="text-2xl font-bold text-gray-800 w-[250px]">
            <Image width={300} src={logo} id="logo" alt="Logo" />
          </Link>
          <div className="flex gap-0 md:gap-5 items-center">
            <div>
            <CurrencySelector />
            </div>
            <div className="hidden md:block">
              <LocaleSwitcher />
            </div>
            <div>
              <CartPopupComponent />
            </div>
            <div>
              <NotificationButton />
            </div>
            {(status == "unauthenticated" || status == "loading") && (
              <Link href={"/login"} className="">
                <Button size={"icon"} variant={"ghost"}>
                  <User2Icon className="h-5 w-5" />
                </Button>
              </Link>
            )}
            {status == "authenticated" && <UserProfileMenu data={data} />}
          </div>
        </div>
        <div className="flex justify-center items-center mt-6">
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 mt-6 mb-6">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
