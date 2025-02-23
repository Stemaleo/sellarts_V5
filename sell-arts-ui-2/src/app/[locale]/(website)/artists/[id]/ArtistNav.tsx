"use client";
import { ArtistProfile, User } from "@/lib/type";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ArtistNav = ({ param, artist }: { param: any; artist: User }) => {
  const path = usePathname();
  const t = useTranslations();
  const navItems = [
    { name: t("common.art-works"), href: `/artists/${param.id}`, show: true, active: path.endsWith(`${param.id}`) },
    { name: t("common.featured"), href: `/artists/${param.id}/featured`, show: true, active: path.endsWith(`${param.id}/featured`) },
    { name: t("common.collaborators"), href: `/artists/${param.id}/collaborators`, show: artist.artistProfile?.artistType === "GALLERY", active: path.endsWith(`${param.id}/collaborators`) },
    { name: t("nav.events"), href: `/artists/${param.id}/events`, show: artist.artistProfile?.artistType === "GALLERY", active: path.endsWith(`${param.id}/events`) },
    { name: t("nav.posts"), href: `/artists/${param.id}/posts`, show: true, active: path.endsWith(`${param.id}/posts`) },
  ];
  return (
    <div className="p-4 mb-6 mt-12 bg-primary rounded flex items-baseline space-x-4 text-white">
      {navItems
        .filter((c) => c.show)
        .map((item) => (
          <Link key={item.name} href={item.href} className={`group relative px-3 py-2 text-sm font-medium ${item.active ? "text-white" : "text-white"} transition-colors duration-200`}>
            {item.name}
            {item.active && <span className="absolute  group-hover:opacity-100 -bottom-4 left-0 w-full h-1 bg-white transition-all duration-200"></span>}
          </Link>
        ))}
    </div>
  );
};

export default ArtistNav;
