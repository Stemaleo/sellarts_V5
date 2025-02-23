"use client";

import Link from "next/link";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageableResponse } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

const CustomPagination = ({ page }: { page: PageableResponse<any> }) => {
  const router = useRouter();
  const params = new URLSearchParams(useSearchParams());

  const handleMaterialTypeChange = (key: string) => {
    params.set("page", key);

    router.push(`?${params.toString().replaceAll("%2C", ",")}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0 w-full">
      <Button
        onClick={() => {
          handleMaterialTypeChange((page.page.number - 1).toString());
        }}
        variant="outline"
        disabled={page.page.number == 0}
        className="w-full sm:w-auto"
      >
        {/* <Link href={`?page=` + (page.page.number - 1)} className="flex gap-2 items-center"> */}
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
        {/* </Link> */}
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page.page.number + 1} of {page.page.totalPages}
      </span>
      <Button
        onClick={() => {
          handleMaterialTypeChange((page.page.number + 1).toString());
        }}
        variant="outline"
        disabled={page.page.number >= page.page.totalPages - 1}
        className="w-full sm:w-auto"
      >
        {/* <Link href={`?page=` + (page.page.number + 1)} className="flex gap-2 items-center"> */}
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
        {/* </Link> */}
      </Button>
    </div>
  );
};

export default CustomPagination;
