"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ArtistFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState(searchParams.get("title") || "");

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFilterChange("title", title);
      }}
      className="flex flex-col md:flex-row gap-4 mb-6"
    >
      <div className="flex-grow">
        <Input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          type="text"
          placeholder={""}
          className="w-full"
        />
      </div>
      <Button>Search</Button>
    </form>
  );
};

export default ArtistFilter;
