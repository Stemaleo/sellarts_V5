"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const TypeSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());

  return (
    <Select
      onValueChange={(val) => {
        if (val == "all") {
          params.delete("type");
        } else {
          params.set("type", val);
        }
        router.push(`?${params.toString().replaceAll("%2C", ",")}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        {/* <SelectItem value="user">User</SelectItem> */}
        <SelectItem value="artist">Artist</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TypeSelect;
