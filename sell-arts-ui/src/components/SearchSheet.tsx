"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

export default function SearchSheet() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    router.push("/arts?title=" + searchQuery);
    // Implement your search logic here
    setIsOpen(false); // Close the sheet after search
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {/* <Input placeholder="Search..." /> */}

        <Button variant="ghost" className="relative z-10 flex gap-4 md:border" aria-label="Open search">
          <Search className="h-5 w-5 md:hidden" />
          <div className="hidden md:flex gap-4">
            <Search className="h-5 w-5" />
            <p>Search...</p>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full sm:max-w-2xl mx-auto">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSearch} className="mt-4">
          <div className="flex space-x-2">
            <Input type="search" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-grow" autoFocus />
            <Button type="submit">Search</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
