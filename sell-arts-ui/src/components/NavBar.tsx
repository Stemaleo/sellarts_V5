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
    <nav className="bg-white shadow top-0 z-30 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Mobile Menu & Search */}
          <div className="flex items-center lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
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
                  <div className="flex flex-col gap-4 w-full">
                    <CurrencySelector />
                    <LocaleSwitcher />
                    {(status == "unauthenticated" || status == "loading") && (
                      <Link href={"/login"} className="block w-full text-sm font-medium text-gray-500 hover:text-gray-900">
                        <Button className="w-full">{t("Login")}</Button>
                      </Link>
                    )}
                    {status == "authenticated" && <UserProfileMenu data={data} />}
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <div className="block ml-2">
              <SearchSheet />
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-xs">
            <SearchSheet />
          </div>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 text-2xl font-bold text-gray-800">
            <Image width={300} height={100} src={logo} id="logo" alt="Logo" className="w-[100px] sm:w-[150px] md:w-[200px] h-auto" priority />
          </Link>

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <div className="hidden lg:block">
              <CurrencySelector />
            </div>
            <div className="hidden lg:block">
              <LocaleSwitcher />
            </div>
            <CartPopupComponent />
            <NotificationButton />
            {(status == "unauthenticated" || status == "loading") && (
              <Link href={"/login"}>
                <Button size={"icon"} variant={"ghost"}>
                  <User2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            )}
            {status == "authenticated" && <UserProfileMenu data={data} />}
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden sm:flex justify-center mt-4">
          <div className="flex space-x-2 md:space-x-4 lg:space-x-8 overflow-x-auto pb-2">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="whitespace-nowrap text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
