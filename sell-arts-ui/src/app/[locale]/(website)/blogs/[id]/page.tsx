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
import { getSingleBlog } from "@/actions/blog";
import moment from "moment";

export default async function ArtistPage(props: PageProps) {
  const params = await props.params;
  const res = await getSingleBlog(params.id);

  if (!res.success) {
    return <div>Unable to fetch</div>;
  }

  const post = res.data;

  return (
    <div className="container mx-auto p-4">
      <article className="w-full">
        <Link href="/blogs" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center mb-4">
          {/* <img 
        src={post.author} 
        alt={post.author} 
        className="w-10 h-10 rounded-full mr-4"
      /> */}
          <div>
            <p className="font-semibold">{post.author}</p>
          </div>
        </div>
        <div className="text-gray-600 mb-4">
          <p>Duration: {post.duration} minutes</p>
          <p>Created At: {moment(post.createdAt).format("D MMM Y")}</p>
          <p>Updated At: {moment(post.updatedAt).format("D MMM Y")}</p>
        </div>
        <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}
