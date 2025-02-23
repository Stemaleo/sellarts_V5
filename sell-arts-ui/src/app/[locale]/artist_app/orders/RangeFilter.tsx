"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { PaintingType } from "@/lib/type";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const RangeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [range, setRange] = useState(searchParams.get("range") || "");
  const t = useTranslations();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
      params.set("page", "0");
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <Select
        defaultValue={range}
        onValueChange={(val) => {
          handleFilterChange("range", val);
          setRange("");
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("all-time")}</SelectItem>
          <SelectItem value="this_month">{t("this-month")}</SelectItem>
          <SelectItem value="last_month">{t("last-month")}</SelectItem>
          <SelectItem value="this_year">{t("this-year")}</SelectItem>
          <SelectItem value="last_year">{t("last-year")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RangeFilter;
