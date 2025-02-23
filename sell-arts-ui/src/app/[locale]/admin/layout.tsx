"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LayoutDashboard, Users, ShoppingCart, FileText, Settings, Menu, PaintRoller, SlashIcon, ShoppingBag, DollarSign, Banknote, Rss, RssIcon, Heart, Paintbrush, MessageCircleCodeIcon, MessageCircle, Palette, Cog } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import NotificationButton from "@/components/notification-button";
import { LocaleSwitcher } from "@/components/LocalSwitch";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Blogs", href: "/admin/blogs", icon: RssIcon },
  { name: "Painting Types", href: "/admin/paintingTypes", icon: PaintRoller },
  { name: "Materials", href: "/admin/materials", icon: SlashIcon },
  { name: "Style", href: "/admin/styles", icon: Palette },  // Changer l'icône ici
  { name: "Method", href: "/admin/methods", icon: Cog  },   // Changer l'icône ici
  { name: "Arts", href: "/admin/arts", icon: Paintbrush },
  { name: "Messages", href: "/admin/messages", icon: MessageCircle },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Favourites", href: "/admin/favorites", icon: Heart },
  { name: "Payments", href: "/admin/payments", icon: Banknote },
];

export default function SuperAdminDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/login");
    },
  });

  React.useEffect(() => {
    if (status == "authenticated" && data != null) {
      if (!data.user.authorities.map((a) => a.authority).includes("ROLE_ADMIN")) {
        router.push("/login");
      }
    }
  }, [router, status]);

  if (status == "loading") {
    return <div>Authenticating...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for larger screens */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gray-200 text-gray-800">
        <div className="flex items-center justify-center h-16 px-4 bg-gray-800 text-white text-xl font-bold">SuperAdmin</div>
        <ScrollArea className="flex-1">
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={cn("flex text-gray-800 items-center px-4 py-2 text-sm  rounded-md", pathname.endsWith(item.href) ? "bg-gray-600 text-white" : "text-gray-800 hover:bg-gray-700 hover:text-white")}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex items-center justify-center h-16 px-4 bg-gray-800 text-white text-xl font-bold">SuperAdmin</div>
                <ScrollArea className="flex-1">
                  <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href} className={cn("flex items-center px-4 py-2 text-sm font-medium rounded-md", pathname === item.href ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")}>
                        <item.icon className="mr-3 h-6 w-6" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Search bar placeholder */}
            <div className="flex-1 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md">
                <form className="relative">
                  <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <LocaleSwitcher />

              <NotificationButton />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <img src={data.user.profileImageUrl} alt="User avatar" className="rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
