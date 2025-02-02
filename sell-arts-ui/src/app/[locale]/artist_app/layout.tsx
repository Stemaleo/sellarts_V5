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
import { Banknote, Bell, ChevronDown, Code, DollarSign, FlagIcon, Home, LayoutDashboard, ListIcon, Menu, PaintBucket, PaintRoller, PodcastIcon, Search, Settings, ShoppingCart, TicketsIcon, Users, Users2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import NotificationButton from "@/components/notification-button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  show: boolean;
}

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
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
    { title: t("nav.Home"), href: "/artist_app", icon: <LayoutDashboard className="h-4 w-4" />, show: true },
    { title: t("nav.Arts"), href: "/artist_app/arts", icon: <PaintBucket className="h-4 w-4" />, show: true },
    { title: t("nav.orders"), href: "/artist_app/orders", icon: <ShoppingCart className="h-4 w-4" />, show: true },
    { title: t("nav.account"), href: "/artist_app/accounts", icon: <Banknote className="h-4 w-4" />, show: true },
    { title: t("nav.colab"), href: "/artist_app/colab", icon: <Users2 className="h-4 w-4" />, show: true },
    { title: t("nav.Artists"), href: "/artist_app/artists", icon: <PaintRoller className="h-4 w-4" />, show: hasRole(data, "ROLE_GALLERY") },
    { title: t("nav.catalogues"), href: "/artist_app/catalogues", icon: <ListIcon className="h-4 w-4" />, show: true },
    { title: t("nav.events"), href: "/artist_app/events", icon: <FlagIcon className="h-4 w-4" />, show: hasRole(data, "ROLE_GALLERY") },
    { title: t("nav.posts"), href: "/artist_app/posts", icon: <PodcastIcon className="h-4 w-4" />, show: true },
    { title: t("nav.tickets"), href: "/artist_app/tickets", icon: <TicketsIcon className="h-4 w-4" />, show: true },
    { title: t("nav.my-bids"), href: "/artist_app/bids", icon: <DollarSign className="h-4 w-4" />, show: true },
    { title: t("nav.promo-codes"), href: "/artist_app/promo", icon: <Code className="h-4 w-4" />, show: hasRole(data, "ROLE_GALLERY") },
    // { title: t("nav.settings"), href: "/artist_app/settings", icon: <Settings className="h-4 w-4" />, show: true },
  ];

  if (status == "loading") {
    return <div>Loading...</div>;
  }

  if (data != null && data.user.artistProfile == null) {
    toast.error("Create your artist profile first");
    router.push("/");
  }

  return (
    <div className="flex h-screen overflow-hidden ">
      {/* Sidebar for larger screens */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="font-bold">Artist DB</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-2">
            {navItems
              .filter((c) => c.show)
              .map((item) => {
                return (
                  <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent menu", pathname === item.href ? "bg-accent" : "transparent")}>
                    {item.icon}
                    {item.title}
                  </Link>
                );
              })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-4">
          <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" id="hamMenu" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle></SheetTitle>

              <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="font-bold">App Name</span>
                </Link>
              </div>
              <ScrollArea className="flex-1">
                <nav className="flex flex-col gap-1 p-2">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent", pathname === item.href ? "bg-accent" : "transparent")} onClick={() => setSidebarOpen(false)}>
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3" />
              </div>
            </form>
          </div>
          <NotificationButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 flex items-center gap-2 rounded-full">
                <Avatar className="h-8 w-8 border-2 border-primary transition-all duration-300 ease-in-out hover:scale-110">
                  <AvatarImage className="object-cover" src={data?.user.profileImageUrl} alt={data?.user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {data?.user?.name
                      ?.split(" ")
                      .map((n: any) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline-flex">{data?.user.name}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={"/artist_app/profile"}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut({
                    redirect: true,
                    callbackUrl: "/",
                  });
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto h-full">
          <div className="container mx-auto h-full p-4 md:p-4 lg:p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
