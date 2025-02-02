"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TabItem {
  label: string;
  href: string;
}

interface TabsNavProps {
  tabs: TabItem[];
}

export function TabsNav({ tabs }: TabsNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4 border-b">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} className={cn("px-3 py-2 text-sm font-medium transition-colors hover:text-primary", pathname.endsWith(tab.href.split("/")[tab.href.split("/").length - 1]) ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
