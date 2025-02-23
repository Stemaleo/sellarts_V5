import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, ShoppingCart, User } from "lucide-react";
import { use } from "react";
import { getArtistProfileWithInfo } from "@/actions/artists";
import { PageProps } from "@/lib/api";
import { StarRatingComponent } from "@/components/star-rating";
import ArtCard from "@/components/ArtCard";
import Link from "next/link";
import { getAllFeaturedArtWorksOfAArtist } from "@/actions/artwork";
import { getArtistPosts } from "@/actions/posts";
import PostCard from "../../../posts/PostCard";
import { getTranslations } from "next-intl/server";

export default async function ArtistPage(props: PageProps) {
  const params = await props.params;
  const res = await getArtistPosts(params.id);
  const t = await getTranslations();

  if (!res.success) {
    return <div>Unable to fetch</div>;
  }

  const artWorks = res.data;

  return (
    <div className="">
      <h2 className="text-3xl font-bold mt-12 mb-6">{t("nav.posts")}</h2>
      {artWorks.length === 0 && <p className="text-center text-gray-500 mt-8">{t("common.no-posts-found")}.</p>}

      <div className="grid grid-cols-1 gap-4 max-w-xl ">
        {artWorks?.map((art) => (
          <PostCard key={art.id} post={art} />
        ))}
      </div>
    </div>
  );
}
