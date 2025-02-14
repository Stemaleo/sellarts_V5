"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";


interface ArtistFilterProps {
  onFilterChange: (value: string) => void;
}

export default function ArtistFilter({ onFilterChange }: ArtistFilterProps) {
  const [search, setSearch] = useState("");
  const t = useTranslations();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder={t("find-an-artist")}
        value={search}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}
