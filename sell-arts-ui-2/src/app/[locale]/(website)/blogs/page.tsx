import { use, useState, useTransition } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Palette, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { getAllArtistProfiles } from "@/actions/artists";
import { StarRatingComponent } from "@/components/star-rating";
import { getAllBlogs, getBlogs } from "@/actions/blog";
import InfoCard from "@/components/InfoCard";

export default function Blogs() {
  const blogs = use(getBlogs());

  return (
    <div className="container mx-auto p-4 grid lg:grid-cols-4 gap-4">
      {blogs.data.map((items, index) => {
        return (
          <Link href={"/blogs/" + items.id!} key={index}>
            <InfoCard title={items.title!} author={items.author!} date={items.createdAt!} duration={items.duration!} />
          </Link>
        );
      })}
    </div>
  );
}
