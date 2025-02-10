import { getMyPosts } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use } from "react";
import PostCardManage from "./PostCardManage";
import { getTranslations } from "next-intl/server";

const Posts = () => {
  const res = use(getMyPosts(0));
  const t = use(getTranslations());

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center  mb-8">
        <h1 className="text-3xl font-bold">{t("my-posts")}</h1>
        <Link href={"/artist_app/posts/create"}>
          <Button>{t("create")}</Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {res.data.map((event) => {
          return (
            <Link key={event.id} href={"#"}>
              <PostCardManage post={event} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Posts;
