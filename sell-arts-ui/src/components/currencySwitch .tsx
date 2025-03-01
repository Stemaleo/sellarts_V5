"use client";

import type { ChangeEventHandler } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export const CurrencySwitcher = () => {
  const router = useRouter();
  // const pathname = usePathname().replace("/usd", "/").replace("/euro", "/").replace("/xof", "/");
  const pathname = usePathname()+"xof";
  const locale = useLocale();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    router.push(`/${event.target.value}${pathname}`);
    router.refresh();
  };

  return (
    <select defaultValue={locale} onChange={handleChange} className="  focus:outline-none focus-visible:ring" aria-label="lang-switcher">
      {["usd", "euro", "xof"].map((elt) => (
        <option key={elt} value={elt}>
          {elt.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
