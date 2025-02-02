"use client";

import { getAllPosts } from "@/actions/posts";
import { PageableResponse } from "@/lib/api";
import { useActions } from "@/lib/hooks";
import { Post } from "@/lib/type";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const PostsPage = () => {
  const { execute, loading } = useActions<PageableResponse<Post>>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const t = useTranslations();
  const getPost = (page: number) => {
    execute(getAllPosts, page).then((res) => {
      if (res?.success) {
        setPosts([...posts, ...res.data.content]);
        setLastPage(res.data.totalPages);
      }
    });
  };

  useEffect(() => {
    getPost(0);
  }, []);

  useEffect(() => {
    getPost(page);
  }, [page]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center  mb-8">
        <h1 className="text-3xl font-bold">{t("nav.posts")}</h1>
      </div>
      <div>
        <div className="grid gap-4">
          {posts.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Button
          loading={loading}
          variant={"outline"}
          onClick={() => {
            setPage(page + 1);
          }}
        >
          {t("load-more")}
        </Button>
      </div>
    </div>
  );
};

export default PostsPage;
